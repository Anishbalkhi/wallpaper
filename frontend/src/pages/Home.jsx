import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { postAPI } from "../services/api";

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [originalPosts, setOriginalPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "manager") return "/dashboard/manager";
    return "/dashboard";
  };

  /** Fetch Posts */
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await postAPI.getPosts({ limit: 1000, page: 1 });

      if (res.data.success) {
        setPosts(res.data.posts);
        setOriginalPosts(res.data.posts);
      }
    } catch (err) {
      // Silently handle error - posts will remain empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /** Sorting */
  const sortLatest = () =>
    setPosts([...originalPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

  const sortOldest = () =>
    setPosts([...originalPosts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));

  const sortFree = () => setPosts(originalPosts.filter((p) => p.price === 0));

  const sortPaid = () => setPosts(originalPosts.filter((p) => p.price > 0));

  const resetSort = () => setPosts(originalPosts);

  return (
    <div className="space-y-20 pb-20">

      {/* HERO SECTION */}
      <section className="pt-24 text-center px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
          Discover Beautiful Photos
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          A minimal and elegant photography marketplace where you can upload, explore, and purchase stunning visuals.
        </p>

        {!isAuthenticated ? (
          <div className="flex justify-center gap-4">
            <Link to="/signup" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
              Get Started
            </Link>
            <Link to="/login" className="px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-100 transition">
              Login
            </Link>
          </div>
        ) : (
          <Link
            to={getDashboardPath()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Go to Dashboard →
          </Link>
        )}
      </section>

      {/* FEATURE CARDS - MINIMAL */}
      <section className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard icon="✨" title="Minimal Design" desc="A clean and distraction-free interface." />
        <FeatureCard icon="📷" title="Sell Your Shots" desc="Upload and monetize your photos easily." />
        <FeatureCard icon="🛒" title="Simple Purchases" desc="Instant downloads with a smooth checkout." />
      </section>

      {/* SORTING OPTIONS */}
      <section className="max-w-6xl mx-auto px-4 mt-10">
        <div className="flex flex-wrap gap-3">
          <SortButton label="Latest" action={sortLatest} />
          <SortButton label="Oldest" action={sortOldest} />
          <SortButton label="Free" action={sortFree} />
          <SortButton label="Paid" action={sortPaid} />
          <SortButton label="Reset" action={resetSort} solid />
        </div>

        {/* IMAGES GRID */}
        <div className="mt-10">
          {loading ? (
            <SkeletonGrid />
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">No photos available.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <ImageCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

/* ---------------------- MINIMAL FEATURE CARD ---------------------- */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 rounded-xl bg-white border shadow-sm hover:shadow-md transition text-center">
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

/* ---------------------- MINIMAL SORT BUTTON ---------------------- */
const SortButton = ({ label, action, solid }) => (
  <button
    onClick={action}
    className={`px-4 py-2 rounded-lg text-sm ${
      solid
        ? "bg-gray-800 text-white hover:bg-gray-900"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
    } transition`}
  >
    {label}
  </button>
);

/* ---------------------- MINIMAL IMAGE CARD ---------------------- */
const ImageCard = ({ post }) => (
  <div className="rounded-xl overflow-hidden bg-white border shadow-sm hover:shadow-lg transition group">

    {/* IMAGE */}
    <div className="relative">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-56 object-cover group-hover:opacity-90 transition"
      />

      {/* PRICE BADGE */}
      <span
        className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full shadow ${
          post.price === 0
            ? "bg-green-600 text-white"
            : "bg-blue-600 text-white"
        }`}
      >
        {post.price === 0 ? "Free" : `$${post.price}`}
      </span>
    </div>

    {/* TEXT AREA */}
    <div className="p-4">
      <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
      <p className="text-sm text-gray-500 mt-1 truncate">
        {post.author?.name || "Unknown"}
      </p>
    </div>
  </div>
);

/* ---------------------- LOADING SKELETON ---------------------- */
const SkeletonGrid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="h-56 bg-gray-200 rounded-xl animate-pulse"
      ></div>
    ))}
  </div>
);

export default Home;
