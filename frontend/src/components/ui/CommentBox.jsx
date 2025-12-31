import { useState } from "react";
import { postAPI } from "../../services/api";

const CommentBox = ({ postId, comments, setComments }) => {
  const [text, setText] = useState("");

  const submitComment = async () => {
    try {
      const res = await postAPI.addComment(postId, text);
      setComments(res.data.comments);
      setText("");
    } catch {
      alert("Login required");
    }
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="border px-3 py-2 rounded w-full"
      />
      <button onClick={submitComment} className="btn-primary mt-2">
        Comment
      </button>
    </div>
  );
};

export default CommentBox;
