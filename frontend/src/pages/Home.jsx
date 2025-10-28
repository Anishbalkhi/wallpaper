import { useAuth } from '../context/AuthContext';
import ConnectionTest from '../components/ConnectionTest';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Connection Test */}
      <ConnectionTest />
      
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to WallpaperApp
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover and share beautiful wallpapers
        </p>
        
        {isAuthenticated ? (
          <div className="card p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Hello, {user?.name}!
            </h2>
            <p className="text-gray-600 mb-4">
              You are logged in as <span className="font-medium">{user?.role}</span>
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>✅ Browse wallpapers</p>
              <p>✅ Upload your own creations</p>
              <p>✅ Purchase premium content</p>
            </div>
          </div>
        ) : (
          <div className="card p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Get Started
            </h2>
            <p className="text-gray-600 mb-6">
              Sign up or log in to start exploring beautiful wallpapers
            </p>
            <div className="space-y-3">
              <a
                href="/signup"
                className="block w-full btn btn-primary text-center"
              >
                Create Account
              </a>
              <a
                href="/login"
                className="block w-full btn btn-secondary text-center"
              >
                Sign In
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
