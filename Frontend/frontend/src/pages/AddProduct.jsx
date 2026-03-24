import { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      await axios.post("http://localhost:5000/add-glass", {
        name,
        price,
        description,
        image: uploadRes.data.image,
      });

      alert("Product added successfully!");

      // Reset form
      setName("");
      setPrice("");
      setDescription("");
      setFile(null);
      setPreview(null);

    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl space-y-6"
      >

        <h2 className="text-2xl font-bold text-center mb-4">
          Add New Glasses 🕶️
        </h2>

        {/* NAME */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-white/20 focus:border-blue-500 outline-none"
          required
        />

        {/* PRICE */}
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-white/20 focus:border-blue-500 outline-none"
          required
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-white/20 focus:border-blue-500 outline-none"
          rows="4"
          required
        />

        {/* IMAGE INPUT */}
        <div>
          <label className="block mb-2 text-sm text-gray-400">
            Upload Image
          </label>

          <input
            type="file"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-300"
            required
          />
        </div>

        {/* IMAGE PREVIEW */}
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="preview"
              className="w-full h-48 object-cover rounded-lg border border-white/10"
            />
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold transition transform hover:scale-105"
        >
          Add Product
        </button>

      </form>
    </div>
  );
}

export default AddProduct;