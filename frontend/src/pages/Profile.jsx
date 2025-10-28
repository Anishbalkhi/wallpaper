import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-lg">{user?.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg">{user?.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-lg capitalize">{user?.role}</p>
          </div>
          
          {user?.bio && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <p className="mt-1 text-lg">{user?.bio}</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Profile Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Upload Profile Picture</span>
              <p className="text-gray-600">Coming soon...</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Your Wallpapers</span>
              <p className="text-gray-600">Coming soon...</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Purchase History</span>
              <p className="text-gray-600">Coming soon...</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Account Settings</span>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;