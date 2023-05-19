import { NavLink, To, } from "react-router-dom";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import { FC, Fragment, ReactNode } from "react";
import { Inventory, Dashboard } from "@mui/icons-material";
import { blue, grey } from '@mui/material/colors';

interface CustomComponentProps {
  children: ReactNode;
  to: To
}

const DrawerItem: FC<CustomComponentProps> = ({ children, to }) => {
  return (
    <NavLink to={to}
      style={({ isActive }) => isActive
        ? { color: blue[500] }
        : { color: grey[800] }
      }
    >
      <ListItemButton>
        {children}
      </ListItemButton>
    </NavLink>
  )
}

export const mainListItems = (
  <Fragment>
    <DrawerItem to={'/dashboard/metric'}>
      <ListItemIcon>
        <Dashboard />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </DrawerItem>

    <DrawerItem to={'/dashboard/customer'}>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Customers" />
    </DrawerItem>

    <DrawerItem to={'/dashboard/product'}>
      <ListItemIcon>
        <Inventory />
      </ListItemIcon>
      <ListItemText primary="Product" />
    </DrawerItem>

    <DrawerItem to={'/dashboard/order'}>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </DrawerItem>
  </Fragment>
);