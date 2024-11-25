// services/FiltrosService.js
import api from '../../Service/Api.js';

export const fetchCategorias = () => {
  return api.get('/categorias');
};

