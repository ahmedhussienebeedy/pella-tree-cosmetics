import { useState } from "react";
import { database, storage } from "../../firebase";
import { ref as dbRef, push } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default function DashAdd() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageURLInput, setImageURLInput] = useState("");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !imageURLInput) return alert("Please select an image or enter an image URL!");

    try {
      setUploading(true);

      let finalImageURL = imageURLInput;
      if (imageFile) {
        const imgRef = storageRef(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imgRef, imageFile);
        finalImageURL = await getDownloadURL(imgRef);
      }

      await push(dbRef(database, "products"), {
        name, description, price: Number(price), image: finalImageURL
      });

      setName(""); setDescription(""); setImageFile(null); setImageURLInput(""); setPrice("");
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white rounded shadow max-w-md mx-auto mt-10">
      <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded" required />
      <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 rounded" required />

      <label className="text-gray-600">Upload Image (optional if URL below is provided):</label>
      <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="border p-2 rounded" />

      <label className="text-gray-600">Or enter Image URL:</label>
      <input type="text" placeholder="https://example.com/image.jpg" value={imageURLInput} onChange={e => setImageURLInput(e.target.value)} className="border p-2 rounded" />

      <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="border p-2 rounded" required />

      <button type="submit" disabled={uploading} className={`bg-green-600 text-white p-2 rounded hover:bg-green-700 transition ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
        {uploading ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
}
