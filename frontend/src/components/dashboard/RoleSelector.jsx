// components/dashboard/RoleSelector.js
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const RoleSelector = ({ currentRole, onRoleChange, userId, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = async (newRole) => {
    if (newRole === currentRole || disabled) {
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      await onRoleChange(userId, newRole);
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to update role');
      console.error('Error updating role:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColors = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case 'manager':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Manager';
      case 'user': return 'User';
      default: return role;
    }
  };

  const roles = [
    { value: 'user', label: 'User', description: 'Standard user permissions', color: 'green' },
    { value: 'manager', label: 'Manager', description: 'Content moderation & oversight', color: 'yellow' },
    { value: 'admin', label: 'Administrator', description: 'Full system access', color: 'red' }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Role Display Button */}
      <button
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={`
          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-all
          ${getRoleColors(currentRole)}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${loading ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        <span>{getRoleLabel(currentRole)}</span>
        {!disabled && !loading && (
          <svg 
            className={`ml-1 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
        {loading && (
          <svg className="ml-1 w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
          <div className="py-1">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => handleRoleSelect(role.value)}
                className={`
                  w-full text-left px-4 py-2 text-sm transition-colors
                  ${currentRole === role.value 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      role.color === 'red' ? 'bg-red-500' :
                      role.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <span className="font-medium">{role.label}</span>
                  </div>
                  {currentRole === role.value && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-6">{role.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;