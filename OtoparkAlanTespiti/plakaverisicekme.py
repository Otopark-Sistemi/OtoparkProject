import cv2
import numpy as np
from PIL import Image
import pytesseract
import torch
from ultralytics import YOLO

# Tesseract OCR path (modify according to your system)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# YOLO model path
model_path = r'C:\Users\emirk\OneDrive\Belgeler\GitHub\OtoparkProject\OtoparkAlanTespit\plate_detection.pt'

# Load the YOLO model once
model = YOLO(model_path)

# Check for CUDA support and set the device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

def check_plate_format(plate_text):
    
    print(plate_text)
    
    
    if len(plate_text) < 5:
        return False
    
    # İlk iki karakterin rakam olma ve 01-81 aralığında olma kontrolü
    if not plate_text[:2].isdigit() or not 1 <= int(plate_text[:2]) <= 81:
        return False


    # 3. karakterin harf olma kontrolü
    if not plate_text[2].isalpha():
        return False

    # Son karakterin rakam olma kontrolü
    if not plate_text[len(plate_text)-1].isdigit():
        return False

    return True

def detect_plate(image):
    # Convert the image to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Create a copy of the image array
    image_array = np.asarray(image_rgb).copy()

    max_iterations = 25
    iteration = 0
    while iteration < max_iterations:
        iteration += 1
        results = model(image_array)[0]
        is_detected = len(results.boxes.data.tolist())
        cropped_image = None
        plate_text = ""
    
        if is_detected != 0:
            threshold = 0.5
            for result in results.boxes.data.tolist():
                x1, y1, x2, y2, score, class_id = result
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
    
                if score > threshold:
                    cropped_image = image_array[y1:y2, x1:x2]
                    
                   
                    # Draw rectangle and put text on the image
                    color = (0, 255, 0)
                    font = cv2.FONT_HERSHEY_SIMPLEX
                    cv2.rectangle(image_array, (x1, y1), (x2, y2), color, 2)
                    class_name = results.names[class_id]
                    score_percentage = score * 100
                    text = f"{class_name}: {score_percentage:.2f}%"
                    cv2.putText(image_array, text, (x1, y1-10), font, 0.5, (0, 255, 0), 1, cv2.LINE_AA)
                    print(f"Detection: {text}")
                    
                    # Perform OCR
                    pil_image = Image.fromarray(cropped_image)
                    plate_text = pytesseract.image_to_string(pil_image, config='--psm 11 --oem 3 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 preserve_interword_spaces=True')
                    plate_text = plate_text.strip()
                    
                    if plate_text.startswith('I'):
                        plate_text = plate_text[1:]
                    if plate_text.endswith('I'):
                        plate_text = plate_text[:-1]
                    

                    
                    if check_plate_format(plate_text):
                        print("Plaka formatı doğru:", plate_text)
                        return plate_text
                    else:
                        print("Plaka formatı yanlış, tekrar okunacak:", plate_text)
                        break
        else:
            print("No detection")
            
    print("Max iterations reached, plate not detected")
    return plate_text

