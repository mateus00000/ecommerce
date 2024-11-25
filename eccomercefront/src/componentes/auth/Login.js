// src/componentes/auth/Login.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../Service/AuthService';
import AppBarComponent from '../appbar';
import FooterComponent from '../Footer';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await authService.login(email, password);
            // Supondo que 'response.data' contém os dados do usuário
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            setError('E-mail ou senha inválidos');
        }
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <AppBarComponent />

            <Box
                component="main"
                flexGrow={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={2}
                bgcolor="#f5f5f5"
            >
                <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                    <Typography variant="h5" component="h1" align="center" gutterBottom>
                        Login
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <form onSubmit={handleLogin}>
                        <TextField
                            label="E-mail"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Senha"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Entrar
                        </Button>
                    </form>
                    <Box mt={2} textAlign="center">
                        <Typography variant="body2">
                            Esqueceu a senha? <Link to="/esqueceu-senha">Clique aqui</Link>
                        </Typography>
                        <Typography variant="body2">
                            Não possui conta? <Link to="/cadastro">Cadastre-se</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            <FooterComponent />
        </Box>
    );
}

export default Login;
