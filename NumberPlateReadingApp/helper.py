import cv2
import numpy as np
from ultralytics import YOLO
import torch
import pytesseract
from PIL import Image

# Tesseract OCR'ın yolu (sisteminize göre değiştirin)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def detect_plate(image, model_path):
    color = (0, 255, 0)
    font = cv2.FONT_HERSHEY_SIMPLEX
    print("[INFO].... Image is loading")
    image_array = np.asarray(image).copy()  # Kopyalayarak readonly bayrağını kaldır

    print("[INFO].... Processing is started")
    model = YOLO(model_path)

    # CUDA desteği olup olmadığını kontrol edin
    if torch.cuda.is_available():
        device = torch.device('cuda')
    else:
        device = torch.device('cpu')
    model.to(device)  # Modeli belirlenen cihaza taşıyın

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
                cv2.rectangle(image_array, (x1, y1), (x2, y2), color, 2)
                class_name = results.names[class_id]
                score = score * 100
                text = f"{class_name}:%{score:.2f}"
                cv2.putText(image_array, text, (x1, y1-10), font, 0.5, (0, 255, 0), 1, cv2.LINE_AA)

                # OCR işlemi
                pil_image = Image.fromarray(cropped_image)
                plate_text = pytesseract.image_to_string(pil_image, config='--psm 8')
                print(f"Detected plate text: {plate_text.strip()}")
    else:
        text = "No detection"
        cv2.putText(image_array, text, (10, 30), font, 0.5, (0, 255, 0), 1, cv2.LINE_AA)

    return image_array, cropped_image, is_detected, plate_text

