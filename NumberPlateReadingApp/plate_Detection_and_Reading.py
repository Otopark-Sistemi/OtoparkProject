import cv2
import numpy as np
from PIL import Image
import pytesseract
import torch
from ultralytics import YOLO

# Tesseract OCR'ın yolu (sisteminize göre değiştirin)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
model_path = 'models/best.pt'  # Model yolu
image_path = 'models/test-image-15.jpg'  # Resim yolu

def detect_plate(image):
    # Resmi yükle ve RGB'ye dönüştür
    image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

    color = (0, 255, 0)
    font = cv2.FONT_HERSHEY_SIMPLEX

    image_array = np.asarray(image).copy()  # Kopyalayarak readonly bayrağını kaldır

    model = YOLO(model_path)

    # CUDA desteği olup olmadığını kontrol edin ve cihazı belirleyin
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
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
                plate_text = pytesseract.image_to_string(pil_image, config='--psm 11 --oem 3 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 preserve_interword_spaces=True')

                print(plate_text)
                print(f"Detected plate text: {plate_text.strip()}")  # Konsola yazdır
                if plate_text.strip() == "":
                    print("OCR işlemi başarısız, tekrar denenecek.")

                # Plaka resmini büyüterek göster
                resized_plate_image = cv2.resize(cropped_image, (cropped_image.shape[1] * 3, cropped_image.shape[0] * 3))

    else:
        print("No detection")  # Konsola yazdır

    return plate_text  # Plaka metnini döndür

# Resmi yükle
image = cv2.imread(image_path)

# Plaka tespiti ve OCR işlemi
plate_text = detect_plate(image)

# Tespit edilen plaka metnini yazdır
if plate_text:
    print(f"Plaka Yazısı: {plate_text.strip()}")
else:
    print("Plaka tespit edilemedi.")