import React, { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../common/Loader';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token =
    localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  // Хук за получаване на текущото местоположение (път на URL-то)
  const location = useLocation();
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/token-validation`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          },
        );

        if (!response.ok) {
          throw new Error('Token validation failed');
        }

        const result = await response.json();
        setIsValid(result.valid);
      } catch (error) {
        console.error('Error validating token:', error);
        setIsValid(false);
      }
    };

    validateToken();
  }, [location]);

  if (isValid === null) {
    return <Loader />;
  }

  return isValid ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
