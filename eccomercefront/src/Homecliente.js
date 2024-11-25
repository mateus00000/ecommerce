// Homecliente.js
import React, { useState } from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import AppBar from "./componentes/appbar";
import Produtos from "./produtos/Produto";
import Filtros from "./componentes/Filtros/Filtros";
import Footer from "./componentes/Footer";

const Homecliente = () => {
  const [produtos, setProdutos] = useState([]);

  const handleProductsFetched = (produtosData) => {
    setProdutos(produtosData);
  };

  return (
    <div>
      {/* AppBar */}
      <AppBar />

      {/* Layout da página */}
      <Grid container columnSpacing={2} rowSpacing={2} sx={{ mt: 2 }}>
        {/* Linha 1: Card logo abaixo do AppBar */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">Informações Importantes</Typography>
              <Typography variant="body1">
                Aqui você pode colocar um texto ou informações importantes para o cliente.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Linha 2: Filtro fixo à esquerda */}
        <Grid item xs={3}>
          <Box
            sx={{
              position: "sticky",
              top: 100,
              height: "auto",
              padding: 2,
            }}
          >
            {/* Componente de Filtros */}
            <Filtros onProductsFetched={handleProductsFetched} />
          </Box>
        </Grid>

        {/* Linha 3: Produtos usando o componente separado */}
        <Grid item xs={9}>
          <Box sx={{ minHeight: "80vh", padding: 2 }}>
            <Produtos produtos={produtos} />
          </Box>
        </Grid>

        {/* Linha 4: Footer */}
        <Grid item xs={12}>
          <Box sx={{ height: 100, textAlign: "center", marginTop: 2 }}>
           <Footer />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Homecliente;
