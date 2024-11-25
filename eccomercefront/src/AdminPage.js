import React from "react"; 
import { Box, Container } from "@mui/material";
import Sidebar from "./componentes/AdminPage/Sidebar";
import Produto from "./componentes/AdminPage/Produto";
import Categoria from "./componentes/AdminPage/Categoria";
import Cupom from "./componentes/AdminPage/Cupom";
import ProdutoDetalhes from "./componentes/AdminPage/ProdutoDetalhes";
import { Routes, Route, useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleSectionSelect = (section) => {
    navigate(`/admin/${section}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar onSelect={handleSectionSelect} />
      <Container sx={{ mt: 4, ml: 3, flexGrow: 1 }}>
        <Routes>
          <Route path="products" element={<Produto />} />
          <Route path="products/:id" element={<ProdutoDetalhes />} />
          <Route path="categories" element={<Categoria />} />
          <Route path="coupons" element={<Cupom />} />
          <Route path="*" element={<Produto />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default AdminPage;
