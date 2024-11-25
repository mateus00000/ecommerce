import api from '../../Service/Api';

export const getCarrinhoFromAPI = () => {
    return api.get('/carrinho').then((response) => response.data);
};

export const adicionarProdutoNaAPI = (produtoId, quantidade) => {
    return api.post(`/carrinho/adicionar-produto`, null, {
        params: {
            produtoId,
            quantidade,
        },
    }).then((response) => response.data);
};

export const removerProdutoDaAPI = (produtoId) => {
    return api.delete(`/carrinho/remover-produto/${produtoId}`).then((response) => response.data);
};

export const limparCarrinhoNaAPI = () => {
    return api.delete('/carrinho/limpar').then((response) => response.data);
};
