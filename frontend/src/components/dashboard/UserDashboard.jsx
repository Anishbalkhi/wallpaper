import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import GreetingWidget from './widgets/GreetingWidget';
import SalesAnalyticsWidget from './widgets/SalesAnalyticsWidget';
import RecentUploadsWidget from './widgets/RecentUploadsWidget';
import { Upload, TrendingUp, Image, DollarSign } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-fadeUp">
      <GreetingWidget name={user?.name?.split(' ')[0] || 'User'} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column (Analytics & Uploads) */}
        <div className="xl:col-span-8 space-y-8">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
            <QuickStat
              icon={<Image size={20} className="text-indigo-600" />}
              label="Total Uploads"
              value={user?.posts?.length || 0}
              bg="bg-indigo-50"
            />
            <QuickStat
              icon={<DollarSign size={20} className="text-green-600" />}
              label="Total Earnings"
              value={`$${user?.earnings?.toFixed(2) || '0.00'}`}
              bg="bg-green-50"
            />
            <QuickStat
              icon={<TrendingUp size={20} className="text-orange-600" />}
              label="Total Sales"
              value={user?.totalSales || 0}
              bg="bg-orange-50"
            />
          </div>

          {/* Sales Chart */}
          <SalesAnalyticsWidget />

          {/* Recent Uploads */}
          <RecentUploadsWidget />
        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="xl:col-span-4 space-y-8">
          {/* Quick Action / Upload Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200">
            <h3 className="text-2xl font-bold mb-2">Sell your work</h3>
            <p className="text-indigo-100 mb-6 text-sm leading-relaxed">Upload your high-quality photos and start earning today. Reach millions of customers worldwide.</p>
            <Link
              to="/post/create"
              className="w-full flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Upload size={18} />
              Upload Photos
            </Link>
          </div>

          {/* Tips Widget */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Pro Tips</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-600">
                <span className="text-green-500 font-bold">✓</span>
                Use descriptive tags to boost visibility.
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <span className="text-green-500 font-bold">✓</span>
                Upload high-resolution images (min 4MP).
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <span className="text-green-500 font-bold">✓</span>
                Engage with the community by checking out other portfolios.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick stat card component
const QuickStat = ({ icon, label, value, bg }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default UserDashboard;