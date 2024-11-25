// src/Service/AuthService.js

import api from '../Service/Api'; // Supondo que o arquivo com a instância do Axios se chame api.js

// Função para cadastro de usuário
const signup = (userData) => {
    return api.post('/auth/register', userData)
        .then(response => {
            if (response.data.token) {
                localStorage.setItem('userToken', response.data.token);
            }
            return response.data;
        }).catch(error => {
            throw error;
        });
};

// Função para login de usuário
const login = (email, password) => {
    return api.post('/auth/login', { email, password })
        .then(response => {
            if (response.data.token) {
                localStorage.setItem('userToken', response.data.token);
            }
            return response.data;
        }).catch(error => {
            if (error.response && error.response.status === 403) {
                console.error('Access Forbidden: ', error.response.data);
            }
            throw error;
        });
};

// Função para obter dados do usuário
const getUserById = (userId) => {
    return api.get(`/usuarios/${userId}`)
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};

// Função para atualizar dados do usuário (perfil)
const updateUser = (userId, userData) => {
    return api.put(`/usuarios/${userId}`, userData)
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};

// Função para atualizar ou cadastrar endereço do usuário
const updateAddress = (userId, enderecoData) => {
    return api.put(`/usuarios/${userId}/endereco`, enderecoData)
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};
const changePassword = (changePasswordDTO) => {
    return api.put('/auth/change-password', changePasswordDTO)
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};

// Função para alterar o e-mail
const changeEmail = (changeEmailDTO) => {
    return api.put('/auth/change-email', changeEmailDTO)
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};

const AuthService = {
    signup,
    login,
    getUserById,
    updateUser,
    updateAddress,
    changePassword,
    changeEmail

};

export default AuthService;
