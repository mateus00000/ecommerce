// src/componentes/Compra/PedidoItem.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

const PedidoItem = ({ item }) => {
    return (
        <Card sx={{ display: 'flex', alignItems: 'center', mb: 2, boxShadow: 1 }}>
            <CardMedia
                component="img"
                sx={{ width: 80, height: 80, objectFit: 'contain', p: 1 }}
                image={item.produtoDTO?.imagem || 'https://via.placeholder.com/80'}
                alt={item.produtoDTO?.nome || 'Produto'}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body1">
                    <strong>Produto:</strong> {item.produtoDTO?.nome || 'Produto'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Quantidade:</strong> {item.quantidade}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Preço Unitário:</strong> R$ {item.precoUnitario.toFixed(2)}
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.primary">
                        <strong>Subtotal:</strong> R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PedidoItem;
