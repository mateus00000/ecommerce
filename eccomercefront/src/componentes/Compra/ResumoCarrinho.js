// src/componentes/Compra/ResumoCarrinho.jsx
import React, { useContext, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
} from '@mui/material';
import { CarrinhoContext } from '../Carrinho/CarrinhoContext';
import { validarCupom, finalizarPedido } from './PedidoService';
import { jwtDecode } from 'jwt-decode';

const ResumoCarrinho = ({ avancarEtapa }) => {
    const { carrinho } = useContext(CarrinhoContext);
    const [cupom, setCupom] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [totalComDesconto, setTotalComDesconto] = useState(carrinho.total || 0);
    const [cupomValido, setCupomValido] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cupomId, setCupomId] = useState(null); // Armazenar o ID do cupom aplicado

    const storedToken = localStorage.getItem('userToken');
    const decodedToken = jwtDecode(storedToken);
    const userId = decodedToken.id;
    const handleValidarCupom = () => {
        validarCupom(cupom)
            .then((data) => {
                if (data.valorMinimo <= carrinho.total) {
                    setCupomValido(data);
                    const desconto = (carrinho.total || 0) * data.valorDesconto;
                    setTotalComDesconto((carrinho.total || 0) - desconto);
                    setMensagem(`Cupom "${data.codigo}" aplicado!`);
                    setCupomId(data.id); // Armazena o ID do cupom
                } else {
                    setMensagem(`Cupom requer valor mínimo de R$ ${data.valorMinimo.toFixed(2)}`);
                    setCupomId(null);
                }
            })
            .catch(() => {
                setMensagem('Cupom inválido ou fora do prazo.');
                setCupomId(null);
            });
    };

    const handleContinuar = () => {
        setLoading(true);

        const pedidoDTO = {
            usuarioDTO: {
                id: userId,
            },
            itemPedidoDTO: carrinho.itens.map((item) => ({
                id: item.id, // Supondo que cada item tenha um ID
            })),
            ...(cupomValido && { cupomAplicado: { id: cupomId } }),
            // Adicione outros campos necessários, como endereço, etc.
        };

        finalizarPedido(pedidoDTO)
            .then((dadosPedido) => {
                setLoading(false);
                avancarEtapa(dadosPedido); // Passa os dados do pedido para a próxima etapa
            })
            .catch(() => {
                setLoading(false);
                alert('Erro ao finalizar pedido. Por favor, tente novamente.');
            });
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Resumo do Carrinho
            </Typography>
            <Grid container spacing={2}>
                {carrinho.itens.map((item, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Card sx={{ display: 'flex' }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 100 }}
                                image={item.produtoDTO?.imagem || 'https://via.placeholder.com/100'}
                                alt={item.produtoDTO?.nome || 'Produto'}
                            />
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography variant="h6">{item.produtoDTO?.nome || 'Produto indisponível'}</Typography>
                                <Typography variant="body2">Quantidade: {item.quantidade}</Typography>
                                <Typography variant="body2">Preço unitário: R$ {item.precoUnitario.toFixed(2)}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h5" color="primary">
                    Total: R$ {totalComDesconto.toFixed(2)}
                </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
                <TextField
                    label="Cupom de Desconto"
                    variant="outlined"
                    fullWidth
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleValidarCupom} sx={{ mt: 2 }}>
                    Aplicar Cupom
                </Button>
                {mensagem && (
                    <Typography sx={{ mt: 2 }} color={cupomValido ? 'primary' : 'error'}>
                        {mensagem}
                    </Typography>
                )}
            </Box>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleContinuar}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
            >
                {loading ? 'Finalizando Pedido...' : 'Continuar'}
            </Button>
        </Paper>
    );
};

export default ResumoCarrinho;
