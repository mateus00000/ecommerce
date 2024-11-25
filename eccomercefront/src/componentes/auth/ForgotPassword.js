// src/componentes/auth/ForgotPassword.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import AppBarComponent from '../appbar'; // Ajuste o caminho conforme necessário
import FooterComponent from '../Footer';   // Ajuste o caminho conforme necessário
import { validatePassword, validateConfirmPassword } from '../functions/ValidationFunctions';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    IconButton
} from '@mui/material';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [passwordValidation, setPasswordValidation] = useState({
        length: null,
        number: null,
        specialChar: null,
        noWhitespace: null
    });
    const [confirmPasswordValidation, setConfirmPasswordValidation] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (newPassword) {
            setPasswordValidation(validatePassword(newPassword));
        }
    }, [newPassword]);

    useEffect(() => {
        if (confirmPassword) {
            setConfirmPasswordValidation(validateConfirmPassword(newPassword, confirmPassword));
        }
    }, [newPassword, confirmPassword]);

    const handleForgotPassword = async () => {
        try {
            await axios.post('http://localhost:8080/auth/forgot-password', { email });
            setStep(2);
            setMessage('Código de verificação enviado para o seu email.');
            setError('');
        } catch (error) {
            setError('Erro ao enviar código de verificação. Verifique se o email está correto.');
            setMessage('');
        }
    };

    const handleVerifyCode = async () => {
        try {
            await axios.post('http://localhost:8080/auth/verify-code', { email, code });
            setStep(3);
            setMessage('Código verificado. Agora você pode redefinir sua senha.');
            setError('');
        } catch (error) {
            setError('Código de verificação inválido.');
            setMessage('');
        }
    };

    const handleResetPassword = async () => {
        if (!Object.values(passwordValidation).every(Boolean)) {
            setError('Por favor, preencha os requisitos da senha.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        try {
            await axios.post('http://localhost:8080/auth/reset-password', { email, code, newPassword });
            setMessage('Senha redefinida com sucesso. Redirecionando para login...');
            setError('');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setError('Erro ao redefinir a senha. Tente novamente.');
            setMessage('');
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
                    {step === 1 && (
                        <>
                            <Typography variant="h5" component="h1" align="center" gutterBottom>
                                Recuperar Senha
                            </Typography>
                            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <TextField
                                label="E-mail"
                                variant="outlined"
                                fullWidth
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 2 }}
                                required
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleForgotPassword}
                            >
                                Enviar Código
                            </Button>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <Typography variant="h5" component="h1" align="center" gutterBottom>
                                Verificar Código
                            </Typography>
                            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <TextField
                                label="Código de Verificação"
                                variant="outlined"
                                fullWidth
                                name="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                sx={{ mb: 2 }}
                                required
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleVerifyCode}
                            >
                                Verificar Código
                            </Button>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <Typography variant="h5" component="h1" align="center" gutterBottom>
                                Redefinir Senha
                            </Typography>
                            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <TextField
                                label="Nova Senha"
                                variant="outlined"
                                fullWidth
                                name="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                sx={{ mb: 1 }}
                                required
                                error={!Object.values(passwordValidation).every(val => val === null || val === true)}
                                helperText=""
                            />
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2">Requisitos da Senha:</Typography>
                                <Box display="flex" alignItems="center">
                                    <FontAwesomeIcon icon={passwordValidation.length ? faCheck : faTimes} color={passwordValidation.length ? 'green' : 'red'} />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        Pelo menos 4 caracteres
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <FontAwesomeIcon icon={passwordValidation.number ? faCheck : faTimes} color={passwordValidation.number ? 'green' : 'red'} />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        Pelo menos 1 número
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <FontAwesomeIcon icon={passwordValidation.specialChar ? faCheck : faTimes} color={passwordValidation.specialChar ? 'green' : 'red'} />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        Pelo menos 1 caractere especial
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <FontAwesomeIcon icon={passwordValidation.noWhitespace ? faCheck : faTimes} color={passwordValidation.noWhitespace ? 'green' : 'red'} />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        Sem espaços em branco
                                    </Typography>
                                </Box>
                            </Box>
                            <TextField
                                label="Confirme a Nova Senha"
                                variant="outlined"
                                fullWidth
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                sx={{ mb: 2 }}
                                required
                                error={confirmPasswordValidation === false}
                                helperText={confirmPasswordValidation === false ? 'As senhas não coincidem.' : ''}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleResetPassword}
                            >
                                Redefinir Senha
                            </Button>
                        </>
                    )}
                </Paper>
            </Box>

            {/* Footer na parte inferior */}
            <FooterComponent />
        </Box>
    );
}

export default ForgotPassword;
