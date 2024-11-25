// src/componentes/perfil/Profile.js

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Grid,
    Card,
    CardContent,
    CardActions,
    Collapse
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../../Service/AuthService';
import ResponsiveAppBar from '../appbar';
import FooterComponent from '../Footer';
import { jwtDecode } from 'jwt-decode'; // Ajuste na importação
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    checkEmailAvailability,
    validatePassword
} from '../functions/ValidationFunctions'; // Importando apenas as funções necessárias

function Profile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        nome: '',
        email: '',
        id: null,
    });
    const [addressData, setAddressData] = useState({
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const [emailUpdate, setEmailUpdate] = useState({
        newEmail: '',
    });

    // Estados para controlar a visibilidade dos formulários de edição
    const [editPassword, setEditPassword] = useState(false);
    const [editEmail, setEditEmail] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('userToken');
        if (storedToken) {
            try {
                const decodedToken = jwtDecode(storedToken);
                const userId = decodedToken.id;
                if (userId) {
                    // Busca os dados do usuário
                    authService.getUserById(userId)
                        .then(data => {
                            setUserData({
                                nome: data.nome || '',
                                email: data.email || '',
                                id: data.id || null,
                            });

                            if (data.enderecoDTO) {
                                setAddressData({
                                    cep: data.enderecoDTO.cep || '',
                                    rua: data.enderecoDTO.rua || '',
                                    numero: data.enderecoDTO.numero || '',
                                    complemento: data.enderecoDTO.complemento || '',
                                });
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            setError('Erro ao buscar dados do usuário.');
                        });
                } else {
                    setError('ID do usuário não encontrado no token.');
                }
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleEmailUpdateChange = (e) => {
        setEmailUpdate({ ...emailUpdate, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e) => {
        setAddressData({ ...addressData, [e.target.name]: e.target.value });
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validações
        const passwordValidation = validatePassword(passwordData.newPassword);
        if (!passwordValidation.length || !passwordValidation.number || !passwordValidation.specialChar || !passwordValidation.noWhitespace) {
            setError('A nova senha não atende aos requisitos.');
            return;
        }

        try {
            const changePasswordDTO = {
                email: userData.email,
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            };
            await authService.changePassword(changePasswordDTO);
            setSuccess('Senha alterada com sucesso!');
            setEditPassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
            });
        } catch (err) {
            console.error(err);
            setError('Falha ao alterar a senha. Verifique a senha atual e tente novamente.');
        }
    };

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validações
        const emailValid = await checkEmailAvailability(emailUpdate.newEmail);
        if (!emailValid.isValid) {
            setError(emailValid.message);
            return;
        }

        try {
            const changeEmailDTO = {
                email: userData.email,
                newEmail: emailUpdate.newEmail,
            };
            await authService.changeEmail(changeEmailDTO);
            setUserData({ ...userData, email: emailUpdate.newEmail });
            setSuccess('E-mail alterado com sucesso!');
            setEditEmail(false);
            setEmailUpdate({
                newEmail: '',
            });
        } catch (err) {
            console.error(err);
            setError('Falha ao alterar o e-mail. Verifique e tente novamente.');
        }
    };

    const handleSubmitAddress = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const enderecoDataToUpdate = {
                cep: addressData.cep,
                rua: addressData.rua,
                numero: addressData.numero,
                complemento: addressData.complemento,
            };
            await authService.updateAddress(userData.id, enderecoDataToUpdate);
            setSuccess('Endereço atualizado com sucesso!');
        } catch (err) {
            console.error(err);
            setError('Falha ao atualizar o endereço.');
        }
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            {/* AppBar */}
            <ResponsiveAppBar />

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
                <Grid container spacing={4} maxWidth={1000}>
                    {/* Dados do Usuário */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Meus Dados
                                </Typography>
                                {/* Exibição do Nome como Texto */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1">Nome Completo</Typography>
                                    <Typography variant="body1">{userData.nome}</Typography>
                                </Box>
                                {/* Exibição do E-mail como Texto */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1">E-mail</Typography>
                                    <Typography variant="body1">{userData.email}</Typography>
                                </Box>
                                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                            </CardContent>
                            <CardActions>
                                {/* Botão para editar senha */}
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    startIcon={<FontAwesomeIcon icon={faEdit} />}
                                    onClick={() => setEditPassword(!editPassword)}
                                    sx={{ mb: 1 }}
                                >
                                    {editPassword ? 'Cancelar' : 'Alterar Senha'}
                                </Button>
                                {/* Botão para editar e-mail */}
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    startIcon={<FontAwesomeIcon icon={faEdit} />}
                                    onClick={() => setEditEmail(!editEmail)}
                                >
                                    {editEmail ? 'Cancelar' : 'Alterar E-mail'}
                                </Button>
                            </CardActions>
                            {/* Formulário de alteração de senha */}
                            <Collapse in={editPassword}>
                                <CardContent>
                                    <form onSubmit={handleSubmitPassword}>
                                        <TextField
                                            label="Senha Atual"
                                            variant="outlined"
                                            type="password"
                                            fullWidth
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            sx={{ mb: 2 }}
                                            required
                                            error={passwordData.currentPassword.trim() === ''}
                                            helperText={passwordData.currentPassword.trim() === '' ? 'Senha atual necessária.' : ''}
                                        />
                                        <TextField
                                            label="Nova Senha"
                                            variant="outlined"
                                            type="password"
                                            fullWidth
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            sx={{ mb: 2 }}
                                            required
                                            error={
                                                !passwordData.newPassword ||
                                                !validatePassword(passwordData.newPassword).length ||
                                                !validatePassword(passwordData.newPassword).number ||
                                                !validatePassword(passwordData.newPassword).specialChar ||
                                                !validatePassword(passwordData.newPassword).noWhitespace
                                            }
                                            helperText={
                                                !passwordData.newPassword
                                                    ? 'Nova senha necessária.'
                                                    : !validatePassword(passwordData.newPassword).length
                                                        ? 'A senha deve ter pelo menos 4 caracteres.'
                                                        : !validatePassword(passwordData.newPassword).number
                                                            ? 'A senha deve conter pelo menos 1 número.'
                                                            : !validatePassword(passwordData.newPassword).specialChar
                                                                ? 'A senha deve conter pelo menos 1 caractere especial.'
                                                                : !validatePassword(passwordData.newPassword).noWhitespace
                                                                    ? 'A senha não pode conter espaços.'
                                                                    : ''
                                            }
                                        />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            startIcon={<FontAwesomeIcon icon={faSave} />}
                                        >
                                            Salvar Nova Senha
                                        </Button>
                                    </form>
                                </CardContent>
                            </Collapse>
                            {/* Formulário de alteração de e-mail */}
                            <Collapse in={editEmail}>
                                <CardContent>
                                    <form onSubmit={handleSubmitEmail}>
                                        <TextField
                                            label="Novo E-mail"
                                            variant="outlined"
                                            type="email"
                                            fullWidth
                                            name="newEmail"
                                            value={emailUpdate.newEmail}
                                            onChange={handleEmailUpdateChange}
                                            sx={{ mb: 2 }}
                                            required
                                            error={
                                                !emailUpdate.newEmail ||
                                                !checkEmailAvailability(emailUpdate.newEmail).isValid
                                            }
                                            helperText={
                                                !emailUpdate.newEmail
                                                    ? 'Novo e-mail necessário.'
                                                    : !checkEmailAvailability(emailUpdate.newEmail).isValid
                                                        ? 'E-mail inválido ou já cadastrado.'
                                                        : ''
                                            }
                                        />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            startIcon={<FontAwesomeIcon icon={faSave} />}
                                        >
                                            Salvar Novo E-mail
                                        </Button>
                                    </form>
                                </CardContent>
                            </Collapse>
                        </Card>
                    </Grid>

                    {/* Endereço do Usuário */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Endereço
                                </Typography>
                                <form onSubmit={handleSubmitAddress}>
                                    <TextField
                                        label="CEP"
                                        variant="outlined"
                                        fullWidth
                                        name="cep"
                                        value={addressData.cep}
                                        onChange={handleAddressChange}
                                        sx={{ mb: 2 }}
                                        required
                                        error={addressData.cep.trim() === ''}
                                        helperText={addressData.cep.trim() === '' ? 'CEP necessário.' : ''}
                                    />
                                    <TextField
                                        label="Rua"
                                        variant="outlined"
                                        fullWidth
                                        name="rua"
                                        value={addressData.rua}
                                        onChange={handleAddressChange}
                                        sx={{ mb: 2 }}
                                        required
                                        error={addressData.rua.trim() === ''}
                                        helperText={addressData.rua.trim() === '' ? 'Rua necessária.' : ''}
                                    />
                                    <TextField
                                        label="Número"
                                        variant="outlined"
                                        fullWidth
                                        name="numero"
                                        type="number"
                                        value={addressData.numero}
                                        onChange={handleAddressChange}
                                        sx={{ mb: 2 }}
                                        required
                                        error={addressData.numero.trim() === ''}
                                        helperText={addressData.numero.trim() === '' ? 'Número necessário.' : ''}
                                    />
                                    <TextField
                                        label="Complemento"
                                        variant="outlined"
                                        fullWidth
                                        name="complemento"
                                        value={addressData.complemento}
                                        onChange={handleAddressChange}
                                        sx={{ mb: 2 }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Atualizar Endereço
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Footer */}
            <FooterComponent />
        </Box>
    );

}

export default Profile;
