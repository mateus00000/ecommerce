// componentes/Filtros.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import { fetchCategorias } from './FiltrosService.js';
import { getProducts } from '../../produtos/ProdutoService.js';


const Filtros = ({ onProductsFetched }) => {
    const [categorias, setCategorias] = useState([]);
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [precoMin, setPrecoMin] = useState('');
    const [precoMax, setPrecoMax] = useState('');
  
    useEffect(() => {
      fetchCategorias()
        .then((response) => {
          setCategorias(response.data);
        })
        .catch((error) => {
          console.error('Erro ao buscar categorias:', error);
        });
    }, []);
  
    const handleCategoriaChange = (event) => {
      const { value, checked } = event.target;
      setCategoriasSelecionadas((prev) =>
        checked ? [...prev, value] : prev.filter((cat) => cat !== value)
      );
    };
  
    const aplicarFiltros = () => {
      const filtros = {
        categorias: categoriasSelecionadas.length > 0 ? categoriasSelecionadas : null,
        precoMin: precoMin !== '' ? parseFloat(precoMin) : null,
        precoMax: precoMax !== '' ? parseFloat(precoMax) : null,
      };
  
      getProducts(filtros)
        .then((produtosData) => {
          onProductsFetched(produtosData);
        })
        .catch((error) => {
          console.error('Erro ao obter produtos:', error);
        });
    };
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filtros
      </Typography>

      {/* Filtro de Preço */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Faixa de Preço
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <TextField
            label="Valor Mínimo"
            variant="outlined"
            size="small"
            value={precoMin}
            onChange={(e) => setPrecoMin(e.target.value)}
            type="number"
            fullWidth
          />
          <TextField
            label="Valor Máximo"
            variant="outlined"
            size="small"
            value={precoMax}
            onChange={(e) => setPrecoMax(e.target.value)}
            type="number"
            fullWidth
          />
        </Box>
      </Box>

      <Divider />

      {/* Filtro de Categoria */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Categorias
        </Typography>
        <FormControl component="fieldset" variant="standard">
          <FormGroup>
            {categorias.map((categoria) => (
              <FormControlLabel
                key={categoria.id}
                control={
                  <Checkbox
                    value={categoria.nome}
                    onChange={handleCategoriaChange}
                    checked={categoriasSelecionadas.includes(categoria.nome)}
                  />
                }
                label={categoria.nome}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Box>

      {/* Botão para aplicar filtros */}
      <Button
        variant="contained"
        color="primary"
        onClick={aplicarFiltros}
        sx={{ mt: 4 }}
        fullWidth
      >
        Aplicar Filtros
      </Button>
    </Box>
  );
};

export default Filtros;
