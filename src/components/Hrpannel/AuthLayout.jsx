import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 bg-cover bg-center" 
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)' }}>
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>
        {children}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {title === 'Login' ? (
              <>Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link></>
            ) : (
              <>Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;