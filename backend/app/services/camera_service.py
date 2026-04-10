import cv2

from backend.app.services.face_recognition_service import run_recognition_frame

_camera = None


def get_camera():
    global _camera

    if _camera is None or not _camera.isOpened():
        _camera = cv2.VideoCapture(0)

        if not _camera.isOpened():
            print("[camera_service] ERROR: Camera not accessible")
        else:
            print("[camera_service] Camera opened successfully")

    return _camera


def generate_frames():
    cam = get_camera()

    while True:
        success, frame = cam.read()
        if not success:
            print("[camera_service] Failed to grab frame")
            break

        frame = run_recognition_frame(frame)

        ret, buffer = cv2.imencode(".jpg", frame)
        if not ret:
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n"
        )


def release_camera():
    global _camera

    if _camera is not None and _camera.isOpened():
        _camera.release()
        _camera = None
        print("[camera_service] Camera released")

def get_camera_status():
    global _camera

    if _camera is not None and _camera.isOpened():
        return {
            "available": True,
            "opened": True,
            "message": "camera ready",
        }

    cam = cv2.VideoCapture(0)
    opened = cam.isOpened()
    if opened:
        cam.release()

    return {
        "available": opened,
        "opened": False,
        "message": "camera ready" if opened else "camera not accessible",
    }
