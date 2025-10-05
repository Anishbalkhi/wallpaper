import { useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { Loader2, ImagePlus } from "lucide-react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !file) return alert("Please enter a title and select a file.");

    const form = new FormData();
    form.append("title", title);
    form.append("category", category);
    form.append("price", price);
    form.append("tags", tags.split(",").map(tag => tag.trim()));
    form.append("file", file);

    try {
      setLoading(true);
      await api.post("/api/post/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Post created!");
      setTitle(""); setCategory(""); setPrice(""); setTags(""); setFile(null);
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <motion.form
        onSubmit={handleSubmit}
        className="p-8 sm:p-10 bg-gray-900/90 backdrop-blur-md rounded-3xl w-full max-w-lg sm:max-w-xl space-y-6 shadow-[0_0_20px_#00ffff] border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-cyan-400 drop-shadow-lg">
          ✨ Create a Retro Post
        </h1>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Post Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Write something interesting..."
            className="border border-cyan-500 bg-gray-800 text-white placeholder-cyan-400 p-3 w-full rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Category</label>
          <input
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="Category"
            className="border border-cyan-500 bg-gray-800 text-white placeholder-cyan-400 p-3 w-full rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Price in ₹"
            className="border border-cyan-500 bg-gray-800 text-white placeholder-cyan-400 p-3 w-full rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-cyan-300 mb-1">Tags (comma separated)</label>
          <input
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
            className="border border-cyan-500 bg-gray-800 text-white placeholder-cyan-400 p-3 w-full rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>

        {/* Image Upload */}
        <div className="border-2 border-dashed border-cyan-500 rounded-lg p-5 text-center hover:border-pink-400 transition cursor-pointer bg-gray-800 drop-shadow-md">
          <label className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
            <ImagePlus className="w-10 h-10 text-pink-400" />
            <span className="text-sm text-cyan-300">Click or drag to upload image</span>
            <input type="file" onChange={e => setFile(e.target.files[0])} className="hidden" />
          </label>
          {file && (
            <motion.img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="mt-4 rounded-lg shadow-lg w-full object-cover max-h-64 sm:max-h-80 border border-cyan-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className={`flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 rounded-lg w-full font-medium shadow-[0_0_10px_#00ffff] transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Uploading...
            </>
          ) : (
            "🚀 Upload Post"
          )}
        </button>
      </motion.form>
    </div>
  );
}
