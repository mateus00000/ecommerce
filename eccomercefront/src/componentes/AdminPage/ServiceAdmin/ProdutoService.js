import api from '../../../Service/Api';

export const createProduct = async (product) => {
  try {
    const response = await api.post('/produtos', product);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await api.get('/produtos');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    throw error;
  }
};

export const updateProduct = async (id, updatedProduct) => {
  try {
    const response = await api.put(`/produtos/${id}`, updatedProduct);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await api.delete(`/produtos/${id}`);
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    throw error;
  }
};
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    throw error;
  }
};
export const uploadProductImage = async (id, formData) => {
  try {
    await api.post(`/produtos/${id}/imagens`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Erro ao enviar imagem:', error);
    throw error;
  }
};