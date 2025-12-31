import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "../services/api";
import Loader from "../components/ui/Loader";

const CreatePost = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !image) {
      setError("Title and image are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("tags", tags); // CSV
      formData.append("file", image);

      const res = await postAPI.createPost(formData);

      if (res.data.success) {
        navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow border">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

      {error && (
        <div className="mb-4 text-red-600 bg-red-50 border p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* IMAGE */}
        <div>
          <label className="block text-sm font-medium mb-2">Image</label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            {preview ? (
              <img src={preview} alt="preview" className="mx-auto max-h-80 rounded-lg" />
            ) : (
              <p className="text-gray-500">Upload an image</p>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-4" />
          </div>
        </div>

        {/* TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* CATEGORY */}
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (e.g. Nature, Travel)"
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* TAGS */}
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* PRICE */}
        <input
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0 = Free"
          className="w-full border rounded-lg px-4 py-2"
        />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/")} className="border px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
            {loading ? "Posting..." : "Publish"}
          </button>
        </div>
      </form>

      {loading && <Loader size="small" />}
    </div>
  );
};

export default CreatePost;
