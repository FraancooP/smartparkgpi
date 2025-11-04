import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function SessionTimer() {
  const [sessionTime, setSessionTime] = useState('00:00:00');

  useEffect(() => {
    const updateSessionTime = () => {
      const sessionStart = localStorage.getItem('smartpark_session_start');
      if (sessionStart) {
        const startTime = new Date(sessionStart);
        const now = new Date();
        const diffMs = now.getTime() - startTime.getTime();
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        setSessionTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    };

    // Update immediately
    updateSessionTime();
    
    // Update every second
    const timer = setInterval(updateSessionTime, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
      <Clock className="h-4 w-4" />
      <span>Tiempo de trabajo:</span>
      <span className="font-mono font-medium">{sessionTime}</span>
    </div>
  );
}