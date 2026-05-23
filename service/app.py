from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
import requests
import os

app = Flask(__name__)
CORS(app)

# ----------------------------
# GLOBAL STATE
# ----------------------------
cap = None
streaming = False

# 🎨 NEW: selected color (default white)
selected_color = (255, 255, 255)

# ----------------------------
# MEDIA PIPE
# ----------------------------
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True
)

# ----------------------------
# BASE PATH
# ----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "backend", "uploads"))

# ----------------------------
# GET GLASSES FROM NODE
# ----------------------------
def get_glasses_image(glass_id):
    try:
        res = requests.get(f"http://localhost:5000/glasses/{glass_id}")
        data = res.json()
        return data.get("image")
    except:
        return None

# ----------------------------
# COLOR API (NEW)
# ----------------------------
@app.route("/set-color", methods=["POST"])
def set_color():
    global selected_color

    data = request.get_json()
    hex_color = data.get("color", "#ffffff").lstrip("#")

    selected_color = tuple(int(hex_color[i:i+2], 16) for i in (4, 2, 0))

    print("🎨 COLOR UPDATED:", selected_color)

    return jsonify({"message": "color updated"})

# ----------------------------
# OVERLAY FUNCTION (UPDATED FOR COLOR)
# ----------------------------
def overlay_transparent(background, overlay, x, y, w, h, angle=0):
    global selected_color

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

    # ----------------------------
    # 🎨 COLOR BLENDING ADDED HERE
    # ----------------------------
    if overlay.shape[2] == 4:
        b, g, r, a = cv2.split(overlay)

        color_layer = np.zeros_like(overlay[:, :, :3])
        color_layer[:] = selected_color

        rgb = cv2.addWeighted(overlay[:, :, :3], 0.3, color_layer, 0.7, 0)

        overlay = cv2.merge((rgb, a))

        alpha = overlay[:, :, 3] / 255.0
        inv = 1.0 - alpha

        for c in range(3):
            background[y:y+h, x:x+w, c] = (
                alpha * overlay[:, :, c] +
                inv * background[y:y+h, x:x+w, c]
            )

    return background

# ----------------------------
# STOP CAMERA
# ----------------------------
@app.route("/stop-camera", methods=["POST"])
def stop_camera():
    global cap, streaming

    streaming = False

    if cap is not None:
        cap.release()
        cap = None
        print("🎥 Camera stopped")

    return jsonify({"message": "camera stopped"})

# ----------------------------
# TRY GLASSES
# ----------------------------
@app.route("/try-glasses/<int:glass_id>")
def try_glasses(glass_id):
    global cap, streaming

    if cap is not None:
        cap.release()

    cap = cv2.VideoCapture(0)
    streaming = True

    if not cap.isOpened():
        return "Camera not accessible", 500

    image_name = get_glasses_image(glass_id)

    if not image_name:
        return "Image not found in DB", 404

    image_path = os.path.join(UPLOADS_DIR, image_name)

    glasses_img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)

    if glasses_img is None:
        return "Failed to load image", 404

    def generate():
        global cap, streaming

        # 🛡️ SMOOTHING STATE FOR STABILIZATION
        smooth_x = None
        smooth_y = None
        smooth_w = None
        smooth_h = None
        smooth_angle = None

        ALPHA = 0.35  # Smoothing factor (balance between response speed and jitter elimination)
        
        last_valid_state = None
        frames_without_detection = 0
        MAX_LOST_FRAMES = 5  # Allow up to 5 consecutive frames of tracking failure without flickering

        try:
            while streaming:
                success, frame = cap.read()
                if not success:
                    break

                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = face_mesh.process(rgb)

                detected = False

                if results.multi_face_landmarks:
                    for face in results.multi_face_landmarks:
                        detected = True
                        frames_without_detection = 0

                        h, w, _ = frame.shape

                        left_eye = np.array([
                            int(face.landmark[33].x * w),
                            int(face.landmark[33].y * h)
                        ])

                        right_eye = np.array([
                            int(face.landmark[263].x * w),
                            int(face.landmark[263].y * h)
                        ])

                        eye_center = (left_eye + right_eye) / 2

                        dist = int(np.linalg.norm(left_eye - right_eye))

                        gw = int(dist * 2.2)
                        gh = int(gw * 0.6)

                        x = int(eye_center[0] - gw // 2)
                        y = int(eye_center[1] - gh // 2 + int(gh * 0.12))

                        # Negated angle to correct for Y-down coordinates relative to OpenCV's rotation direction
                        angle = -np.degrees(np.arctan2(
                            right_eye[1] - left_eye[1],
                            right_eye[0] - left_eye[0]
                        ))

                        # Apply Exponential Moving Average (EMA) smoothing
                        if smooth_x is None:
                            smooth_x = x
                            smooth_y = y
                            smooth_w = gw
                            smooth_h = gh
                            smooth_angle = angle
                        else:
                            smooth_x = int(ALPHA * x + (1 - ALPHA) * smooth_x)
                            smooth_y = int(ALPHA * y + (1 - ALPHA) * smooth_y)
                            smooth_w = int(ALPHA * gw + (1 - ALPHA) * smooth_w)
                            smooth_h = int(ALPHA * gh + (1 - ALPHA) * smooth_h)
                            smooth_angle = ALPHA * angle + (1 - ALPHA) * smooth_angle

                        last_valid_state = (smooth_x, smooth_y, smooth_w, smooth_h, smooth_angle)

                        frame = overlay_transparent(
                            frame, glasses_img, smooth_x, smooth_y, smooth_w, smooth_h, smooth_angle
                        )
                        break  # Process only the primary face

                if not detected:
                    frames_without_detection += 1
                    if last_valid_state is not None and frames_without_detection <= MAX_LOST_FRAMES:
                        # Draw at last known smoothed state to prevent flicker
                        sx, sy, sw, sh, sa = last_valid_state
                        frame = overlay_transparent(
                            frame, glasses_img, sx, sy, sw, sh, sa
                        )
                    else:
                        # Clear tracking state if face is lost for too long
                        smooth_x = None
                        smooth_y = None
                        smooth_w = None
                        smooth_h = None
                        smooth_angle = None
                        last_valid_state = None

                _, buffer = cv2.imencode(".jpg", frame)

                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n" +
                    buffer.tobytes() +
                    b"\r\n"
                )

        finally:
            if cap:
                cap.release()
                cap = None
            streaming = False
            print("🎥 Camera released")

    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")

# ----------------------------
# RUN
# ----------------------------
if __name__ == "__main__":
    print("🚀 Server running on http://localhost:8000")
    app.run(debug=True, port=8000)