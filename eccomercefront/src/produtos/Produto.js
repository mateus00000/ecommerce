import React, { useEffect, useState, useContext } from "react";
import { Grid, Typography, Card, CardContent, CardMedia, Button, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Carousel from 'react-material-ui-carousel';
import { getProducts } from "./ProdutoService.js";
import { Link } from 'react-router-dom';
import { CarrinhoContext } from '../componentes/Carrinho/CarrinhoContext';

const Produtos = ({ produtos: produtosProps }) => {
    const [produtos, setProdutos] = useState([]); // Estado inicial como array vazio
    const { adicionarProduto } = useContext(CarrinhoContext); // Contexto do carrinho

    useEffect(() => {
        if (produtosProps && produtosProps.length > 0) {
            setProdutos(produtosProps); // Usa os produtos fornecidos como props
        } else {
            getProducts()
                .then((produtosData) => {
                    setProdutos(produtosData); // Atualiza o estado com os dados da API
                })
                .catch((error) => {
                    console.error('Erro ao obter produtos:', error); // Log de erro
                });
        }
    }, [produtosProps]);

    const handleAddToCart = (e, produto) => {
        e.stopPropagation(); // Evita que o clique no botão afete outros elementos
        adicionarProduto(produto.id, 1); // Adiciona o produto ao carrinho com quantidade fixa (1)
        console.log(`Produto ${produto.id} adicionado ao carrinho.`); // Log de confirmação
    };

    return (
        <Grid container spacing={3} sx={{ mt: 2 }}>
            {produtos.length === 0 ? (
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    Nenhum produto disponível.
                </Typography>
            ) : (
                produtos.map((produto) => (
                    <Grid item xs={12} sm={6} md={4} key={produto.id}>
                        <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ height: 250, overflow: 'hidden' }}>
                                <Carousel
                                    indicators={true}
                                    navButtonsAlwaysVisible={true}
                                    sx={{ cursor: "pointer", height: '100%' }}
                                >
                                    {produto.imagens.map((imagem) => (
                                        <Link key={imagem.id} to={`/produto/${produto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <CardMedia
                                                component="img"
                                                image={`data:image/jpeg;base64,${imagem.dados}`}
                                                alt={`Imagem ${imagem.id}`}
                                                sx={{
                                                    maxHeight: '200px',
                                                    maxWidth: '100%',
                                                    objectFit: 'contain',
                                                    objectPosition: 'center',
                                                }}
                                            />
                                        </Link>
                                    ))}
                                </Carousel>
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Link to={`/produto/${produto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {produto.nome}
                                    </Typography>
                                </Link>
                                <Typography variant="body2" color="text.secondary">
                                    {produto.descricao}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h5" color="primary">
                                        {produto.valor !== undefined
                                            ? `R$ ${parseFloat(produto.valor).toFixed(2)}`
                                            : 'Preço indisponível'}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <Box sx={{ p: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={<ShoppingCartIcon />}
                                    onClick={(e) => handleAddToCart(e, produto)}
                                >
                                    Adicionar ao Carrinho
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default Produtos;
