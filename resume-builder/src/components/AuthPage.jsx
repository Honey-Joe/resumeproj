import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const AuthPage = () => {
  const [cookies, setCookie] = useCookies(['user', 'adminToken', 'userToken']);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    password: '',
    age: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-redirect admin on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken") || cookies.adminToken;
    if (token && window.location.pathname !== "/adminpanel") {
      navigate("/adminpanel", { replace: true });
    }
  }, [cookies.adminToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    setFormData({
      name: '',
      identifier: '',
      password: '',
      age: '',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLoginMode ? 'login.php' : 'signup.php';
      const url = `https://apiresumebbuilder.freewilltech.in/${endpoint}`;

      const payload = isLoginMode
        ? { identifier: formData.identifier, password: formData.password }
        : {
            name: formData.name,
            email: formData.identifier,
            password: formData.password,
            age: formData.age,
          };

      const { data } = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

       if (data.success) {
      const { token, role, email, name } = data;
      
      // Store tokens in cookies
      setCookie('userToken', token, { 
        path: '/', 
        maxAge: 30 * 24 * 60 * 60,
        sameSite: 'strict'
      });
      
      setCookie('userData', JSON.stringify({ email, name, role }), {
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
        sameSite: 'strict'
      });

      // Store admin token separately
      if (role === 'admin') {
        setCookie('adminToken', token, {
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
          sameSite: 'strict'
        });
        navigate("/adminpanel");
      } else {
        navigate("/builder");
      }
    }
  } catch (err) {
      console.error('Auth error:', err);
      setError(
        err.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 p-4">
      <motion.div
        className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-4 sm:mb-6 text-blue-900">
          {isLoginMode ? 'Welcome Back!' : 'Create an Account'}
        </h2>

        <p className="text-center text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base">
          {isLoginMode
            ? 'Log in to continue building your resume'
            : 'Sign up and start creating your perfect resume'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                min="15"
                max="100"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base"
              />
            </>
          )}

          <input
            type="text"
            name="identifier"
            placeholder={isLoginMode ? 'Username or Email' : 'Email'}
            value={formData.identifier}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base"
          />

          <input
            type="password"
            name="password"
            placeholder={isLoginMode ? 'Password' : 'Set Password'}
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base"
          />

          {error && (
            <p className="text-red-600 text-center text-sm font-medium py-1">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            } text-white py-3 rounded-xl font-semibold text-base shadow-md transition-all flex justify-center items-center`}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </div>
            ) : isLoginMode ? (
              'Login'
            ) : (
              'Sign Up'
            )}
          </motion.button>
        </form>

        <div className="mt-5 text-center text-gray-600 text-sm">
          {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={toggleMode}
            className="ml-2 text-orange-500 hover:underline font-semibold focus:outline-none"
          >
            {isLoginMode ? 'Sign Up' : 'Login'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            {isLoginMode
              ? 'Use Your Login Credentials'
              : "Don't forgot your Email and Password!"}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
