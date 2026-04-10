import face_recognition
import cv2
import os
import pickle

DATASET_PATH = "datasets"
ENCODINGS_PATH = "encodings/face_encodings.pkl"


def encode_faces():
    known_encodings = []
    known_names = []

    for filename in os.listdir(DATASET_PATH):
        img_path = os.path.join(DATASET_PATH, filename)

        image = cv2.imread(img_path)
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        boxes = face_recognition.face_locations(rgb)
        encodings = face_recognition.face_encodings(rgb, boxes)

        for encoding in encodings:
            known_encodings.append(encoding)
            name = filename.split(".")[0]
            known_names.append(name)

    data = {"encodings": known_encodings, "names": known_names}

    with open(ENCODINGS_PATH, "wb") as f:
        pickle.dump(data, f)

    print("Encodings saved successfully")