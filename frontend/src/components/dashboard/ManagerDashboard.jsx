import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Icon components for better maintainability
const Icons = {
  Document: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Warning: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  Users: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Revenue: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Shield: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Chart: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  UserManagement: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  )
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, color = "blue" }) => {
  const IconComponent = icon;
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" }
  };

  const { bg, text } = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center">
        <div className={`p-3 ${bg} rounded-lg`}>
          <IconComponent className={`w-6 h-6 ${text}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Approval Item Component
const ApprovalItem = ({ id, onApprove, onReject }) => (
  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-300 rounded-lg flex-shrink-0" aria-hidden="true" />
      <div>
        <p className="font-medium text-gray-900">Photo by User{id}</p>
        <p className="text-sm text-gray-500">Uploaded 2 hours ago</p>
      </div>
    </div>
    <div className="flex space-x-2">
      <button 
        onClick={() => onApprove(id)}
        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label={`Approve item ${id}`}
      >
        Approve
      </button>
      <button 
        onClick={() => onReject(id)}
        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label={`Reject item ${id}`}
      >
        Reject
      </button>
    </div>
  </div>
);

// Report Item Component
const ReportItem = ({ id }) => (
  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icons.Warning className="w-5 h-5 text-red-600" />
      </div>
      <div>
        <p className="font-medium text-gray-900">Report #{id} - Inappropriate Content</p>
        <p className="text-sm text-gray-500">Reported by user • 1 hour ago</p>
      </div>
    </div>
    <button 
      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      aria-label={`Review report ${id}`}
    >
      Review
    </button>
  </div>
);

// Manager Action Button Component
const ManagerAction = ({ icon, label, onClick }) => {
  const IconComponent = icon;
  return (
  <button 
    onClick={onClick}
    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
  >
    <div className="flex items-center">
      <IconComponent className="w-5 h-5 text-purple-400 mr-3" />
      <span className="font-medium">{label}</span>
    </div>
  </button>
  );
};

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState(5);
  const [reportedContent] = useState(3);

  const handleApprove = (id) => {
    setPendingApprovals(prev => prev - 1);
    console.log(`Approved item ${id}`);
  };

  const handleReject = (id) => {
    setPendingApprovals(prev => prev - 1);
    console.log(`Rejected item ${id}`);
  };

  const handleManagerAction = (action) => {
    console.log(`Manager action: ${action}`);
    // In real app, this would navigate or open modals
  };

  const managerActions = [
    { 
      icon: Icons.Shield, 
      label: "Content Moderation", 
      onClick: () => handleManagerAction("Content Moderation") 
    },
    { 
      icon: Icons.Chart, 
      label: "Platform Analytics", 
      onClick: () => handleManagerAction("Platform Analytics") 
    },
    { 
      icon: Icons.UserManagement, 
      label: "User Management", 
      onClick: () => handleManagerAction("User Management") 
    }
  ];

  const statsData = [
    { icon: Icons.Document, title: "Pending Approvals", value: pendingApprovals, color: "blue" },
    { icon: Icons.Warning, title: "Reported Content", value: reportedContent, color: "red" },
    { icon: Icons.Users, title: "Total Users", value: "1,247", color: "green" },
    { icon: Icons.Revenue, title: "Revenue", value: "$12,458", color: "purple" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="bg-white rounded-lg shadow-sm border p-6" aria-labelledby="dashboard-heading">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h1 id="dashboard-heading" className="text-3xl font-bold text-gray-900">
                Manager Dashboard
              </h1>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Manager
              </span>
            </div>
            <p className="text-gray-600">
              Welcome, {user?.name || 'Manager'}. Manage content moderation and platform oversight.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link 
              to="/profile" 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              View Profile
            </Link>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Platform Analytics
            </button>
          </div>
        </div>
      </section>

      {/* Manager Stats Grid */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Platform Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatCard
              key={`stat-${index}`}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <section className="bg-white rounded-lg shadow-sm border p-6" aria-labelledby="pending-approvals-heading">
          <div className="flex justify-between items-center mb-4">
            <h2 id="pending-approvals-heading" className="text-xl font-semibold text-gray-900">
              Pending Approvals
            </h2>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingApprovals} pending
            </span>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <ApprovalItem
                key={`approval-${item}`}
                id={item}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
            {pendingApprovals === 0 && (
              <p className="text-center text-gray-500 py-4">No pending approvals</p>
            )}
          </div>
        </section>

        {/* Manager Actions */}
        <section className="bg-white rounded-lg shadow-sm border p-6" aria-labelledby="manager-actions-heading">
          <h2 id="manager-actions-heading" className="text-xl font-semibold text-gray-900 mb-4">
            Manager Actions
          </h2>
          <div className="space-y-3">
            {managerActions.map((action, index) => (
              <ManagerAction
                key={`action-${index}`}
                icon={action.icon}
                label={action.label}
                onClick={action.onClick}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Recent Reports */}
      <section className="bg-white rounded-lg shadow-sm border p-6" aria-labelledby="recent-reports-heading">
        <h2 id="recent-reports-heading" className="text-xl font-semibold text-gray-900 mb-4">
          Recent Reports
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <ReportItem key={`report-${item}`} id={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ManagerDashboard;