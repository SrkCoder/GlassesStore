import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function TryOn() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [streamUrl, setStreamUrl] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setStreamUrl(`http://localhost:8000/try-glasses/${id}`);
    return () => setStreamUrl("");
  }, [id]);

  const handleColorChange = async (color) => {
    await fetch("http://localhost:8000/set-color", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color }),
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* TOP BAR */}
      <div className="p-4 flex justify-between items-center border-b border-white/10">
        <h1 className="text-xl font-bold">Virtual Try-On 😎</h1>

        <button
          onClick={() => navigate("/products")}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Back
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">

        {/* CAMERA */}
        {streamUrl && (
          <img
            src={streamUrl}
            className="w-[700px] rounded-2xl shadow-2xl border border-white/10"
          />
        )}

        {/* ----------------------------
            🎨 BEAUTIFUL COLOR PICKER
        ---------------------------- */}
        <div className="relative flex flex-col items-center">

          {/* MAIN COLOR BUTTON */}
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="w-16 h-16 rounded-full border-4 border-white/20 shadow-xl
                       hover:scale-110 transition duration-300"
            style={{
              background: "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
            }}
          />

          <p className="text-sm text-gray-300 mt-2">
            Choose Glass Color
          </p>

          {/* FLOATING COLOR PALETTE */}
          {showPicker && (
            <div className="absolute bottom-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl flex gap-3">

              {[
                "#ffffff",
                "#000000",
                "#ff0000",
                "#00ff00",
                "#0000ff",
                "#ffd700",
                "#ff69b4",
                "#00ffff"
              ].map((color, i) => (
                <div
                  key={i}
                  onClick={() => handleColorChange(color)}
                  className="w-8 h-8 rounded-full cursor-pointer border border-white/30 hover:scale-125 transition"
                  style={{ backgroundColor: color }}
                />
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default TryOn;