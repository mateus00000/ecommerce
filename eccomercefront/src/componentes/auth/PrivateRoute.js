// src/componentes/auth/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children }) => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
        try {
            const decodedToken = jwtDecode(storedToken);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                // Token expirado
                localStorage.removeItem('userToken');
                return <Navigate to="/login" />;
            }
            return children;
        } catch (error) {
            console.error('Erro ao decodificar o token:', error);
            localStorage.removeItem('userToken');
            return <Navigate to="/login" />;
        }
    } else {
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;
