// src/components/Pedidos/PedidosUsuarios.jsx

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    CircularProgress,
    Chip,
    Divider,
    Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { getPedidosByUsuarioId } from './PedidoService';
import AppBarComponent from '../appbar'; // Ajuste o caminho conforme necessário
import FooterComponent from '../Footer'; // Ajuste o caminho conforme necessário
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { statusMap } from '../utils/statusMap';
import { jwtDecode } from 'jwt-decode'; // Correção na importação

const StatusChip = styled(Chip)(({ theme, status }) => ({
    backgroundColor:
        status === 'Entregue'
            ? theme.palette.success.main
            : status === 'Processando'
                ? theme.palette.info.main
                : status === 'Cancelado'
                    ? theme.palette.error.main
                    : theme.palette.warning.main,
    color: theme.palette.common.white,
    fontWeight: 600,
    marginBottom: theme.spacing(1),
}));

const PedidoListItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    position: 'relative',
    cursor: 'pointer',
    transition: 'box-shadow 0.3s',
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const PedidosUsuarios = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Recupera o token do localStorage
        const storedToken = localStorage.getItem('userToken');
        if (storedToken) {
            try {
                // Decodifica o token JWT para obter os dados do usuário
                const decodedToken = jwtDecode(storedToken);
                setUser(decodedToken);
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
                // Se ocorrer um erro ao decodificar, redireciona para a página de login
                navigate('/login');
            }
        } else {
            // Se não houver token, redireciona para a página de login
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                if (user && user.id) {
                    const data = await getPedidosByUsuarioId(user.id);
                    console.log('Pedidos recebidos:', data); // Log para depuração
                    if (Array.isArray(data)) {
                        setPedidos(data);
                    } else {
                        console.error('Formato de dados inesperado:', data);
                        setError('Formato de dados dos pedidos está incorreto.');
                    }
                } else {
                    setError('Usuário inválido.');
                }
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
                setError('Erro ao buscar pedidos. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPedidos();
        }
    }, [user]);

    const handleViewDetails = (pedidoId) => {
        navigate(`/pedidos/${pedidoId}`);
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            {/* AppBar */}
            <AppBarComponent />

            {/* Conteúdo Principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 4 },
                    backgroundColor: '#f5f5f5',
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                    Meus Pedidos
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 4 }}>
                        {error}
                    </Typography>
                ) : pedidos.length > 0 ? (
                    <List>
                        {pedidos.map((pedido) => (
                            <React.Fragment key={pedido.id}>
                                <PedidoListItem onClick={() => handleViewDetails(pedido.id)}>
                                    {/* Status do Pedido */}
                                    <StatusChip
                                        label={statusMap[pedido.statusPedido] || pedido.statusPedido}
                                        status={statusMap[pedido.statusPedido] || pedido.statusPedido}
                                        sx={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                        }}
                                    />
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6">
                                                Pedido #{pedido.id}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="text.secondary">
                                                    Data do Pedido: {new Date(pedido.dataPedido).toLocaleDateString()}
                                                </Typography>

                                                <Box sx={{ mt: 1 }}>
                                                    {pedido.itemPedidoDTO && pedido.itemPedidoDTO.length > 0 ? (
                                                        pedido.itemPedidoDTO.map((item, index) => (
                                                            <Typography variant="body2" key={index}>
                                                                • {item.produtoDTO.nome} - Quantidade: {item.quantidade}
                                                            </Typography>
                                                        ))
                                                    ) : (
                                                        <Typography variant="body2">Nenhum item no pedido.</Typography>
                                                    )}
                                                </Box>
                                            </>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="details" onClick={() => handleViewDetails(pedido.id)}>
                                            <ArrowForwardIosIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </PedidoListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
                        Você não possui nenhum pedido.
                    </Typography>
                )}
            </Box>

            {/* Footer */}
            <FooterComponent />
        </Box>
    );
};

export default PedidosUsuarios;
