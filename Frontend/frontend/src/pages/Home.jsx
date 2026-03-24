import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {

  const [glasses, setGlasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    axios.get("http://localhost:5000/glasses")
      .then(res => {
        setGlasses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-28">

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

        <div className="mt-10 flex gap-6 flex-wrap justify-center">
          <Link to="/products">
            <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg transition transform hover:scale-110">
              Shop Now
            </button>
          </Link>

          <Link to="/products">
            <button className="border border-white/30 px-8 py-3 rounded-full hover:bg-white hover:text-black transition transform hover:scale-105">
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

      {/* FEATURED PRODUCTS */}
      <div className="px-10 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Glasses
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading products...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">

            {glasses.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-400 text-sm">${item.price}</p>

                  <Link to="/products">
                    <button className="mt-3 w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg transition">
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* CATEGORY SECTION */}
      <div className="px-10 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Shop By Category
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-10 rounded-2xl text-center hover:scale-105 transition">
            <h3 className="text-xl font-bold">Sunglasses</h3>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-red-500 p-10 rounded-2xl text-center hover:scale-105 transition">
            <h3 className="text-xl font-bold">Reading Glasses</h3>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-10 rounded-2xl text-center hover:scale-105 transition">
            <h3 className="text-xl font-bold">Computer Glasses</h3>
          </div>

        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="bg-blue-600 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Find Your Perfect Glasses Today 😎
        </h2>

        <Link to="/products">
          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition">
            Browse Collection
          </button>
        </Link>
      </div>

    </div>
  );
}

export default Home;