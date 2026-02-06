import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { postAPI } from "../services/api";

const ProfilePostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [text, setText] = useState("");

  const handleLike = async () => {
    const res = await postAPI.likePost(post._id);
    setLikes(res.data.likes);
  };

  const handleComment = async () => {
    if (!text.trim()) return;
    const res = await postAPI.addComment(post._id, text);
    setComments(res.data.comments);
    setText("");
  };

  return (
    <div className="break-inside-avoid bg-white rounded-xl shadow hover:shadow-md transition">
      <img src={post.image} alt={post.title || "Post image"} className="w-full rounded-t-xl" />

      <div className="p-4 space-y-3">
        <p className="font-semibold">{post.title}</p>

        <div className="flex gap-4 text-sm text-gray-600">
          <button onClick={handleLike} className="flex gap-1 items-center">
            <Heart size={16} /> {likes}
          </button>
          <span className="flex gap-1 items-center">
            <MessageCircle size={16} /> {comments.length}
          </span>
        </div>

        <div className="space-y-1 text-sm">
          {comments.slice(0, 2).map((c, i) => (
            <p key={i}>
              <b>{c.user?.name}</b> {c.text}
            </p>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={handleComment}
            className="text-blue-600 text-sm"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePostCard;
