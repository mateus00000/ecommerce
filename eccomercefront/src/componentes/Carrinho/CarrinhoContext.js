import React, { createContext, useState, useEffect } from 'react';
import { getCarrinhoFromAPI, adicionarProdutoNaAPI, removerProdutoDaAPI, limparCarrinhoNaAPI } from './CarrinhoService';

export const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
    const [carrinho, setCarrinho] = useState(null);

    useEffect(() => {
        getCarrinhoFromAPI().then((data) => {
            setCarrinho(data);
        }).catch((error) => {
            console.error('Erro ao obter carrinho:', error);
        });
    }, []);

    const adicionarProduto = (produtoId, quantidade) => {
        adicionarProdutoNaAPI(produtoId, quantidade).then((data) => {
            setCarrinho(data);
        }).catch((error) => {
            console.error('Erro ao adicionar produto ao carrinho:', error);
        });
    };

    const removerProduto = (produtoId) => {
        removerProdutoDaAPI(produtoId).then((data) => {
            setCarrinho(data);
        }).catch((error) => {
            console.error('Erro ao remover produto do carrinho:', error);
        });
    };

    const limparCarrinho = () => {
        limparCarrinhoNaAPI().then((data) => {
            setCarrinho(data);
        }).catch((error) => {
            console.error('Erro ao limpar carrinho:', error);
        });
    };

    const alterarQuantidade = (produtoId, novaQuantidade) => {
        if (novaQuantidade <= 0) return;

        adicionarProdutoNaAPI(produtoId, novaQuantidade - carrinho.itens.find(item => item.produtoDTO.id === produtoId).quantidade)
            .then((data) => {
                setCarrinho(data);
            })
            .catch((error) => {
                console.error('Erro ao alterar quantidade:', error);
            });
    };

    return (
        <CarrinhoContext.Provider value={{ carrinho, adicionarProduto, removerProduto, limparCarrinho, alterarQuantidade }}>
            {children}
        </CarrinhoContext.Provider>
    );
};
