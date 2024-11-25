// CategoriaService.js
import api from '../../../Service/Api';

// Função para criar uma nova categoria
export const createCategory = async (categoryName) => {
    try {
        const response = await api.post('/categorias', { nome: categoryName });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        throw error;
    }
};

// Função para obter todas as categorias
export const getCategories = async () => {
    try {
        const response = await api.get('/categorias');
        return response.data;
    } catch (error) {
        console.error('Erro ao obter categorias:', error);
        throw error;
    }
};

// Função para atualizar uma categoria
export const updateCategory = async (id, categoryName) => {
    try {
        const response = await api.put(`/categorias/${id}`, { nome: categoryName });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        throw error;
    }
};

// Função para deletar uma categoria
export const deleteCategory = async (id) => {
    try {
        await api.delete(`/categorias/${id}`);
    } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        throw error;
    }
};
