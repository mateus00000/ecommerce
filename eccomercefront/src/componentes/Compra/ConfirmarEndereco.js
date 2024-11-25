// src/componentes/perfil/ConfirmarEndereco.js

import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Paper, TextField, Alert } from '@mui/material';
import { getUsuarioById, updateAddressById } from './PedidoService'; // Ajustar o caminho conforme necessário
import { jwtDecode } from 'jwt-decode'; // Importação padrão
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CarrinhoContext } from '../Carrinho/CarrinhoContext';

const ConfirmarEndereco = ({ avancarEtapa, voltarEtapa }) => {
    const [usuario, setUsuario] = useState(null);
    const [editAddress, setEditAddress] = useState(false);
    const [addressData, setAddressData] = useState({
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Acessar o contexto do carrinho
    const { limparCarrinho } = useContext(CarrinhoContext);

    useEffect(() => {
        // Recuperar o ID do usuário do token armazenado no localStorage
        const storedToken = localStorage.getItem('userToken');
        if (storedToken) {
            try {
                const decodedToken = jwtDecode(storedToken);
                const userId = decodedToken.id;

                if (!userId) {
                    throw new Error('ID do usuário não encontrado no token.');
                }

                getUsuarioById(userId)
                    .then((data) => {
                        setUsuario(data);
                        if (data.enderecoDTO) {
                            setAddressData({
                                cep: data.enderecoDTO.cep || '',
                                rua: data.enderecoDTO.rua || '',
                                numero: data.enderecoDTO.numero || '',
                                complemento: data.enderecoDTO.complemento || '',
                            });
                        }
                    })
                    .catch((error) => {
                        console.error('Erro ao buscar usuário:', error);
                        setError('Erro ao buscar dados do usuário.');
                    });
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
                setError('Erro ao decodificar o token.');
            }
        } else {
            setError('Token de autenticação não encontrado.');
        }
    }, []);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveAddress = async () => {
        setError('');
        setSuccess('');

        // Validações básicas para os campos de endereço
        if (!addressData.cep.trim()) {
            setError('CEP é obrigatório.');
            return;
        }
        if (!/^\d{5}-?\d{3}$/.test(addressData.cep)) {
            setError('CEP inválido. Deve ter 8 dígitos, opcionalmente com hífen (e.g., 12345-678).');
            return;
        }
        if (!addressData.rua.trim()) {
            setError('Rua é obrigatória.');
            return;
        }
        if (!addressData.numero.trim()) {
            setError('Número é obrigatório.');
            return;
        }

        try {
            const userId = usuario.id;
            await updateAddressById(userId, addressData);
            setSuccess('Endereço atualizado com sucesso!');
            setEditAddress(false);
            // Atualizar o estado do usuário com o novo endereço
            setUsuario((prevUser) => ({
                ...prevUser,
                enderecoDTO: { ...addressData },
            }));
        } catch (err) {
            console.error(err);
            setError('Falha ao atualizar o endereço. Tente novamente.');
        }
    };

    const handleConfirmAddress = () => {
        // Limpar o carrinho ao confirmar o endereço
        limparCarrinho();
        // Avançar para a próxima etapa
        avancarEtapa();
    };

    if (!usuario) return <Typography>Carregando endereço...</Typography>;

    const { enderecoDTO } = usuario;

    return (
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Confirmação do Endereço
            </Typography>
            <Typography variant="body1" gutterBottom>
                <strong>Endereço Atual:</strong>
            </Typography>
            {enderecoDTO ? (
                <Box sx={{ pl: 2, mb: 2 }}>
                    <Typography variant="body2">
                        Rua: {enderecoDTO.rua}, {enderecoDTO.numero}
                    </Typography>
                    <Typography variant="body2">
                        Complemento: {enderecoDTO.complemento || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                        CEP: {enderecoDTO.cep}
                    </Typography>
                </Box>
            ) : (
                <Typography variant="body2">Não informado</Typography>
            )}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Box sx={{ mt: 2 }}>
                {!editAddress ? (
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setEditAddress(true)}
                        startIcon={<FontAwesomeIcon icon={faEdit} />}
                    >
                        Alterar Endereço
                    </Button>
                ) : (
                    <Box component="form" sx={{ mb: 2 }}>
                        <TextField
                            label="CEP"
                            variant="outlined"
                            fullWidth
                            name="cep"
                            value={addressData.cep}
                            onChange={handleAddressChange}
                            sx={{ mb: 2 }}
                            required
                            error={
                                addressData.cep && !/^\d{5}-?\d{3}$/.test(addressData.cep)
                            }
                            helperText={
                                addressData.cep && !/^\d{5}-?\d{3}$/.test(addressData.cep)
                                    ? 'CEP inválido. Deve ter 8 dígitos, opcionalmente com hífen (e.g., 12345-678).'
                                    : ''
                            }
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
                            error={addressData.rua && !addressData.rua.trim()}
                            helperText={
                                addressData.rua && !addressData.rua.trim()
                                    ? 'Rua é obrigatória.'
                                    : ''
                            }
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
                            error={addressData.numero && !addressData.numero.trim()}
                            helperText={
                                addressData.numero && !addressData.numero.trim()
                                    ? 'Número é obrigatório.'
                                    : ''
                            }
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
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSaveAddress}
                            startIcon={<FontAwesomeIcon icon={faSave} />}
                            sx={{ mb: 2 }}
                        >
                            Salvar Endereço
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={() => {
                                setEditAddress(false);
                                // Resetar os dados de endereço para os originais
                                setAddressData({
                                    cep: enderecoDTO.cep || '',
                                    rua: enderecoDTO.rua || '',
                                    numero: enderecoDTO.numero || '',
                                    complemento: enderecoDTO.complemento || '',
                                });
                                setError('');
                                setSuccess('');
                            }}
                        >
                            Cancelar
                        </Button>
                    </Box>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleConfirmAddress} // Chama a função que limpa o carrinho e avança
                >
                    Confirmar Endereço
                </Button>
                <Button
                    variant="text"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={voltarEtapa}
                >
                    Voltar
                </Button>
            </Box>
        </Paper>
    );

};

export default ConfirmarEndereco;
