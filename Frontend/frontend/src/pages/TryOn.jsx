import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function TryOn() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [streamUrl, setStreamUrl] = useState("");

  // ✅ Start stream
  useEffect(() => {
    setStreamUrl(`http://localhost:8000/try-glasses/${id}`);

    // ✅ Cleanup when leaving page (VERY IMPORTANT)
    return () => {
      setStreamUrl(""); // stop stream
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* TOP BAR */}
      <div className="p-4 flex justify-between items-center border-b border-white/10">
        <h1 className="text-xl font-bold">Virtual Try-On 😎</h1>

        {/* ✅ FIXED BACK BUTTON */}
        <button
          onClick={() => navigate("/products")}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Back
        </button>
      </div>

      {/* CAMERA STREAM */}
      <div className="flex-1 flex justify-center items-center">

        {streamUrl && (
          <img
            src={streamUrl}
            alt="Try On"
            className="w-[700px] h-auto rounded-2xl shadow-2xl border border-white/10"
          />
        )}

      </div>

    </div>
  );
}

export default TryOn;