// src/componentes/Compra/Pagamento.jsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    CircularProgress,
} from '@mui/material';
import { atualizarStatusPedido } from './PedidoService'; // Ajuste o caminho conforme necessário
import { useNavigate } from 'react-router-dom';
import { statusMap } from '../utils/statusMap';

const Pagamento = ({ pedido, voltarEtapa }) => {
    const [formaPagamento, setFormaPagamento] = useState('');
    const [detalhesPagamento, setDetalhesPagamento] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePagamento = () => {
        if (!formaPagamento) {
            alert('Por favor, selecione uma forma de pagamento.');
            return;
        }

        setLoading(true);

        // Simular processamento de pagamento (por exemplo, integração com gateway de pagamento)
        setTimeout(() => {
            // Defina o novo status conforme o fluxo do seu negócio
            // Exemplo: após pagamento, status muda para "PROCESSING"
            const novoStatusDescricao = "Processando"; // Deve corresponder a uma descrição válida no enum

            atualizarStatusPedido(pedido.id, novoStatusDescricao)
                .then(() => {
                    setLoading(false);
                    // Navegar para a página de pedidos após atualização bem-sucedida
                    navigate('/pedidos');
                })
                .catch(() => {
                    setLoading(false);
                    alert('Erro ao processar pagamento. Por favor, tente novamente.');
                });
        }, 2000); // Simulação de atraso no processamento
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Pagamento
            </Typography>
            <Typography variant="body1">
                Pedido ID: <strong>{pedido.id}</strong>
            </Typography>
            <Typography variant="body1">
                Total: R$ {pedido.total.toFixed(2)}
            </Typography>
            <Typography variant="body1">
                Status: {statusMap[pedido.statusPedido]}
            </Typography>

            <Box sx={{ mt: 3 }}>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Forma de Pagamento</InputLabel>
                    <Select
                        value={formaPagamento}
                        onChange={(e) => setFormaPagamento(e.target.value)}
                        label="Forma de Pagamento"
                    >
                        <MenuItem value="cartao">Cartão de Crédito</MenuItem>
                        <MenuItem value="pix">Pix</MenuItem>
                    </Select>
                </FormControl>

                {formaPagamento === 'cartao' && (
                    <Box>
                        <TextField
                            label="Número do Cartão"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={detalhesPagamento.numeroCartao || ''}
                            onChange={(e) =>
                                setDetalhesPagamento({ ...detalhesPagamento, numeroCartao: e.target.value })
                            }
                        />
                        <TextField
                            label="Nome no Cartão"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={detalhesPagamento.nomeCartao || ''}
                            onChange={(e) =>
                                setDetalhesPagamento({ ...detalhesPagamento, nomeCartao: e.target.value })
                            }
                        />
                        <TextField
                            label="Validade"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            placeholder="MM/AA"
                            value={detalhesPagamento.validade || ''}
                            onChange={(e) =>
                                setDetalhesPagamento({ ...detalhesPagamento, validade: e.target.value })
                            }
                        />
                        <TextField
                            label="CVV"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={detalhesPagamento.cvv || ''}
                            onChange={(e) =>
                                setDetalhesPagamento({ ...detalhesPagamento, cvv: e.target.value })
                            }
                        />
                    </Box>
                )}

                {formaPagamento === 'pix' && (
                    <Box>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Escaneie o QR Code abaixo ou utilize a chave Pix para efetuar o pagamento.
                        </Typography>
                        <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
                            <img src="https://via.placeholder.com/200" alt="QR Code Pix" />
                        </Box>
                        <TextField
                            label="Chave Pix"
                            variant="outlined"
                            fullWidth
                            value={detalhesPagamento.chavePix || ''}
                            onChange={(e) =>
                                setDetalhesPagamento({ ...detalhesPagamento, chavePix: e.target.value })
                            }
                        />
                    </Box>
                )}

                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handlePagamento}
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        {loading ? 'Processando...' : 'Finalizar Pagamento'}
                    </Button>
                </Box>

                <Button variant="text" fullWidth sx={{ mt: 2 }} onClick={voltarEtapa}>
                    Voltar
                </Button>
            </Box>
        </Paper>
    );

};

export default Pagamento;
