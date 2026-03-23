import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24">

        <p className="text-blue-400 uppercase tracking-widest text-sm mb-4 animate-pulse">
          Premium Glasses Collection
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          Elevate Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Vision & Style
          </span>
        </h1>

        <p className="text-gray-400 mt-6 max-w-xl text-lg">
          Discover modern, stylish and high-quality glasses designed for comfort,
          elegance, and everyday confidence.
        </p>

        {/* BUTTONS */}
        <div className="mt-10 flex gap-6 flex-wrap justify-center">

          <Link to="/products">
            <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full text-white font-semibold shadow-lg transition transform hover:scale-110 duration-300">
              Shop Now
            </button>
          </Link>

          <Link to="/products">
            <button className="border border-white/30 px-8 py-3 rounded-full hover:bg-white hover:text-black transition transform hover:scale-105 duration-300">
              Explore Collection
            </button>
          </Link>

        </div>
      </div>

      {/* FEATURE SECTION */}
      <div className="grid md:grid-cols-3 gap-8 px-10 py-16 bg-gray-900">

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <h3 className="text-xl font-bold mb-2">🕶️ Premium Quality</h3>
          <p className="text-gray-400 text-sm">
            High-quality materials for long-lasting durability and comfort.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <h3 className="text-xl font-bold mb-2">⚡ Fast Service</h3>
          <p className="text-gray-400 text-sm">
            Quick delivery and smooth shopping experience.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <h3 className="text-xl font-bold mb-2">🎯 Perfect Fit</h3>
          <p className="text-gray-400 text-sm">
            Designed to match your face shape and personality.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Home;