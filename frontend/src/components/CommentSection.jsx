import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentApi } from '../api/commentApi';

const CommentSection = ({ postId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await commentApi.getComments(postId);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await commentApi.addComment(postId, { text: newComment });
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    setLoading(true);
    try {
      await commentApi.updateComment(commentId, { text: editText });
      setEditingComment(null);
      setEditText('');
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setLoading(true);
    try {
      await commentApi.deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="card p-4">
          <h3 className="font-semibold mb-3">Add a Comment</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows="3"
            className="input resize-none"
            required
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="btn btn-primary text-sm disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="card p-4 text-center">
          <p className="text-gray-600">
            Please <a href="/login" className="text-blue-600 hover:underline">login</a> to comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Comments ({comments.length})
        </h3>
        
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="card p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={comment.author.profilePic?.url || '/default-avatar.png'}
                    alt={comment.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {comment.author.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Comment Actions */}
                {user && (user._id === comment.author._id || user.role === 'admin') && (
                  <div className="flex space-x-2">
                    {editingComment !== comment._id ? (
                      <>
                        <button
                          onClick={() => startEditing(comment)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleUpdateComment(comment._id)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Comment Text */}
              {editingComment === comment._id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows="3"
                  className="input resize-none w-full"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
              )}

              {/* Comment Metadata */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <span>👍</span>
                    <span>{comment.likes || 0}</span>
                  </button>
                </div>
                
                {comment.updatedAt !== comment.createdAt && (
                  <span className="text-xs text-gray-400">
                    edited
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;