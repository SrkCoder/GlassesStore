import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [oldImage, setOldImage] = useState("");
  const [newFile, setNewFile] = useState(null);

  // 🔥 LOAD EXISTING DATA
  useEffect(() => {
    axios.get(`http://localhost:5000/glasses/${id}`)
      .then(res => {
        setName(res.data.name);
        setPrice(res.data.price);
        setDescription(res.data.description);
        setOldImage(res.data.image);
      })
      .catch(err => console.log(err));
  }, [id]);

  // 🔥 UPDATE FUNCTION
  const handleUpdate = async (e) => {
    e.preventDefault();

    let imageName = oldImage;

    try {
      // If user selected new image
      if (newFile) {
        const formData = new FormData();
        formData.append("image", newFile);

        const uploadRes = await axios.post(
          "http://localhost:5000/upload",
          formData
        );

        imageName = uploadRes.data.image;
      }

      // Update product
      await axios.put(`http://localhost:5000/update-glass/${id}`, {
        name,
        price,
        description,
        image: imageName,
      });

      alert("✅ Product Updated!");
      navigate("/admin");

    } catch (err) {
      console.log(err);
      alert("❌ Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-6">

      <form
        onSubmit={handleUpdate}
        className="bg-white/5 border border-white/10 p-8 rounded-2xl w-full max-w-lg space-y-4"
      >

        <h1 className="text-2xl font-bold text-center mb-4">
          ✏️ Edit Product
        </h1>

        {/* NAME */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className="w-full p-3 rounded bg-black border border-white/20"
        />

        {/* PRICE */}
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full p-3 rounded bg-black border border-white/20"
        />

        {/* DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-3 rounded bg-black border border-white/20"
        />

        {/* CURRENT IMAGE */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Current Image:</p>
          <img
            src={`http://localhost:5000/uploads/${oldImage}`}
            alt="old"
            className="h-32 rounded"
          />
        </div>

        {/* NEW IMAGE */}
        <input
          type="file"
          onChange={(e) => setNewFile(e.target.files[0])}
          className="w-full"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold transition"
        >
          Update Product
        </button>

      </form>

    </div>
  );
}

export default EditProduct;