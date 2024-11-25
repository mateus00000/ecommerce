import React, { useContext } from 'react';
import { CarrinhoContext } from './CarrinhoContext';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Divider, Button, Avatar, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const CarrinhoContent = () => {
    const navigate = useNavigate();
    const { carrinho, removerProduto, limparCarrinho, alterarQuantidade } = useContext(CarrinhoContext);

    if (!carrinho || carrinho.itens.length === 0) {
        return (
            <Box
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    height: '100%',
                }}
            >
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Opa! Seu carrinho está vazio.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Que tal explorar nossos produtos e adicionar algo incrível ao carrinho?
                </Typography>
            </Box>
        );
    }

    const calcularTotal = () => {
        return carrinho.total.toFixed(2);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Carrinho</Typography>
            <List>
                {carrinho.itens.map((item) => (
                    <React.Fragment key={item.produtoDTO.id}>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => removerProduto(item.produtoDTO.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <Avatar
                                variant="square"
                                src={`data:image/jpeg;base64,${item.produtoDTO.imagens?.[0]?.dados}`}
                                alt={item.produtoDTO.nome}
                                sx={{ width: 56, height: 56 }}
                            />
                            <ListItemText
                                primary={item.produtoDTO.nome}
                                secondary={
                                    <>
                                        <Typography variant="body2" color="text.secondary">
                                            Preço unitário: R$ {parseFloat(item.precoUnitario).toFixed(2)}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                                Quantidade:
                                            </Typography>
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={item.quantidade}
                                                onChange={(e) => alterarQuantidade(item.produtoDTO.id, parseInt(e.target.value, 10))}
                                                inputProps={{ min: 1 }}
                                                sx={{ width: 60 }}
                                            />
                                        </Box>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Total: R$ {calcularTotal()}</Typography>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/finalizar-compra')}>
                    Finalizar Compra
                </Button>
                <Button variant="text" color="secondary" fullWidth onClick={limparCarrinho}>
                    Limpar Carrinho
                </Button>
            </Box>
        </Box>
    );
};

export default CarrinhoContent;
