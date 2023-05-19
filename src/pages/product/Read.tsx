import api from '@/apis'
import { ChevronLeft, Edit } from '@mui/icons-material';
import { Box, Button, List, ListItem, ListItemText, Paper, Typography } from "@mui/material"
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

export default () => {
  const { id } = useParams();
  const [data, setData] = useState({
    name: '',
    displayName: '',
    category: '',
    price: 0,
    createdAt: '',
    updatedAt: '',
  })

  const onFetch = async () => {
    try {
      if (!id) return enqueueSnackbar("Missing row id", { variant: 'error' })

      const { data: productData } = await api.product.show(id)

      setData(productData!)
    } catch (error) {
      if (typeof error === 'string') {
        enqueueSnackbar(error, { variant: 'error' })
      }
    }
  }

  useEffect(() => {
    onFetch()
    return () => { };
  }, []);

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', p: 1 }} variant='outlined'>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem secondaryAction={
          <Typography>{data.name}</Typography>
        }>
          <ListItemText primary="Kode Produk" secondary="Kode unique yang dimiliki setiap produk" />
        </ListItem>
        <ListItem secondaryAction={
          <Typography>{data.displayName}</Typography>
        }>
          <ListItemText primary="Nama Produk" secondary="Nama produk" />
        </ListItem>
        <ListItem secondaryAction={
          <Typography>{data.category}</Typography>
        }>
          <ListItemText primary="Kategori" secondary="Kategori produk" />
        </ListItem>
        <ListItem secondaryAction={
          <Typography>{data.price == 0 ? '' : data.price}</Typography>
        }>
          <ListItemText primary="Harga" secondary="Harga dari pelanggan" />
        </ListItem>
        <ListItem secondaryAction={
          <Typography>{data.createdAt}</Typography>
        }>
          <ListItemText primary="Dibuat pada" secondary="Tanggal dan waktu pembuatan pelanggan" />
        </ListItem>
        <ListItem secondaryAction={
          <Typography>{data.updatedAt}</Typography>
        }>
          <ListItemText primary="Dibuat pada" secondary="Tanggal dan waktu perubahaan yang terjadi pada pelanggan" />
        </ListItem>
      </List>

      <Box display="flex" justifyContent="end" gap={1}>
        <NavLink to={'/dashboard/product'}>
          <Button startIcon={<ChevronLeft />} variant='outlined' disableElevation color='primary'>
            Go Back
          </Button>
        </NavLink>

        <NavLink to={`/dashboard/product/${id}/edit`}>
          <Button startIcon={<Edit />} variant='outlined' disableElevation color='success'>
            Edit
          </Button>
        </NavLink>
      </Box>
    </Paper>
  )
}
