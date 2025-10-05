import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { PlusCircle, Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/api/post/posts");
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-700 rounded-2xl p-4 animate-pulse bg-gray-900"
          >
            <div className="w-full h-48 bg-gray-800 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-800 rounded mb-2"></div>
            <div className="h-3 bg-gray-800 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-medium">{error}</div>
    );
  }

  return (
    <div className="relative p-6 max-w-6xl mx-auto">
      {/* Search bar */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="🔍 Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-700 rounded-full px-5 py-3 w-full sm:w-96 shadow-sm bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />
      </div>

      {/* Posts grid */}
      {filteredPosts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-9">
          {filteredPosts.map((p, i) => (
            <motion.div
              key={p._id || i}
              className="bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-700"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={p.image || "/placeholder.png"}
                  alt={p.title || "Post"}
                  className="w-full h-56 object-cover bg-gray-800"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full shadow">
                  ₹{p.price || 0}
                </div>
                <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full shadow">
                  {p.category || "General"}
                </div>
              </div>

              {/* Post Info */}
              <div className="p-4 text-white">
                <h2 className="font-bold text-lg mb-2 line-clamp-1">{p.title}</h2>

                {/* Author Info */}
                <div className="flex items-center text-sm text-gray-300 mb-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-2 font-semibold bg-cyan-800 text-cyan-400">
                    {p.author?.name?.[0] || "U"}
                  </div>
                  <div>
                    <p className="font-semibold">{p.author?.name || "Unknown"}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{p.author?.bio || "No bio available"}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {p.tags?.length > 0 ? (
                    p.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-purple-700 px-2 py-1 rounded-full text-white"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-white">
                      #NoTags
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center text-gray-400 text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <Heart size={16} /> {p.likes || 0}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} /> {p.comments?.length || 0}
                  </div>
                </div>

                {/* View Details */}
                <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium px-3 py-2 rounded-lg transition shadow">
                  View Details →
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Floating Create Post Button */}
      <motion.button
        onClick={() => navigate("/create")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-cyan-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition"
      >
        <PlusCircle size={28} />
      </motion.button>
    </div>
  );
}
