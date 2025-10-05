import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import api from "../api/axios";

export default function Profile() {
  const { user, logout, refreshUser, loading } = useAuth();
  const [image, setImage] = useState(user?.profilePic?.url || null);
  const [uploading, setUploading] = useState(false);
  const [editableUser, setEditableUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  useEffect(() => {
    setImage(user?.profilePic?.url || null);
    setEditableUser({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
    });
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-900 text-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-900 text-white">
        <p className="text-lg">⚠️ You are not logged in.</p>
      </div>
    );
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      await api.post("/api/post/uploadProfilePic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refreshUser();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFieldChange = (e) => {
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put("/api/users/updateProfile", editableUser);
      await refreshUser();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
        
        {/* Left Panel: Avatar + Stats */}
        <div className="flex flex-col items-center justify-center p-6 w-full md:w-1/3 bg-gradient-to-b from-cyan-900 to-purple-900 text-white relative">
          <div className="relative w-36 h-36 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-6xl font-bold mb-4 border-4 border-cyan-400 shadow-lg">
            {image ? (
              <img src={image} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              user.name[0]
            )}
            <label className="absolute bottom-2 right-2 bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-300 transition">
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h8"/>
              </svg>
            </label>
          </div>
          <p className="font-bold text-lg mb-2">{user.role.toUpperCase()}</p>

          {/* Stats */}
          <div className="space-y-2 text-center mt-4">
            <p>📝 Posts: {user.posts?.length || 0}</p>
            <p>💾 Saved: {user.saved?.length || 0}</p>
            <p>💰 Purchases: {user.purchases?.length || 0}</p>
          </div>
        </div>

        {/* Right Panel: Editable Fields */}
        <div className="flex-1 p-6 space-y-5">
          <h1 className="text-3xl font-bold text-cyan-400 mb-4">My Profile</h1>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-300">Name</label>
              <input type="text" name="name" value={editableUser.name} onChange={handleFieldChange}
                className="border border-gray-600 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-300">Email</label>
              <input type="email" name="email" value={editableUser.email} onChange={handleFieldChange}
                className="border border-gray-600 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"/>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-300">Bio</label>
              <textarea name="bio" value={editableUser.bio} onChange={handleFieldChange} rows={3}
                className="border border-gray-600 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"/>
            </div>
          </div>

          <div className="flex gap-3 mt-4 flex-wrap">
            <button onClick={handleSave}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl shadow-md transition">
              Save Changes
            </button>
            <button onClick={logout}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl shadow-md transition">
              Logout
            </button>
          </div>

          {uploading && <p className="text-gray-400 text-sm text-center mt-2">Uploading...</p>}
        </div>
      </div>
    </div>
  );
}
