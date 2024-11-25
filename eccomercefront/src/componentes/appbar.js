// src/componentes/auth/ResponsiveAppBar.js

import React, { useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importação correta
import { CarrinhoContext } from '../componentes/Carrinho/CarrinhoContext';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    Tooltip,
    MenuItem,
    Badge,
    Drawer
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdbIcon from '@mui/icons-material/Adb';
import CarrinhoContent from '../componentes/Carrinho/CarrinhoContent';

function ResponsiveAppBar() {
    const { carrinho } = useContext(CarrinhoContext);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [isCarrinhoOpen, setIsCarrinhoOpen] = useState(false);
    const [totalItensCarrinho, setTotalItensCarrinho] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica se o usuário está logado ao montar o componente
        const storedToken = localStorage.getItem('userToken');
        if (storedToken) {
            try {
                const decodedToken = jwtDecode(storedToken);
                // Verifica se o token não expirou
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    // Token expirado
                    handleLogout();
                } else {
                    setIsLoggedIn(true);
                    setUser({
                        id: decodedToken.id,
                        email: decodedToken.email,
                        // Adicione outros campos conforme necessário
                    });
                }
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
                handleLogout();
            }
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const total = carrinho && carrinho.itens
            ? carrinho.itens.reduce((sum, item) => sum + item.quantidade, 0)
            : 0;
        setTotalItensCarrinho(total);
    }, [carrinho]);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const toggleCarrinhoDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsCarrinhoOpen(open);
    };

    const handleLogout = () => {
        // Limpa o localStorage e atualiza o estado de autenticação
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        setUser(null);
        handleCloseUserMenu();
        navigate('/login');
    };

    // Definir as opções de menu com base no estado de autenticação
    const settings = isLoggedIn
        ? ['Perfil', 'Meus Pedidos', 'Sair']
        : ['Entrar'];

    const handleSettingClick = (setting) => {
        handleCloseUserMenu();
        switch (setting) {
            case 'Perfil':
                navigate('/profile');
                break;
            case 'Meus Pedidos':
                navigate('/pedidos'); // Link correto para "Meus Pedidos"
                break;
            case 'Sair':
                handleLogout();
                break;
            case 'Entrar':
                navigate('/login');
                break;
            default:
                break;
        }
    };

    // Definir as páginas padrão
    const pages = ['Produtos', 'Categorias', 'Contato'];

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo para telas maiores */}
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        E-commerce
                    </Typography>

                    {/* Menu para telas menores */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="menu mobile"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>
                                        <Link
                                            to={`/${page.toLowerCase().replace(/\s/g, '-')}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            {page}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Logo para telas menores */}
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        E-commerce
                    </Typography>

                    {/* Menu para telas maiores */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                                component={Link}
                                to={`/${page.toLowerCase().replace(/\s/g, '-')}`}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    {/* Ícones de Carrinho e Usuário */}
                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                        {/* Ícone do Carrinho */}
                        <IconButton
                            size="large"
                            aria-label="carrinho de compras"
                            color="inherit"
                            onClick={toggleCarrinhoDrawer(true)}
                        >
                            <Badge badgeContent={totalItensCarrinho} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>

                        {/* Menu de Usuário */}
                        {isLoggedIn ? (
                            <>
                                <Tooltip title="Configurações">
                                    <Button
                                        onClick={handleOpenUserMenu}
                                        sx={{
                                            color: 'white',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {user?.email || 'Usuário'}
                                    </Button>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={() => handleSettingClick(setting)}>
                                            <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                                sx={{ ml: 2 }}
                            >
                                Entrar
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
            {/* Drawer do Carrinho */}
            <Drawer anchor="right" open={isCarrinhoOpen} onClose={toggleCarrinhoDrawer(false)}>
                <Box
                    sx={{ width: 350 }}
                    role="presentation"
                    onKeyDown={toggleCarrinhoDrawer(false)}
                >
                    <CarrinhoContent />
                </Box>
            </Drawer>
        </AppBar>

    );
}

export default ResponsiveAppBar;
