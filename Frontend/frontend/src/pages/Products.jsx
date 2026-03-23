import axios from "axios";
import { useEffect, useState } from "react";

function Products() {
  const [glasses, setGlasses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/glasses")
      .then(res => setGlasses(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      {glasses.map(item => (
        <div key={item.id} className="shadow-lg p-4 rounded">
          <img
            src={`http://localhost:5000/uploads/${item.image}`}
            alt=""
            className="h-40 w-full object-cover"
          />
          <h2 className="text-lg font-bold mt-2">{item.name}</h2>
          <p>${item.price}</p>
        </div>
      ))}
    </div>
  );
}

export default Products;