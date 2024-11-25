// src/componentes/Compra/FinalizarCompra.jsx
import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import AppBar from '../appbar';
import Footer from '../Footer';
import ResumoCarrinho from './ResumoCarrinho';
import ConfirmarEndereco from './ConfirmarEndereco';
import Pagamento from './Pagamento';

const FinalizarCompra = () => {
    const [etapa, setEtapa] = useState(0);
    const [pedido, setPedido] = useState(null);

    const avancarEtapa = (dadosPedido = null) => {
        if (dadosPedido) setPedido(dadosPedido);
        setEtapa((prev) => prev + 1);
    };

    const voltarEtapa = () => {
        setEtapa((prev) => prev - 1);
    };

    return (
        <Box>
            <AppBar />

            <Box sx={{ p: 3 }}>
                <Stepper activeStep={etapa} alternativeLabel>
                    <Step>
                        <StepLabel>Resumo do Carrinho</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Confirmação do Endereço</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Pagamento</StepLabel>
                    </Step>
                </Stepper>

                {etapa === 0 && <ResumoCarrinho avancarEtapa={avancarEtapa} />}
                {etapa === 1 && <ConfirmarEndereco avancarEtapa={avancarEtapa} voltarEtapa={voltarEtapa} />}
                {etapa === 2 && pedido && <Pagamento pedido={pedido} voltarEtapa={voltarEtapa} />}
            </Box>

            <Footer />
        </Box>
    );
};

export default FinalizarCompra;
