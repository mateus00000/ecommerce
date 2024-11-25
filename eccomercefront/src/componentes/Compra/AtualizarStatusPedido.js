// src/componentes/Admin/AtualizarStatusPedido.jsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CircularProgress
} from '@mui/material';
import { atualizarStatusPedido } from '../../services/PedidoService';
import { statusMap } from '../../utils/statusMap'; // Importar o mapeamento

const AtualizarStatusPedido = ({ pedidoId }) => {
    const [novoStatus, setNovoStatus] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAtualizar = () => {
        if (!novoStatus) {
            setMensagem('Por favor, selecione um novo status.');
            return;
        }

        setLoading(true);
        atualizarStatusPedido(pedidoId, novoStatus)
            .then(() => {
                setLoading(false);
                setMensagem('Status atualizado com sucesso.');
            })
            .catch(() => {
                setLoading(false);
                setMensagem('Erro ao atualizar o status do pedido.');
            });
    };

    return (
        <Box sx={{ mt: 2 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Novo Status</InputLabel>
                <Select
                    value={novoStatus}
                    onChange={(e) => setNovoStatus(e.target.value)}
                    label="Novo Status"
                >
                    {Object.entries(statusMap).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                            {value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {mensagem && (
                <Typography sx={{ mb: 2 }} color={mensagem.includes('sucesso') ? 'primary' : 'error'}>
                    {mensagem}
                </Typography>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleAtualizar}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
            >
                {loading ? 'Atualizando...' : 'Atualizar Status'}
            </Button>
        </Box>
    );
};

export default AtualizarStatusPedido;
