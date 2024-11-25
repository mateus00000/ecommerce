import React, { useContext } from 'react';
import { CarrinhoContext } from './CarrinhoContext';
import { Box, Typography, Button } from '@mui/material';

const Carrinho = () => {
    const { carrinho, removerProduto, limparCarrinho } = useContext(CarrinhoContext);

    if (!carrinho || carrinho.length === 0) {
        return (
            <Box>
                <Typography>Seu carrinho está vazio.</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4">Carrinho</Typography>
            {carrinho.map((item) => (
                <Box key={item.produtoDTO.id} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Typography>{item.produtoDTO.nome}</Typography>
                    <Typography>Quantidade: {item.quantidade}</Typography>
                    <Typography>Preço: R$ {item.precoUnitario}</Typography>
                    <Button variant="outlined" onClick={() => removerProduto(item.produtoDTO.id)}>
                        Remover
                    </Button>
                </Box>
            ))}
            <Button variant="contained" color="primary" onClick={limparCarrinho}>
                Limpar Carrinho
            </Button>
        </Box>
    );
};

export default Carrinho;
