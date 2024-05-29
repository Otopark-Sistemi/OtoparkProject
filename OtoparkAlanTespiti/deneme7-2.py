
import cv2  # OpenCV kütüphanesini projeye dahil eder
import pandas as pd  # Pandas kütüphanesini projeye dahil eder
import numpy as np  # NumPy kütüphanesini projeye dahil eder
import json  # JSON işlemleri için json kütüphanesini projeye dahil eder
from datetime import datetime  # Tarih ve saat işlemleri için datetime modülünden datetime sınıfını projeye dahil eder
from ultralytics import YOLO  # Ultralytics YOLO kütüphanesini projeye dahil eder
from plakaverisicekme import detect_plate  # Plaka tanıma işlemleri için projenin plakaverisicekme modülünden detect_plate fonksiyonunu dahil eder
import http.client  # HTTP istemcisi için http.client modülünü projeye dahil eder
import requests  # HTTP istekleri yapmak için requests kütüphanesini projeye dahil eder
import time  # Zaman işlemleri için time modülünü projeye dahil eder


# "nesne.txt" dosyasını okur, her satırı bir eleman olarak içeren class_list listesini oluşturur
with open("nesne.txt", "r") as my_file:
    class_list = my_file.read().split("\n")

# API adresini belirler
api = "192.168.159.210"

# Belirtilen API adresine bağlanarak, tüm alan bilgilerini getiren bir HTTP GET isteği yapar
conn = http.client.HTTPConnection(api, 8082) 
conn.request("GET", "/area/getAll") 
res = conn.getresponse()  

# Gelen yanıtı JSON formatından çözerek alan bilgilerini areas_data değişkenine yükler
areas_data = json.loads(res.read().decode('utf-8'))
areas = []

# Her bir alandaki koordinatları ve diğer bilgileri işler
for area in areas_data:
    area_id = area["id"]
    block_name = area["blockName"]
    area_number = area["parkNumber"]
    coordinates_list = area["coordinatesList"]
    print(f"area_id: {area_id}")
    print(f"block_name: {block_name}")
    
    # Alanın koordinatlarını döngü içinde işler ve points_text değişkenine atar
    for area_number, points in coordinates_list.items():
        points_text = [[point['x'], point['y']] for point in points]
        print(f"area_number: {area_number}")
        print(f"points_text: {points_text}")
        # Alanın bilgilerini areas listesine ekler
        areas.append({"id": area_id, "points": points_text, "block_name": block_name, "area_number": area_number})
        
# Tüm alanların doluluk durumunu saklayan bir sözlük oluşturur
parking_status = {area['block_name'] + ' - ' + str(area['area_number']): 'empty' for area in areas}
    
# Modeli yükle
model = YOLO('yolov8s.pt')

# Videoyu aç
cap = cv2.VideoCapture('D:\arac2.mov')

# Video penceresini oluştur
cv2.namedWindow('FRAME', cv2.WINDOW_NORMAL)
cv2.resizeWindow('FRAME', 893, 502)

# Çerçeve sayacı
count = 0
# Tam ekran modu
fullscreen = False
# Giriş zamanları
entry_times = {}


