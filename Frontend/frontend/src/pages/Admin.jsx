import { Link } from "react-router-dom";

function Admin() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <Link to="/add-product">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </Link>
    </div>
  );
}

export default Admin;