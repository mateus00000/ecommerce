import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const Coupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [couponList, setCouponList] = useState([]);

  const addCoupon = () => {
    if (couponCode.trim() !== "") {
      setCouponList([...couponList, couponCode]);
      setCouponCode("");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Gerenciar Cupons
      </Typography>
      <TextField
        label="Código do Cupom"
        fullWidth
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={addCoupon} sx={{ mb: 2 }}>
        Adicionar Cupom
      </Button>

      <Box>
        <Typography variant="subtitle1">Cupons Cadastrados:</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código do Cupom</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {couponList.map((coupon, index) => (
              <TableRow key={index}>
                <TableCell>{coupon}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default Coupon;
