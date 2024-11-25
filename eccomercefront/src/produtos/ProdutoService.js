// services/ProdutoService.js

import api from '../Service/Api.js';
export const getProducts = (params) => {
  console.log('Chamando getProducts com params:', params);

  return api
    .get('/produtos/filtrar', { params })
    .then((response) => {
      console.log('Resposta da API:', response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('Erro ao obter produtos:', error);
      throw error;
    });
};

export const getProductById = (id) => {
  return api
    .get(`/produtos/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Erro ao obter produto com ID ${id}:`, error);
      throw error;
    });
};

export const getProductsByCategory = (categoriaId, produtoId) => {
  return api
    .get(`/produtos/categoria/${categoriaId}/excluir/${produtoId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Erro ao obter produtos da categoria ${categoriaId}:`, error);
      throw error;
    });
};