import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box, Snackbar } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import { createCategory, getCategories, updateCategory, deleteCategory } from "./ServiceAdmin/CategoriaService";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Categoria = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setCategoryName(category.nome);
    } else {
      setSelectedCategory(null);
      setCategoryName("");
    }
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, categoryName);
        setSnackbarMessage("Categoria atualizada com sucesso!");
      } else {
        await createCategory(categoryName);
        setSnackbarMessage("Categoria cadastrada com sucesso!");
      }
      setSnackbarSeverity("success");
      fetchCategories();
      setOpenModal(false);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erro ao salvar a categoria", error);
      setSnackbarMessage("Erro ao salvar a categoria");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedCategory) {
        await deleteCategory(selectedCategory.id);
        setSnackbarMessage("Categoria excluída com sucesso!");
        setSnackbarSeverity("success");
        fetchCategories();
        setOpenModal(false);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Erro ao deletar a categoria", error);
      setSnackbarMessage("Erro ao excluir a categoria");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCategory(null);
  };

  const handleEditClick = (category) => {
    handleOpenModal(category);
  };

  const columns = [
    { field: 'nome', headerName: 'Nome da Categoria', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box p={3}>
      <h2>Gestão de Categorias</h2>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Cadastrar
        </Button>
      </Box>

      <Box style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={categories}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.id}
        />
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedCategory ? "Editar Categoria" : "Cadastrar Categoria"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              margin="dense"
              label="Nome da Categoria"
              type="text"
              fullWidth
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {selectedCategory && (
            <Button onClick={handleDelete} color="error" startIcon={<DeleteIcon />} style={{ marginRight: 'auto' }}>
              Excluir
            </Button>
          )}
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            {selectedCategory ? "Salvar" : "Cadastrar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Categoria;
