// VisitCounter.jsx
import React, { useState, useEffect } from 'react';

const VisitCounter = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
     const updateCount = async () => {
      try {
        const response = await fetch('https://apiresumebbuilder.freewilltech.in/visit-counter.php', {
        });
        
        if (!response.ok) throw new Error('Failed to update count');
        
        const data = await response.json();
        setCount(data.count);
        console.log(data)
        
        if (data.updated) {
          setJustUpdated(true);
          setTimeout(() => setJustUpdated(false), 2000);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Update on component mount
    updateCount();

    // Special update for your specific URL
    if (window.location.href === 'https://resumebuilder.freewilltech.in/') {
      updateCount();
    }
  }, []);

  return (
    <div className={`relative flex flex-col items-center p-6 rounded-xl shadow-lg bg-gradient-to-br ${justUpdated ? 'from-green-50 to-blue-50 ring-2 ring-green-300' : 'from-white to-gray-50'} transition-all duration-300 max-w-md mx-auto`}>
      {/* Animated ping when updated */}
      {justUpdated && (
        <span className="absolute top-0 right-0 flex h-4 w-4 -mt-1 -mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
        </span>
      )}
      
      <h2 className="text-lg font-medium text-gray-600 mb-3">Total Visitors</h2>
      
      {loading ? (
        <div className="animate-pulse h-10 w-24 bg-gray-200 rounded-md"></div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-indigo-600">
            {count.toLocaleString()}
          </span>
          {justUpdated && (
            <span className="text-xs text-green-600 animate-bounce">+1</span>
          )}
        </div>
      )}
      
      <p className="text-xs text-gray-400 mt-3">
        Updated in real-time
      </p>
    </div>
  );
};

export default VisitCounter;