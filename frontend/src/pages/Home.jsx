import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { postAPI } from "../services/api";
import PinterestGrid from "../components/ui/PinterestGrid";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [originalPosts, setOriginalPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await postAPI.getPosts({ page: 1, limit: 1000 });
      if (res.data?.success) {
        setPosts(res.data.posts);
        setOriginalPosts(res.data.posts);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* SORTING BASED ON MODEL */
  const sortLatest = () =>
    setPosts([...originalPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

  const sortOldest = () =>
    setPosts([...originalPosts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));

  const sortFree = () => setPosts(originalPosts.filter(p => p.price === 0));
  const sortPaid = () => setPosts(originalPosts.filter(p => p.price > 0));
  const reset = () => setPosts(originalPosts);

  return (
    <div className="relative max-w-7xl mx-auto px-4 pb-24">

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Filter label="Latest" onClick={sortLatest} />
        <Filter label="Oldest" onClick={sortOldest} />
        <Filter label="Free" onClick={sortFree} />
        <Filter label="Paid" onClick={sortPaid} />
        <Filter label="Reset" solid onClick={reset} />
      </div>

      {/* GRID */}
      {loading ? (
        <Skeleton />
      ) : (
        <PinterestGrid posts={posts} />
      )}

      {/* CREATE POST */}
      {isAuthenticated && (
        <button
          onClick={() => navigate("/post/create")}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl hover:scale-105 transition"
        >
          <Plus size={26} />
        </button>
      )}
    </div>
  );
};

export default Home;

/* UI HELPERS */
const Filter = ({ label, onClick, solid }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition
      ${solid ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"}
    `}
  >
    {label}
  </button>
);

const Skeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
    ))}
  </div>
);
