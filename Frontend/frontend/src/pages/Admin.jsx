import { Link } from "react-router-dom";

function Admin() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-10 text-center">
        Admin Dashboard ⚙️
      </h1>

      {/* DASHBOARD CARDS */}
      <div className="grid md:grid-cols-3 gap-8">

        {/* ADD PRODUCT */}
        <Link to="/add-product">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition transform hover:-translate-y-2 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">➕ Add Product</h2>
            <p className="text-gray-400 text-sm">
              Upload new glasses to your store
            </p>
          </div>
        </Link>

        {/* VIEW PRODUCTS */}
        <Link to="/products">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition transform hover:-translate-y-2 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">🛍️ View Products</h2>
            <p className="text-gray-400 text-sm">
              See all available products in store
            </p>
          </div>
        </Link>

        {/* FUTURE FEATURE */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center opacity-60 cursor-not-allowed">
          <h2 className="text-xl font-semibold mb-2">📊 Analytics</h2>
          <p className="text-gray-400 text-sm">
            Coming soon...
          </p>
        </div>

      </div>

      {/* QUICK ACTION */}
      <div className="mt-16 text-center">
        <h2 className="text-xl mb-4 text-gray-300">
          Manage your store efficiently
        </h2>

        <Link to="/add-product">
          <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-semibold transition transform hover:scale-105">
            Add New Glasses
          </button>
        </Link>
      </div>

    </div>
  );
}

export default Admin;