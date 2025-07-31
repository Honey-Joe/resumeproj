// src/hooks/useAuth.js
export const useAuth = () => {
  const token = localStorage.getItem('userToken') || '';
  const name = localStorage.getItem('userName') || '';
  const email = localStorage.getItem('userEmail') || '';
  const isAdmin = !!localStorage.getItem('adminToken');

  return {
    isAuthenticated: !!token || isAdmin,
    isAdmin,
    name,
    email,
    token,
  };
};
