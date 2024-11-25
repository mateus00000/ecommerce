import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const Sidebar = ({ onSelect }) => {
  return (
    <List>
      <ListItem button onClick={() => onSelect('products')}>
        <ListItemText primary="Produtos" />
      </ListItem>
      <ListItem button onClick={() => onSelect('categories')}>
        <ListItemText primary="Categorias" />
      </ListItem>
      <ListItem button onClick={() => onSelect('coupons')}>
        <ListItemText primary="Cupons" />
      </ListItem>
    </List>
  );
};

export default Sidebar;
