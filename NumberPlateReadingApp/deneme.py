import cv2
import numpy as np
from ultralytics import YOLO
import torch
import pytesseract
from PIL import Image

# Tesseract OCR yolunu ayarlayın
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def preprocess_for_ocr(cropped_image):
    # Gri tonlamaya çevirme
    gray_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
    # Gürültü azaltma
    denoised_image = cv2.fastNlMeansDenoising(gray_image, None, 30, 7, 21)
    # Eşikleme
    _, thresh_image = cv2.threshold(denoised_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh_image

def detect_plate(image, model_path):
    color = (0, 255, 0)
    font = cv2.FONT_HERSHEY_SIMPLEX

    image_array = np.asarray(image).copy()

    model = YOLO(model_path)

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)

    results = model(image_array)[0]

    is_detected = len(results.boxes.data.tolist())
    plate_text = ""

    if is_detected != 0:
        threshold = 0.5
        for result in results.boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = result
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

            if score > threshold:
                cropped_image = image_array[y1:y2, x1:x2]
                processed_image = preprocess_for_ocr(cropped_image)
                # Tesseract OCR ayarlarını optimize edin
                plate_text = pytesseract.image_to_string(processed_image, config='--psm 6 --oem 3 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
                print(f"Tespit edilen plaka metni: {plate_text.strip()}")

    else:
        print("Plaka tespit edilemedi.")

    return plate_text

# Resim yolu
image_path = 'models/test-image-12.jpg'
model_path = 'models/plate_detection.pt'

# Resmi yükle ve RGB'ye dönüştür
image = Image.open(image_path).convert('RGB')

# Plaka tespiti ve OCR işlemi
plate_text = detect_plate(image, model_path)

# Tespit edilen plaka metnini yazdır
if plate_text:
    print(f"Plaka Yazısı: {plate_text.strip()}")
else:
    print("Plaka tespit edilemedi.")
