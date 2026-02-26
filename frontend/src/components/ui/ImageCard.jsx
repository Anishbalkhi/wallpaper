import { useState } from "react";
import { Heart, Download, Eye } from "lucide-react";
import { postAPI } from "../../services/api";
import { getOptimizedUrl } from "../../utils/cloudinary";

const ImageCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLike = async (e) => {
    e.stopPropagation();
    setError('');
    try {
      setLikeLoading(true);
      const res = await postAPI.likePost(post._id);
      if (res.data.success) {
        setLikes(res.data.likes);
        setLiked(true);
      }
    } catch (err) {
      const msg = err?.response?.data?.msg || 'Login required to like';
      setError(msg);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    setError('');
    try {
      setDownloadLoading(true);
      const res = await postAPI.downloadPost(post._id);
      window.open(res.data.url, "_blank");
    } catch (err) {
      const status = err?.response?.status;
      const msg = status === 403
        ? 'Purchase required'
        : err?.response?.data?.msg || 'Login required';
      setError(msg);
      setTimeout(() => setError(''), 3000);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="break-inside-avoid group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-5">

      {/* IMAGE */}
      <img
        src={getOptimizedUrl(post.image)}
        alt={post.title}
        className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        decoding="async"
      />

      {/* PRICE BADGE */}
      <div className="absolute top-3 right-3 z-10">
        {post.price === 0 ? (
          <span className="bg-green-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg shadow-green-500/30">
            Free
          </span>
        ) : (
          <span className="bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg shadow-indigo-600/30">
            ₹{post.price}
          </span>
        )}
      </div>

      {/* HOVER OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">

        {/* TOP ACTIONS */}
        <div className="flex justify-end gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`backdrop-blur-sm p-2 rounded-full flex items-center gap-1.5 transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 ${liked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
          >
            <Heart size={14} className={liked ? 'fill-current' : ''} />
            <span className="text-xs font-bold">{likes}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloadLoading}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
          >
            <Download size={14} className="text-gray-700" />
          </button>
        </div>

        {/* BOTTOM INFO */}
        <div className="text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          <p className="font-semibold text-sm truncate drop-shadow-sm">{post.title}</p>
          <p className="text-white/70 text-xs mt-0.5">
            by {post.author?.name || "Unknown"}
          </p>

          {post.category && (
            <span className="inline-block mt-2 text-[10px] font-medium bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
              {post.category}
            </span>
          )}
        </div>
      </div>

      {/* ERROR TOAST */}
      {error && (
        <div className="absolute top-3 left-3 right-16 bg-red-600/90 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-2 rounded-xl shadow-lg z-20 animate-scaleIn">
          {error}
        </div>
      )}

      {/* TAGS */}
      {post.tags?.length > 0 && (
        <div className="p-3 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-[11px] text-gray-400 px-1 py-0.5">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCard;
