import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide text-white">
          👓 Glasses <span className="text-blue-400">Store</span>
        </h1>
      
        {/* Links */}
        <div className="flex items-center space-x-8 text-sm font-medium">

          <Link
            to="/"
            className="text-gray-300 hover:text-white transition duration-300 relative group"
          >
            Home
          
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/products"
            className="text-gray-300 hover:text-white transition duration-300 relative group"
          >
            Products
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to="/admin"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;