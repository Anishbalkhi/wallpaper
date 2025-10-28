import { useEffect, useState } from 'react';
import axios from 'axios';

const ConnectionTest = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('http://localhost:5003/');
        setMessage(response.data);
      } catch (error) {
        setMessage('Failed to connect to backend');
        console.error('Connection error:', error);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) {
    return <div>Testing backend connection...</div>;
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <strong>Backend Connection:</strong> {message}
    </div>
  );
};

export default ConnectionTest;