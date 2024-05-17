#Library
import cv2
from PIL import Image
import streamlit as st
from helper import detect_plate

#Title
st.title("Plaka Tanıma Sistemi")
#Header
st.header("Resim Yükle")
#Files
file = st.file_uploader("",type=["png","jpg","jpeg"])
#Model
model_path= "models/plate_detection.pt"
#Images
if file is not None:
    st.header("Original Image")
    image=Image.open(file).convert('RGB')
    st.image(image,use_column_width=True)

    st.header("Processed Image")
    detection_result, cropped_image, is_detected, plate_text = detect_plate(image, model_path)

    if is_detected != 0:
        st.write("#### [info]..Plate is detected")
        st.image(detection_result, use_column_width=True)
        st.image(cropped_image, use_column_width=True)
        st.write(f"Plaka Yazısı: {plate_text.strip()}")
    else:
        st.write("#### [info]..Plate is not detected")
        st.image(detection_result, use_column_width=True)
