// src/componentes/auth/Signup.jsx 

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
    validateFullName, // Assumindo que esta função valida o nome completo
    checkUsernameAvailability,
    checkEmailAvailability,
    validatePassword,
    validateConfirmPassword
} from '../functions/ValidationFunctions';
import authService from '../../Service/AuthService';
import AppBarComponent from '../appbar'; // Ajuste o caminho conforme necessário
import FooterComponent from '../Footer';   // Ajuste o caminho conforme necessário
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    IconButton
} from '@mui/material';

function Signup() {
    const [formData, setFormData] = useState({
        nome: '',
        login: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [validation, setValidation] = useState({
        nome: null,
        login: null,
        loginError: '',
        email: null,
        emailError: '',
        password: {
            length: null,
            number: null,
            specialChar: null,
            noWhitespace: null
        },
        confirmPassword: null
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (formData.nome) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                nome: validateFullName(formData.nome)
            }));
        } else {
            setValidation((prevValidation) => ({
                ...prevValidation,
                nome: null
            }));
        }
    }, [formData.nome]);

    useEffect(() => {
        const checkLogin = async () => {
            const result = await checkUsernameAvailability(formData.login);
            setValidation((prevValidation) => ({
                ...prevValidation,
                login: result.isValid,
                loginError: result.message
            }));
        };
        if (formData.login) {
            checkLogin();
        } else {
            setValidation((prevValidation) => ({
                ...prevValidation,
                login: null,
                loginError: ''
            }));
        }
    }, [formData.login]);

    useEffect(() => {
        const checkEmail = async () => {
            const result = await checkEmailAvailability(formData.email);
            setValidation((prevValidation) => ({
                ...prevValidation,
                email: result.isValid,
                emailError: result.message
            }));
        };
        if (formData.email) {
            checkEmail();
        } else {
            setValidation((prevValidation) => ({
                ...prevValidation,
                email: null,
                emailError: ''
            }));
        }
    }, [formData.email]);

    useEffect(() => {
        if (formData.password) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                password: validatePassword(formData.password)
            }));
        } else {
            setValidation((prevValidation) => ({
                ...prevValidation,
                password: {
                    length: null,
                    number: null,
                    specialChar: null,
                    noWhitespace: null
                }
            }));
        }
    }, [formData.password]);

    useEffect(() => {
        if (formData.confirmPassword) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword)
            }));
        } else {
            setValidation((prevValidation) => ({
                ...prevValidation,
                confirmPassword: null
            }));
        }
    }, [formData.password, formData.confirmPassword]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Verificar se todas as validações estão passando
        if (!validation.nome || !validation.login || !validation.email || !validation.confirmPassword ||
            !Object.values(validation.password).every(val => val === null || val === true)) {
            setError('Por favor, preencha o formulário corretamente.');
            return;
        }
        try {
            const { confirmPassword, ...dataToSend } = formData;
            // Adicionar role: "USER"
            const dataWithRole = { ...dataToSend, role: "USER" };
            const response = await authService.signup(dataWithRole);
            console.log('Cadastro bem-sucedido', response);
            navigate('/login');
        } catch (error) {
            console.error('Falha no cadastro', error);
            setError('Falha ao cadastrar. Por favor, tente novamente.');
        }
    };

    const handleBack = () => {
        navigate('/login');
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            {/* AppBar no topo */}
            <AppBarComponent />

            {/* Conteúdo Principal */}
            <Box
                component="main"
                flexGrow={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={2}
                bgcolor="#f5f5f5"
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        maxWidth: 500,
                        width: '100%'
                    }}
                >
                    <Box display="flex" justifyContent="flex-start" mb={2}>
                        <IconButton onClick={handleBack}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </IconButton>
                    </Box>
                    <Typography variant="h5" component="h1" align="center" gutterBottom>
                        Cadastro
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Nome Completo"
                            variant="outlined"
                            fullWidth
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            required
                            error={validation.nome === false}
                            helperText={validation.nome === false ? 'Nome completo necessário.' : ''}
                        />
                        <TextField
                            label="Usuário"
                            variant="outlined"
                            fullWidth
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            required
                            error={validation.login === false}
                            helperText={
                                validation.login === false
                                    ? validation.loginError
                                    : validation.login === true
                                        ? 'Usuário disponível para cadastro.'
                                        : ''
                            }
                        />
                        <TextField
                            label="E-mail"
                            variant="outlined"
                            fullWidth
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            required
                            error={validation.email === false}
                            helperText={
                                validation.email === false
                                    ? validation.emailError
                                    : validation.email === true
                                        ? 'E-mail disponível para cadastro.'
                                        : ''
                            }
                        />
                        <TextField
                            label="Senha"
                            variant="outlined"
                            fullWidth
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            sx={{ mb: 1 }}
                            required
                            error={
                                !Object.values(validation.password).every(val => val === null || val === true)
                            }
                        />
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">Requisitos da Senha:</Typography>
                            <Box display="flex" alignItems="center">
                                <FontAwesomeIcon icon={validation.password.length ? faCheck : faTimes} color={validation.password.length ? 'green' : 'red'} />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    Pelo menos 4 caracteres
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <FontAwesomeIcon icon={validation.password.number ? faCheck : faTimes} color={validation.password.number ? 'green' : 'red'} />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    Pelo menos 1 número
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <FontAwesomeIcon icon={validation.password.specialChar ? faCheck : faTimes} color={validation.password.specialChar ? 'green' : 'red'} />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    Pelo menos 1 caractere especial
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <FontAwesomeIcon icon={validation.password.noWhitespace ? faCheck : faTimes} color={validation.password.noWhitespace ? 'green' : 'red'} />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    Sem espaços em branco
                                </Typography>
                            </Box>
                        </Box>
                        <TextField
                            label="Confirme sua Senha"
                            variant="outlined"
                            fullWidth
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                            required
                            error={validation.confirmPassword === false}
                            helperText={validation.confirmPassword === false ? 'As senhas não coincidem.' : ''}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            Cadastrar
                        </Button>
                    </form>
                </Paper>
            </Box>

            {/* Footer na parte inferior */}
            <FooterComponent />
        </Box>
    );
}
export default Signup;
