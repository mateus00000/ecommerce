// src/componentes/Compra/PedidoService.js
import api from '../../Service/Api';

// Criar pedido com estrutura específica
export const finalizarPedido = (pedidoDTO) => {
    return api
        .post('/pedidos', pedidoDTO)
        .then((response) => response.data)
        .catch((error) => {
            console.error('Erro ao finalizar pedido:', error);
            throw error;
        });
};

// Validar cupom
export const validarCupom = (codigo) => {
    return api
        .get(`/cupons/validar/${codigo}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error('Erro ao validar cupom:', error);
            throw error;
        });
};

// Obter usuário por ID (se necessário)
export const getUsuarioById = (id) => {
    return api
        .get(`/usuarios/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error(`Erro ao obter usuário com ID ${id}:`, error);
            throw error;
        });
};

// Obter pedidos por ID do usuário
export const getPedidosByUsuarioId = (usuarioId) => {
    return api
        .get(`/pedidos/usuario/${usuarioId}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error(`Erro ao obter pedidos para usuário ${usuarioId}:`, error);
            throw error;
        });
};

export const atualizarStatusPedido = async (pedidoId, novoStatusDescricao) => {
    try {
        const response = await api.put(`/pedidos/${pedidoId}/status`, { statusPedido: novoStatusDescricao }, {
            headers: {
                'Content-Type': 'application/json', // Enviando como JSON
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar o status do pedido:', error);
        throw error;
    }
};

export const updateAddressById = async (id, addressData) => {
    try {
        const response = await api.put(`/usuarios/${id}/endereco`, addressData);
        return response.data;
    } catch (error) {
        throw error;
    }
};