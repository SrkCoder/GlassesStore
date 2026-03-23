import { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload image
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      // Save product
      await axios.post("http://localhost:5000/add-glass", {
        name,
        price,
        description,
        image: uploadRes.data.image,
      });

      alert("Product added successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-10 space-y-4">
      <input
        type="text"
        placeholder="Name"
        className="border p-2 w-full"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Price"
        className="border p-2 w-full"
        onChange={(e) => setPrice(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="bg-green-500 text-white px-4 py-2">
        Add Product
      </button>
    </form>
  );
}

export default AddProduct;