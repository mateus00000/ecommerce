import React from 'react';
import './App.css';
import AdminPage from './AdminPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homecliente from './Homecliente';
import ViewProduto from './produtos/ViewProduto';
import { CarrinhoProvider } from './componentes/Carrinho/CarrinhoContext';
import Carrinho from './componentes/Carrinho/Carrinho';
import FinalizarCompra from './componentes/Compra/FinalizarCompra';
import PedidosUsuarios from './componentes/Compra/PedidosUsuario';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import PedidoDetails from './componentes/Compra/PedidoDetails';
import Login from './componentes/auth/Login';
import Signup from './componentes/auth/Signup';
import ForgotPassword from './componentes/auth/ForgotPassword';
import Profile from './componentes/perfil/Profile';
import PrivateRoute from './componentes/auth/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CarrinhoProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Homecliente />} />
            <Route path="/produto/:id" element={<ViewProduto />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/finalizar-compra" element={<FinalizarCompra />} />
            <Route path="/pedidos/:pedidoId" element={<PedidoDetails />} />
            <Route path="*" element={<h1>Not Found</h1>} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Signup />} />
            <Route path="/esqueceu-senha" element={<ForgotPassword />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/pedidos"
              element={
                <PrivateRoute>
                  <PedidosUsuarios />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </CarrinhoProvider >
    </ThemeProvider>
  );
}

export default App;
