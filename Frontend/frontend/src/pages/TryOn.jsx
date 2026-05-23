import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function TryOn() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [streamUrl, setStreamUrl] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [glassesList, setGlassesList] = useState([]);

  useEffect(() => {
    setStreamUrl(`http://localhost:8000/try-glasses/${id}`);
    return () => setStreamUrl("");
  }, [id]);

  useEffect(() => {
    fetch("http://localhost:5000/glasses")
      .then((res) => res.json())
      .then((data) => setGlassesList(data))
      .catch((err) => console.error("Error fetching glasses list:", err));
  }, []);

  const handleColorChange = async (color) => {
    await fetch("http://localhost:8000/set-color", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color }),
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

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
      <div className="flex-1 flex flex-col items-center justify-center gap-6 py-6">

        {/* CAMERA */}
        {streamUrl && (
          <img
            src={streamUrl}
            className="w-[700px] max-w-[90%] rounded-2xl shadow-2xl border border-white/10"
            alt="Virtual Try-On Stream"
          />
        )}

        {/* 🕶️ HORIZONTAL GLASSES CAROUSEL */}
        {glassesList.length > 0 && (
          <div className="w-full max-w-[700px] flex flex-col items-center px-4">
            <p className="text-sm font-semibold text-gray-400 mb-3 tracking-wide">
              Select Glass Frame
            </p>
            <div className="flex gap-4 overflow-x-auto w-full pb-3 px-2 no-scrollbar justify-start md:justify-center">
              {glassesList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/try-on/${item.id}`)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl cursor-pointer overflow-hidden border-2 transition duration-300 flex flex-col items-center justify-center p-2 bg-white/5 backdrop-blur-md ${
                    item.id.toString() === id.toString()
                      ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105"
                      : "border-white/10 hover:border-white/30 hover:scale-105"
                  }`}
                >
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    className="h-12 w-full object-contain"
                  />
                  <span className="text-[10px] text-gray-300 mt-2 text-center font-semibold truncate w-full">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------
            🎨 BEAUTIFUL COLOR PICKER
        ---------------------------- */}
        <div className="relative flex flex-col items-center mt-4">

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