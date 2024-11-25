import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Grid,
  CircularProgress,
  Button,
  TextField,
  IconButton,
  Container,
  Paper,
  Divider,
} from '@mui/material';
import { Edit, Save, Cancel, AddPhotoAlternate } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from './ServiceAdmin/ProdutoService';
import { uploadProductImage } from './ServiceAdmin/ProdutoService';

const ProdutoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedProduto, setEditedProduto] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProduto();
  }, []);

  const fetchProduto = async () => {
    try {
      const response = await getProductById(id);
      setProduto(response);
      setEditedProduto(response);
    } catch (error) {
      console.error('Erro ao carregar o produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleProdutoChange = (e) => {
    const { name, value } = e.target;
    setEditedProduto({ ...editedProduto, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      await updateProduct(id, editedProduto);
      setProduto(editedProduto);
      setEditMode(false);
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadImage = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('imagem', selectedFile);
        await uploadProductImage(id, formData);
        setSelectedFile(null);
        fetchProduto();
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!produto) {
    return (
      <Box m={2}>
        <Typography variant="h6">Produto não encontrado.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="center" mt={2} mb={2}>
        <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Box>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">
            {editMode ? (
              <TextField
                name="nome"
                label="Nome do Produto"
                value={editedProduto.nome}
                onChange={handleProdutoChange}
                fullWidth
              />
            ) : (
              produto.nome
            )}
          </Typography>
          <Box>
            {editMode ? (
              <>
                <IconButton onClick={handleSaveChanges} color="primary">
                  <Save />
                </IconButton>
                <IconButton onClick={handleEditToggle} color="secondary">
                  <Cancel />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={handleEditToggle} color="primary">
                <Edit />
              </IconButton>
            )}
          </Box>
        </Box>

        <Divider sx={{ marginBottom: 2 }} />

        <Box mb={4} textAlign="center">
          {editMode ? (
            <TextField
              name="descricao"
              label="Descrição"
              value={editedProduto.descricao}
              onChange={handleProdutoChange}
              multiline
              rows={4}
              fullWidth
            />
          ) : (
            <Typography variant="body1">{produto.descricao}</Typography>
          )}
        </Box>

        <Grid container spacing={2} textAlign="center">
          <Grid item xs={12} sm={6}>
            {editMode ? (
              <TextField
                name="valor"
                label="Valor"
                type="number"
                value={editedProduto.valor}
                onChange={handleProdutoChange}
                fullWidth
              />
            ) : (
              <Typography variant="h6">
                Valor: R$ {produto.valor !== undefined && produto.valor !== null ? Number(produto.valor).toFixed(2) : 'N/A'}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {editMode ? (
              <TextField
                name="estoque"
                label="Estoque"
                type="number"
                value={editedProduto.estoque}
                onChange={handleProdutoChange}
                fullWidth
              />
            ) : (
              <Typography variant="h6">
                Estoque: <strong>{produto.estoque}</strong>
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
              Categoria: <strong>{produto.categoriaDTO ? produto.categoriaDTO.nome : 'Sem categoria'}</strong>
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 4 }} />

        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Imagens do Produto</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddPhotoAlternate />}
              component="label"
            >
              Adicionar Imagem
              <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
          </Box>
          {selectedFile && (
            <Box mb={2}>
              <Typography>Imagem selecionada: {selectedFile.name}</Typography>
              <Button variant="contained" color="primary" onClick={handleUploadImage}>
                Enviar Imagem
              </Button>
            </Box>
          )}
          {produto.imagens && produto.imagens.length > 0 ? (
            <Grid container spacing={2}>
              {produto.imagens.map((imagem) => (
                <Grid item xs={12} sm={6} md={4} key={imagem.id}>
                  <Card sx={{ boxShadow: 3 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`data:image/jpeg;base64,${imagem.dados}`}
                      alt={`Imagem ${imagem.id}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>Este produto não possui imagens.</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProdutoDetalhes;
