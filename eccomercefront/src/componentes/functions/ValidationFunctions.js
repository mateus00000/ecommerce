import axios from 'axios';

export const validateFullName = (nome) => {
    return nome.trim().split(' ').length >= 2;
};

export const checkUsernameAvailability = async (username) => {
    if (username.length < 4 || !/^[a-zA-Z0-9]+$/.test(username)) {
        return { isValid: false, message: 'Usuário deve ter pelo menos 4 caracteres e não pode ter caracteres especiais.' };
    }
    try {
        const response = await axios.get(`http://localhost:8080/usuarios/${username}/verify`);
        return { isValid: !response.data, message: response.data ? 'Usuário já cadastrado.' : '' };
    } catch (error) {
        console.error('Erro ao verificar disponibilidade do usuário', error);
        return { isValid: false, message: 'Erro ao verificar disponibilidade do usuário.' };
    }
};

export const checkEmailAvailability = async (email) => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
        return { isValid: false, message: 'E-mail inválido.' };
    }
    try {
        const response = await axios.get(`http://localhost:8080/usuarios/check-email?email=${email}`);
        return { isValid: !response.data, message: response.data ? 'E-mail já cadastrado.' : '' };
    } catch (error) {
        console.error('Erro ao verificar disponibilidade do email', error);
        return { isValid: false, message: 'Erro ao verificar disponibilidade do email.' };
    }
};

export const validatePassword = (password) => {
    const length = password.length >= 4;
    const number = /\d/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const noWhitespace = !/\s/.test(password);
    return { length, number, specialChar, noWhitespace };
};

export const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
};