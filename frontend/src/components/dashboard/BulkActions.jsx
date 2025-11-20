// components/dashboard/BulkActions.js
import React, { useState } from 'react';

const BulkActions = ({ selectedCount, onBulkAction, onClearSelection, loading }) => {
  const [selectedAction, setSelectedAction] = useState('');

  const bulkActions = [
    {
      value: 'make_admin',
      label: 'Make Admin',
      description: 'Grant full system access',
      color: 'red'
    },
    {
      value: 'make_manager',
      label: 'Make Manager',
      description: 'Grant content moderation access',
      color: 'yellow'
    },
    {
      value: 'make_user',
      label: 'Make User',
      description: 'Set as regular user',
      color: 'green'
    },
    {
      value: 'suspend',
      label: 'Suspend Users',
      description: 'Temporarily disable accounts',
      color: 'orange'
    },
    {
      value: 'activate',
      label: 'Activate Users',
      description: 'Re-enable suspended accounts',
      color: 'green'
    }
  ];

  const handleAction = () => {
    if (selectedAction) {
      onBulkAction(selectedAction);
      setSelectedAction('');
    }
  };

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center">
          <span className="text-sm font-semibold text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
            {selectedCount} user(s) selected
          </span>
        </div>
        
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Choose bulk action...</option>
            {bulkActions.map((action) => (
              <option key={action.value} value={action.value}>
                {action.label} - {action.description}
              </option>
            ))}
          </select>
          
          <div className="flex gap-2">
            <button
              onClick={handleAction}
              disabled={!selectedAction || loading}
              className="btn-primary whitespace-nowrap flex items-center justify-center min-w-[120px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Applying...
                </>
              ) : (
                'Apply Action'
              )}
            </button>
            <button
              onClick={onClearSelection}
              className="btn-secondary whitespace-nowrap"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
      
      {selectedAction && (
        <div className="mt-3 p-3 bg-white rounded-lg border">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Action:</span> {
              bulkActions.find(a => a.value === selectedAction)?.description
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BulkActions;