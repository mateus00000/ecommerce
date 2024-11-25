import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('userToken');

    React.useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    if (!token) {
        return null; // ou um componente de carregamento, enquanto verifica o token
    }

    return children;
};

export default AuthGuard;