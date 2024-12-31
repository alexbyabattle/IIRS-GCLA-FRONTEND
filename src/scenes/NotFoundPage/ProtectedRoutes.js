import React from 'react';
import NotFoundPage from './NotFoundPage';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    try {
      // Decode the token to extract user details
      const { role } = JSON.parse(atob(accessToken.split('.')[1]));

      // Check if the user's role is in the allowed roles
      if (allowedRoles.includes(role)) {
        return element;
      } else {
        // If the user's role is not allowed, render the NotFoundPage
        return <NotFoundPage />;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  // If the token is missing or invalid, render the NotFoundPage
  return <NotFoundPage />;
};

export default ProtectedRoute;
