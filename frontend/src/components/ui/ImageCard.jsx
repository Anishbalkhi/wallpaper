import { useState } from "react";
import { Heart, Download } from "lucide-react";
import { postAPI } from "../../services/api";

const ImageCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      setLikeLoading(true);
      const res = await postAPI.likePost(post._id);
      if (res.data.success) {
        setLikes(res.data.likes);
      }
    } catch {
      alert("Login required or already liked");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      setDownloadLoading(true);
      const res = await postAPI.downloadPost(post._id);
      window.open(res.data.url, "_blank");
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Purchase required to download");
      } else {
        alert("Login required");
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="break-inside-avoid group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">

      {/* IMAGE */}
      <img
        src={post.image}
        alt={post.title}
        className="w-full object-cover"
        loading="lazy"
      />

      {/* PRICE BADGE */}
      <div className="absolute top-3 right-3">
        {post.price === 0 ? (
          <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
            Free
          </span>
        ) : (
          <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
            ₹{post.price}
          </span>
        )}
      </div>

      {/* HOVER OVERLAY */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-3">

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
         <button
  onClick={handleLike}
  className="bg-white p-2 rounded-full flex items-center gap-1"
>
  <Heart size={16} className="text-red-500" />
  <span className="text-xs font-semibold">{likes}</span>
</button>

<button
  onClick={handleDownload}
  className="bg-white p-2 rounded-full"
>
  <Download size={16} />
</button>

        </div>

        {/* INFO */}
        <div className="text-white text-sm">
          <p className="font-semibold truncate">{post.title}</p>
          <p className="opacity-80">
            by {post.author?.name || "Unknown"}
          </p>

          {post.category && (
            <span className="inline-block mt-1 text-xs bg-white/20 px-2 py-1 rounded">
              {post.category}
            </span>
          )}
        </div>
      </div>

      {/* TAGS */}
      {post.tags?.length > 0 && (
        <div className="p-3 flex flex-wrap gap-2">
          {post.tags.slice(0, 4).map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-gray-100 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCard;
