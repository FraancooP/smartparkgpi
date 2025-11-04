import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedEmployee = localStorage.getItem('smartpark_employee');
    if (savedEmployee) {
      setEmployee(JSON.parse(savedEmployee));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (employeeData) => {
    setEmployee(employeeData);
    setIsLoggedIn(true);
    localStorage.setItem('smartpark_employee', JSON.stringify(employeeData));
  };

  const handleLogout = () => {
    setEmployee(null);
    setIsLoggedIn(false);
    localStorage.removeItem('smartpark_employee');
    localStorage.removeItem('smartpark_session_start');
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard employee={employee} onLogout={handleLogout} />;
}