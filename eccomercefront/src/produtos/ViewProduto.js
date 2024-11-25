import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Box, Button, CardMedia, Grid, Card, CardContent } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Carousel from 'react-material-ui-carousel'; // Carrossel para o produto principal
import AppBar from '../componentes/appbar';
import Footer from '../componentes/Footer';
import { getProductById, getProductsByCategory } from './ProdutoService';
import ReactMultiCarousel from 'react-multi-carousel'; // Carrossel para produtos relacionados
import 'react-multi-carousel/lib/styles.css';
import { CarrinhoContext } from '../componentes/Carrinho/CarrinhoContext';

const ViewProduto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [produto, setProduto] = useState(null);
    const [produtosMesmaCategoria, setProdutosMesmaCategoria] = useState([]);
    const { adicionarProduto } = useContext(CarrinhoContext); // Usar função adicionarProduto diretamente

    useEffect(() => {
        getProductById(id)
            .then((produtoData) => {
                setProduto(produtoData);

                // Buscar produtos da mesma categoria
                if (produtoData.categoriaDTO && produtoData.categoriaDTO.id) {
                    getProductsByCategory(produtoData.categoriaDTO.id, produtoData.id)
                        .then((produtosData) => {
                            setProdutosMesmaCategoria(produtosData);
                        })
                        .catch((error) => {
                            console.error('Erro ao obter produtos da mesma categoria:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Erro ao obter produto:', error);
            });
    }, [id]);

    const handleAddToCart = () => {
        // Usar a função adicionarProduto do contexto
        adicionarProduto(produto.id, 1); // Produto ID e quantidade fixa (1)
        console.log(`Produto ${produto.id} adicionado ao carrinho.`);
    };

    if (!produto) {
        return (
            <div>
                <AppBar />
                <Box sx={{ padding: 4 }}>
                    <Typography>Carregando...</Typography>
                </Box>
                <Footer />
            </div>
        );
    }

    // Configuração do react-multi-carousel para os produtos relacionados
    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
    };

    return (
        <div>
            {/* Barra Superior */}
            <AppBar />

            {/* Conteúdo da Página */}
            <Box sx={{ padding: 4 }}>
                {/* Botão para voltar para a página inicial */}
                <Button variant="text" onClick={() => navigate('/')} sx={{ mb: 2 }}>
                    Voltar para a Página Inicial
                </Button>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        {produto.imagens && produto.imagens.length > 0 ? (
                            <Carousel
                                indicators={true}
                                navButtonsAlwaysVisible={true}
                                autoPlay={false} // Desabilita o autoPlay
                                sx={{ cursor: 'pointer' }}
                            >
                                {produto.imagens.map((imagem) => (
                                    <CardMedia
                                        key={imagem.id}
                                        component="img"
                                        image={`data:image/jpeg;base64,${imagem.dados}`}
                                        alt={`Imagem ${imagem.id}`}
                                        sx={{
                                            maxHeight: '300px',
                                            maxWidth: '100%',
                                            objectFit: 'contain',
                                            margin: '0 auto',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                ))}
                            </Carousel>
                        ) : (
                            <Box
                                sx={{
                                    height: '400px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f0f0f0',
                                }}
                            >
                                <Typography variant="subtitle1">Imagem indisponível</Typography>
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" gutterBottom>
                            {produto.nome}
                        </Typography>
                        <Typography variant="h5" color="primary" gutterBottom>
                            {produto.valor !== undefined
                                ? `R$ ${parseFloat(produto.valor).toFixed(2)}`
                                : 'Preço indisponível'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {produto.descricao}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Categoria: {produto.categoriaDTO && produto.categoriaDTO.nome}
                        </Typography>
                        <Box sx={{ mt: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ShoppingCartIcon />}
                                onClick={handleAddToCart}
                            >
                                Adicionar ao Carrinho
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* Produtos Relacionados */}
                <Box sx={{ mt: 8 }}>
                    <Typography variant="h5" gutterBottom>
                        Produtos Relacionados
                    </Typography>
                    {produtosMesmaCategoria.length > 0 ? (
                        <ReactMultiCarousel
                            responsive={responsive}
                            autoPlay={false}
                            infinite={false}
                            keyBoardControl={true}
                            containerClass="carousel-container"
                            itemClass="carousel-item"
                            arrows={true}
                        >
                            {produtosMesmaCategoria.map((produtoRelacionado) => (
                                <Box key={produtoRelacionado.id} sx={{ padding: 1 }}>
                                    <Card
                                        sx={{
                                            maxWidth: 200,
                                            margin: '0 auto',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <Link
                                            to={`/produto/${produtoRelacionado.id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            {produtoRelacionado.imagens && produtoRelacionado.imagens.length > 0 ? (
                                                <CardMedia
                                                    component="img"
                                                    image={`data:image/jpeg;base64,${produtoRelacionado.imagens[0].dados}`}
                                                    alt={`Imagem do produto ${produtoRelacionado.nome}`}
                                                    sx={{
                                                        height: 150,
                                                        objectFit: 'contain',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        height: 150,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: '#f0f0f0',
                                                    }}
                                                >
                                                    <Typography variant="subtitle1">Imagem indisponível</Typography>
                                                </Box>
                                            )}
                                            <CardContent>
                                                <Typography gutterBottom variant="subtitle1" component="div">
                                                    {produtoRelacionado.nome}
                                                </Typography>
                                                <Typography variant="body2" color="primary">
                                                    {produtoRelacionado.valor !== undefined
                                                        ? `R$ ${parseFloat(produtoRelacionado.valor).toFixed(2)}`
                                                        : 'Preço indisponível'}
                                                </Typography>
                                            </CardContent>
                                        </Link>
                                    </Card>
                                </Box>
                            ))}
                        </ReactMultiCarousel>
                    ) : (
                        <Box
                            sx={{
                                height: '150px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 2,
                            }}
                        >
                            <Typography variant="h6">
                                Sem produtos dessa categoria no estoque.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Rodapé */}
            <Footer />
        </div>
    );
};

export default ViewProduto;
