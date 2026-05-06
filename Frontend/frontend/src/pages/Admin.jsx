import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const [glasses, setGlasses] = useState([]);

  // FETCH DATA
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get("http://localhost:5000/glasses")
      .then(res => setGlasses(res.data))
      .catch(err => console.log(err));
  };

  // DELETE FUNCTION
  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      axios.delete(`http://localhost:5000/delete-glass/${id}`)
        .then(() => {
          alert("Deleted successfully");
          fetchProducts(); // refresh without reload
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-10 text-center">
        Admin Dashboard ⚙️
      </h1>

      {/* TOP ACTION */}
      <div className="flex justify-center mb-10">
        <Link to="/add-product">
          <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-semibold transition transform hover:scale-105">
            ➕ Add New Glasses
          </button>
        </Link>
      </div>

      {/* PRODUCT LIST */}
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Manage Products
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {glasses.map(item => (
          <div
            key={item.id}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
          >

            {/* IMAGE */}
            <img
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.name}
              className="h-48 w-full object-cover"
            />

            {/* CONTENT */}
            <div className="p-4">

              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-400 text-sm">${item.price}</p>

              {/* BUTTONS */}
              <div className="flex gap-2 mt-4">

                {/* EDIT */}
                <Link to={`/edit/${item.id}`} className="w-full">
                  <button className="w-full bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg text-black font-medium transition">
                    Edit
                  </button>
                </Link>

                {/* DELETE */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-medium transition"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Admin;