import cv2
import os

name = input("Enter user name: ")
path = f"datasets/{name}"

os.makedirs(path, exist_ok=True)

cap = cv2.VideoCapture(0)

count = 0

while True:
    ret, frame = cap.read()

    cv2.imshow("Capture Faces", frame)

    if cv2.waitKey(1) & 0xFF == ord('s'):
        img_path = f"{path}/{count}.jpg"
        cv2.imwrite(img_path, frame)
        count += 1
        print(f"Saved {img_path}")

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
import cv2
import os

name = input("Enter user name: ")
path = f"datasets/{name}"

os.makedirs(path, exist_ok=True)

cap = cv2.VideoCapture(0)

count = 0

while True:
    ret, frame = cap.read()

    cv2.imshow("Capture Faces", frame)

    if cv2.waitKey(1) & 0xFF == ord('s'):
        img_path = f"{path}/{count}.jpg"
        cv2.imwrite(img_path, frame)
        count += 1
        print(f"Saved {img_path}")

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()