while True:
    # Bir sonraki çerçeveyi al
    ret, frame = cap.read()
    if not ret:
        # Video bitmişse başa dön
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        continue
    
    # Video FPS'ini al
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_time = int(1000 / fps) if fps > 0 else 25
    
    # Her üç çerçevede bir işlem yap
    count += 1
    if count % 3 != 0:
        continue

    # Tam ekran modunu kontrol et ve ayarla
    if fullscreen:
        cv2.setWindowProperty('FRAME', cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
    else:
        cv2.setWindowProperty('FRAME', cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_NORMAL)

    # Çerçeveyi kopyala
    frame_copy = frame.copy()
    
    # Modeli kullanarak tahmin yap
    results = model.predict(frame)
    a = results[0].boxes.data
    px = pd.DataFrame(a).astype("float")

    # Tespit edilen araçlar listesi
    detected_vehicles = []
    
    # Her bir tespit için
    for index, row in px.iterrows():
        x1 = int(row[0])
        y1 = int(row[1])
        x2 = int(row[2])
        y2 = int(row[3])
        d = int(row[5])
        
        # Sınıfı al
        c = class_list[d] if 0 <= d < len(class_list) else "Unknown"
        
        # Araç merkezini hesapla
        cx = int(x1 + x2) // 2
        cy = int(y1 + y2) // 2
        
        # Araç tipi 'car', 'bus' ya da 'truck' ise
        if 'car' or 'bus' in c:
            # Tespit edilen araçları listeye ekle
            detected_vehicles.append({"x1": x1, "y1": y1, "x2": x2, "y2": y2})
            
            # Araç çerçevesini ve türünü çerçeveye çiz
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 255, 255), 2)  
            cv2.putText(frame, c, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2) 

    # Her bir alana
    for area in areas:
        # Alanın köşe noktalarını al
        rect = np.array(area["points"])
        pts = np.array(rect, np.int32)
        pts = pts.reshape((-1, 1, 2))
        
        # Alanı çiz
        resized_pts = (pts * [frame.shape[1] / 893, frame.shape[0] / 502]).astype(np.int32)
        
        cv2.polylines(frame, [resized_pts], True, (0, 255, 0), 2)
        cv2.putText(frame, f'{area["block_name"]} - {area["area_number"]}', tuple(resized_pts[0][0]), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        area_key = area['block_name'] + ' - ' + str(area['area_number'])
        
        for vehicle in detected_vehicles:
            cx1, cy1 = (vehicle["x1"] + vehicle["x2"]) // 2, (vehicle["y1"] + vehicle["y2"]) // 2
            if cv2.pointPolygonTest(resized_pts, (cx1, cy1), False) >= 0:
                cv2.circle(frame, (cx1, cy1), 5, (255, 0, 0), -1)
                cv2.polylines(frame, [resized_pts], True, (0, 0, 255), 2)

                # Eğer park alanı boşsa
                if parking_status[area_key] == 'empty':
                    entry_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S%z")
                    
                    # Eğer bu alana ilk giriş yapılıyorsa
                    if area_key not in entry_times:
                        entry_times[area_key] = time.time() 
                        
                    keys_to_remove = []

                    for area_key, entry_time in entry_times.items():
                        
                        # Eğer alandaki araç 15 saniyeden fazla süredir park etmişse
                        if parking_status[area_key] == 'empty' and time.time() - entry_time > 15:
                            keys_to_remove.append(area_key)
                    
                    # Geçerli anahtarları kaldır
                    for area_key in keys_to_remove:
                        entry_times.pop(area_key)
                        
                        
                        # Araç plakasını al ve API'ye gönder
                        plate_img = frame_copy[vehicle["y1"]:vehicle["y2"], vehicle["x1"]:vehicle["x2"]]
                    
                        plate_text = detect_plate(plate_img)
                        print("Plaka metni:", plate_text)
                        
                        data = {
                            "plaka": plate_text,
                            "park_alani": area['area_number']  # Örnek park alanı numarası
                        }
                        headers = {
                            "Content-Type": "application/json"
                        }
                        url = "http://" + str(api) + ":8082/arac/create/"+ str(area['id'])
                        response = requests.post(url, json=data, headers=headers)
                        
                        # Park alanını dolu olarak işaretle
                        parking_status[area_key] = 'occupied'
                    
                break
        else:
            
            # Eğer park alanı doluysa
            if parking_status[area_key] == 'occupied':
                
                # Araç çıkışı yapıldığında API'yi kullanarak kaydı sil
                url = "http://"+ str(api) + ":8082/arac/delete/" + str(area['block_name']) + str('/') + str(area['area_number'])
                
                response = requests.delete(url)
                # Park alanını boş olarak işaretle
                parking_status[area_key] = 'empty'
    
    # Ekran görüntüsünü göster
    cv2.imshow('FRAME', frame)
    key = cv2.waitKey(frame_time) & 0xFF
    if key == ord('q'):
        break


cap.release()
cv2.destroyAllWindows()
