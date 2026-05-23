import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [glass, setGlass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/glasses/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setGlass(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-400 font-medium">Fetching details...</p>
      </div>
    );
  }

  if (!glass) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-400 font-semibold">Product not found 🕶️</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-xl text-sm font-medium transition"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 md:py-24">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* BACK NAVIGATION */}
        <button
          onClick={() => navigate("/products")}
          className="self-start flex items-center gap-2 text-gray-400 hover:text-white transition duration-300 font-medium text-sm"
        >
          ← Back to Collection
        </button>

        {/* DETAILS SECTION */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: PRODUCT IMAGE DISPLAY */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-12 flex items-center justify-center relative overflow-hidden shadow-2xl group min-h-[350px] md:min-h-[450px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none" />
            <img
              src={`http://localhost:5000/uploads/${glass.image}`}
              alt={glass.name}
              className="max-h-64 object-contain transform group-hover:scale-110 transition duration-500 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            />
          </div>

          {/* RIGHT: METADATA & ACTIONS */}
          <div className="flex flex-col gap-6">
            
            {/* CATEGORY TAG */}
            <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">
              Premium Eyewear Collection
            </span>

            {/* NAME */}
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              {glass.name}
            </h1>

            {/* PRICE */}
            <div className="flex items-baseline gap-4 mt-2">
              <span className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 drop-shadow-[0_0_15px_rgba(96,165,250,0.2)]">
                ${glass.price}
              </span>
              <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full font-semibold">
                In Stock
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-300 leading-relaxed font-light text-base md:text-lg">
              {glass.description || 
                "Indulge in ultimate fashion and optical clarity. This piece features precision hand-crafted alignment, optimized temple tips for comfortable daily usage, and state of the art material compounds engineered to deliver supreme wearability."
              }
            </p>

            {/* SPECIFICATIONS GRID */}
            <div className="grid grid-cols-2 gap-4 mt-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Frame Material</span>
                <span className="text-sm text-gray-200 font-medium">✨ Premium Acetate & Metal</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Lens Protection</span>
                <span className="text-sm text-gray-200 font-medium">🛡️ UV400 Rated Shields</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Weight Class</span>
                <span className="text-sm text-gray-200 font-medium">📦 Ultra Lightweight (18g)</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Optical Fit</span>
                <span className="text-sm text-gray-200 font-medium">🕶️ Unisex Comfort Fit</span>
              </div>
            </div>

            {/* ACTION CTAS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              
              {/* VIRTUAL TRY-ON 😎 */}
              <Link to={`/try-on/${glass.id}`} className="flex-1">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-2xl text-base transition duration-300 transform hover:scale-[1.02] shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2">
                  Try On Virtual 😎
                </button>
              </Link>

              {/* SECURE CHECKOUT / BUY NOW */}
              <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-medium py-4 px-6 rounded-2xl text-base transition duration-300 flex items-center justify-center gap-2">
                Add to Bag 🛒
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductDetails;
