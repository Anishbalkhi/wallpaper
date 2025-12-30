import React from 'react';

const UserStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.total,
      color: 'blue',
      icon: '👥',
      description: 'All platform users'
    },
    {
      title: 'Admins',
      value: stats.admins,
      color: 'red',
      icon: '🛡️',
      description: 'Full system access'
    },
    {
      title: 'Managers',
      value: stats.managers,
      color: 'yellow',
      icon: '👔',
      description: 'Content moderation'
    },
    {
      title: 'Users',
      value: stats.users,
      color: 'green',
      icon: '👤',
      description: 'Standard permissions'
    },
    {
      title: 'Active',
      value: stats.active,
      color: 'green',
      icon: '✅',
      description: 'Currently active'
    },
    {
      title: 'Suspended',
      value: stats.suspended,
      color: 'red',
      icon: '⛔',
      description: 'Temporarily disabled'
    },
    {
      title: 'New Today',
      value: stats.newToday,
      color: 'purple',
      icon: '🆕',
      description: 'Registered today'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      red: 'bg-red-50 border-red-200 text-red-600',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
            <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
              <span className="text-xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;