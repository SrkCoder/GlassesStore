from flask import Flask, Response
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
import requests
import os

app = Flask(__name__)
CORS(app)

# ----------------------------
# PATH SETUP
# ----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ----------------------------
# MEDIAPIPE
# ----------------------------
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True
)

# ----------------------------
# GET IMAGE FROM NODE
# ----------------------------
def get_glasses_image(glass_id):
    try:
        res = requests.get(f"http://localhost:5000/glasses/{glass_id}")
        data = res.json()

        print("NODE RESPONSE:", data)

        return data.get("image", None)
    except Exception as e:
        print("ERROR:", e)
        return None

# ----------------------------
# OVERLAY FUNCTION
# ----------------------------
def overlay_transparent(background, overlay, x, y, w, h, angle=0):
    overlay = cv2.resize(overlay, (w, h))

    M = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1.0)
    overlay = cv2.warpAffine(
        overlay, M, (w, h),
        flags=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=(0, 0, 0, 0),
    )

    b_h, b_w = background.shape[:2]

    x = max(0, x)
    y = max(0, y)

    w = min(w, b_w - x)
    h = min(h, b_h - y)

    if w <= 0 or h <= 0:
        return background

    overlay = cv2.resize(overlay, (w, h))

    if overlay.shape[2] == 4:
        alpha = overlay[:, :, 3] / 255.0
        alpha_inv = 1.0 - alpha

        for c in range(3):
            background[y:y+h, x:x+w, c] = (
                alpha * overlay[:, :, c] +
                alpha_inv * background[y:y+h, x:x+w, c]
            )

    else:
        background[y:y+h, x:x+w] = overlay[:, :, :3]

    return background

# ----------------------------
# ROUTE
# ----------------------------
@app.route("/try-glasses/<int:glass_id>")
def try_glasses(glass_id):

    # ✅ CAMERA CHECK
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("❌ Camera not opening")
        return "Camera not accessible", 500
    else:
        print("✅ Camera opened")

    # ----------------------------
    # GET IMAGE
    # ----------------------------
    image_name = get_glasses_image(glass_id)

    if not image_name:
        return "Image not found in DB", 404

    image_path = os.path.abspath(
        os.path.join(BASE_DIR, "..", "backend", "uploads", image_name)
    )

    print("IMAGE PATH:", image_path)
    print("FILE EXISTS:", os.path.exists(image_path))

    glasses_img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)

    if glasses_img is None:
        return f"Failed to load image: {image_path}", 404
    else:
        print("✅ Image loaded successfully")

    # ----------------------------
    # STREAM
    # ----------------------------
    def generate():
        while True:
            success, frame = cap.read()

            if not success:
                print("❌ Frame not captured")
                break
            else:
                print("✅ Frame captured")

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb)

            if results.multi_face_landmarks:
                for face in results.multi_face_landmarks:

                    h, w, _ = frame.shape

                    left_eye = np.array([
                        int(face.landmark[33].x * w),
                        int(face.landmark[33].y * h)
                    ])

                    right_eye = np.array([
                        int(face.landmark[263].x * w),
                        int(face.landmark[263].y * h)
                    ])

                    nose = np.array([
                        int(face.landmark[6].x * w),
                        int(face.landmark[6].y * h)
                    ])

                    dist = int(np.linalg.norm(left_eye - right_eye))

                    gw = int(dist * 2.2)
                    gh = int(gw * 0.6)

                    x = int(nose[0] - gw // 2)
                    y = int(nose[1] - gh // 2)

                    angle = np.degrees(np.arctan2(
                        right_eye[1] - left_eye[1],
                        right_eye[0] - left_eye[0]
                    ))

                    frame = overlay_transparent(
                        frame, glasses_img, x, y, gw, gh, angle
                    )

            _, buffer = cv2.imencode(".jpg", frame)

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" +
                buffer.tobytes() +
                b"\r\n"
            )

        cap.release()

    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")

# ----------------------------
# RUN
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True, port=8000)