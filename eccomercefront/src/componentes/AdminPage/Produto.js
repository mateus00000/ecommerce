import React, { useState, useEffect } from "react";
import {
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Typography,
} from "@mui/material";
import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
} from "./ServiceAdmin/ProdutoService";
import { getCategories } from "./ServiceAdmin/CategoriaService";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const Produto = () => {
    const [open, setOpen] = useState(false);
    const [produtoNome, setProdutoNome] = useState("");
    const [produtoDescricao, setProdutoDescricao] = useState("");
    const [produtoValor, setProdutoValor] = useState(0);
    const [produtoEstoque, setProdutoEstoque] = useState(0);
    const [produtoCategoria, setProdutoCategoria] = useState("");
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [selectedProduto, setSelectedProduto] = useState(null);

    const navigate = useNavigate();

    const handleOpen = () => {
        setOpen(true);
        fetchCategorias();
    };

    const handleClose = () => {
        setOpen(false);
        setProdutoNome("");
        setProdutoDescricao("");
        setProdutoValor(0);
        setProdutoEstoque(0);
        setProdutoCategoria("");
        setSelectedProduto(null);
    };

    const handleSave = async () => {
        try {
            if (selectedProduto) {
                await updateProduct(selectedProduto.id, {
                    nome: produtoNome,
                    descricao: produtoDescricao,
                    valor: produtoValor,
                    estoque: produtoEstoque,
                    categoriaDTO: { id: produtoCategoria },
                });
            } else {
                await createProduct({
                    nome: produtoNome,
                    descricao: produtoDescricao,
                    valor: produtoValor,
                    estoque: produtoEstoque,
                    categoriaDTO: { id: produtoCategoria },
                });
            }
            fetchProdutos();
            handleClose();
        } catch (error) {
            console.error("Erro ao salvar o produto", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);
            fetchProdutos();
        } catch (error) {
            console.error("Erro ao deletar o produto", error);
        }
    };

    const fetchProdutos = async () => {
        try {
            const response = await getProducts();
            setProdutos(response);
        } catch (error) {
            console.error("Erro ao carregar os produtos:", error);
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await getCategories();
            setCategorias(response);
        } catch (error) {
            console.error("Erro ao carregar as categorias:", error);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    const handleRowClick = (params) => {
        navigate(`/admin/products/${params.row.id}`);
    };

    const columns = [
        { field: "nome", headerName: "Nome", width: 200 },
        { field: "descricao", headerName: "Descrição", width: 200 },
        { field: "valor", headerName: "Valor", width: 100 },
        { field: "estoque", headerName: "Estoque", width: 100 },
        {
            field: "categoriaDTO",
            headerName: "Categoria",
            width: 150,
            renderCell: (params) =>
                params.value ? params.value.nome : "Sem categoria",
        },
        {
            field: "actions",
            headerName: "Ações",
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        setSelectedProduto(params.row);
                        setProdutoNome(params.row.nome);
                        setProdutoDescricao(params.row.descricao);
                        setProdutoValor(params.row.valor);
                        setProdutoEstoque(params.row.estoque);
                        setProdutoCategoria(params.row.categoriaDTO?.id || "");
                        setOpen(true);
                        fetchCategorias();
                    }}
                >
                    Editar
                </Button>
            ),
        },
    ];

    return (
        <Box m={2}>
            <Typography variant="h4" gutterBottom>
                Gerenciamento de Produtos
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Cadastrar Produto
                </Button>
            </Box>

            <Box style={{ height: 500, width: "100%" }}>
                <DataGrid
                    rows={produtos}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onRowClick={handleRowClick} // Navega ao clicar na linha
                    style={{ backgroundColor: "#f5f5f5" }}
                />
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    {selectedProduto ? "Editar Produto" : "Cadastrar Produto"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nome do Produto"
                        type="text"
                        fullWidth
                        value={produtoNome}
                        onChange={(e) => setProdutoNome(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Descrição"
                        type="text"
                        fullWidth
                        value={produtoDescricao}
                        onChange={(e) => setProdutoDescricao(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Valor"
                        type="number"
                        fullWidth
                        value={produtoValor}
                        onChange={(e) => setProdutoValor(parseFloat(e.target.value))}
                    />
                    <TextField
                        margin="dense"
                        label="Estoque"
                        type="number"
                        fullWidth
                        value={produtoEstoque}
                        onChange={(e) => setProdutoEstoque(parseInt(e.target.value, 10))}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel shrink>Categoria</InputLabel>
                        <Select
                            value={produtoCategoria}
                            onChange={(e) => setProdutoCategoria(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="">
                                <em>Nenhuma</em>
                            </MenuItem>
                            {categorias.map((categoria) => (
                                <MenuItem key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Produto;
