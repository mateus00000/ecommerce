// src/components/Pedidos/PedidoDetails.jsx

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { getPedidosByUsuarioId, atualizarStatusPedido } from './PedidoService'; // Importa a função de atualização
import AppBarComponent from '../appbar';
import FooterComponent from '../Footer';
import { statusMap } from '../utils/statusMap';
import {jwtDecode} from 'jwt-decode'; // Correção na importação

// Estilização para a seção de Endereço de Entrega
const AddressBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: '#e0f7fa',
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
}));

// Estilização para o Histórico de Status
const StatusHistoryBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: '#fff3e0',
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
}));

const PedidoDetails = () => {
    const { pedidoId } = useParams();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false); // Estado para carregar ações
    const [actionError, setActionError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');

    useEffect(() => {
        // Recupera o token do localStorage
        const storedToken = localStorage.getItem('userToken');
        if (storedToken) {
            try {
                // Decodifica o token JWT para obter os dados do usuário
                const decodedToken = jwtDecode(storedToken);
                const usuarioId = decodedToken.id;

                if (!usuarioId) {
                    throw new Error('ID do usuário não encontrado no token.');
                }

                const fetchPedido = async () => {
                    try {
                        const pedidos = await getPedidosByUsuarioId(usuarioId);
                        const encontrado = pedidos.find((p) => p.id === parseInt(pedidoId));
                        if (encontrado) {
                            setPedido(encontrado);
                        } else {
                            setError('Pedido não encontrado.');
                        }
                    } catch (error) {
                        console.error('Erro ao buscar pedido:', error);
                        setError('Erro ao buscar pedido. Tente novamente mais tarde.');
                    } finally {
                        setLoading(false);
                    }
                };

                fetchPedido();
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
                // Se ocorrer um erro ao decodificar, redireciona para a página de login
                navigate('/login');
            }
        } else {
            // Se não houver token, redireciona para a página de login
            navigate('/login');
        }
    }, [pedidoId, navigate]);

    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const handleCancelarPedido = async () => {
        setActionLoading(true);
        setActionError('');
        setActionSuccess('');
        try {
            const updatedPedido = await atualizarStatusPedido(pedido.id, 'Cancelado');
            setPedido(updatedPedido);
            setActionSuccess('Pedido cancelado com sucesso.');
        } catch (error) {
            console.error('Erro ao cancelar pedido:', error);
            setActionError('Erro ao cancelar pedido. Tente novamente mais tarde.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSolicitarDevolucao = async () => {
        setActionLoading(true);
        setActionError('');
        setActionSuccess('');
        try {
            const updatedPedido = await atualizarStatusPedido(pedido.id, 'RETURN_REQUESTED'); // Use o status correto conforme backend
            setPedido(updatedPedido);
            setActionSuccess('Solicitação de devolução enviada com sucesso.');
        } catch (error) {
            console.error('Erro ao solicitar devolução:', error);
            setActionError('Erro ao solicitar devolução. Tente novamente mais tarde.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!pedido) {
        return (
            <Box display="flex" flexDirection="column" minHeight="100vh">
                <AppBarComponent />
                <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
                        {error || 'Pedido não encontrado.'}
                    </Typography>
                    <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={() => navigate('/pedidos')}>
                            Voltar para Meus Pedidos
                        </Button>
                    </Box>
                </Box>
                <FooterComponent />
            </Box>
        );
    }

    const { enderecoDTO, itemPedidoDTO, historicoStatus, statusPedido, total, dataPedido, cupomAplicado, usuarioDTO } = pedido;

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
                    Detalhes do Pedido #{pedido.id}
                </Typography>

                {/* Botão de Voltar */}
                <Box sx={{ mb: 3 }}>
                    <Button variant="outlined" color="primary" onClick={() => navigate('/pedidos')}>
                        Voltar para Meus Pedidos
                    </Button>
                </Box>

                {/* Mensagens de Ação */}
                {actionError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {actionError}
                    </Alert>
                )}
                {actionSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {actionSuccess}
                    </Alert>
                )}

                {/* Informações Básicas */}
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Status:</strong> {statusMap[statusPedido] || statusPedido}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Total:</strong> {formatarMoeda(total)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Data do Pedido:</strong> {new Date(dataPedido).toLocaleDateString()}
                </Typography>

                {/* Botões Condicionais Baseados no Status */}
                <Box sx={{ mt: 2, mb: 2 }}>
                    {statusPedido === 'PROCESSING' && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleCancelarPedido}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Cancelando...' : 'Cancelar Pedido'}
                        </Button>
                    )}
                    {statusPedido === 'SHIPPED' && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSolicitarDevolucao}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Solicitando...' : 'Solicitar Devolução'}
                        </Button>
                    )}
                </Box>

                {/* Endereço de Entrega */}
                {usuarioDTO.enderecoDTO && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Endereço de Entrega
                        </Typography>
                        <AddressBox>
                            <Typography variant="body1">
                                <strong>CEP:</strong> {usuarioDTO.enderecoDTO.cep}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Rua:</strong> {usuarioDTO.enderecoDTO.rua}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Número:</strong> {usuarioDTO.enderecoDTO.numero}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Complemento:</strong> {usuarioDTO.enderecoDTO.complemento || 'N/A'}
                            </Typography>
                        </AddressBox>
                    </>
                )}

                {/* Cupom Aplicado */}
                {cupomAplicado && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Cupom Aplicado
                        </Typography>
                        <Typography variant="body1" color="secondary">
                            <strong>Código:</strong> {cupomAplicado.codigo} - <strong>Desconto:</strong> {cupomAplicado.valorDesconto * 100}%
                        </Typography>
                    </>
                )}

                {/* Itens do Pedido */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                    Itens do Pedido
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Descrição</strong></TableCell>
                                <TableCell align="right"><strong>Quantidade</strong></TableCell>
                                <TableCell align="right"><strong>Preço Unitário</strong></TableCell>
                                <TableCell align="right"><strong>Total</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemPedidoDTO.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.produtoDTO.nome}</TableCell>
                                    <TableCell align="right">{item.quantidade}</TableCell>
                                    <TableCell align="right">{formatarMoeda(item.precoUnitario)}</TableCell>
                                    <TableCell align="right">{formatarMoeda(item.quantidade * item.precoUnitario)}</TableCell>
                                </TableRow>
                            ))}
                            {/* Valor Total */}
                            <TableRow>
                                <TableCell rowSpan={3} />
                                <TableCell colSpan={2} align="right"><strong>Total:</strong></TableCell>
                                <TableCell align="right"><strong>{formatarMoeda(total)}</strong></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Histórico de Status */}
                {historicoStatus && historicoStatus.length > 0 && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Histórico de Status
                        </Typography>
                        <StatusHistoryBox>
                            {historicoStatus.map((status, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Typography variant="body2">
                                        <strong>Data:</strong> {new Date(status.data).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Status:</strong> {status.descricao}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                </Box>
                            ))}
                        </StatusHistoryBox>
                    </>
                )}
            </Box>
            <FooterComponent />
        </Box>
    );

};

export default PedidoDetails;
