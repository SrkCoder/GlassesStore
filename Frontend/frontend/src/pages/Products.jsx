import axios from "axios";
import { useEffect, useState } from "react";

function Products() {
  const [glasses, setGlasses] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-black text-white px-6 py-12">

      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold text-center mb-10">
        Our Collection 🕶️
      </h1>

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-gray-400">Loading products...</p>
      ) : glasses.length === 0 ? (
        <p className="text-center text-gray-400">No products found</p>
      ) : (

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {glasses.map(item => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              
              {/* IMAGE */}
              <div className="overflow-hidden">
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.name}
                  className="h-52 w-full object-cover hover:scale-110 transition duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4">

                <h2 className="text-lg font-semibold">
                  {item.name}
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Premium Quality Glasses
                </p>

                {/* PRICE */}
                <p className="text-blue-400 text-lg font-bold mt-2">
                  ${item.price}
                </p>

                {/* BUTTON */}
                <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-medium transition transform hover:scale-105">
                  View Details
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Products;