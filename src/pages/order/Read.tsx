import api from '@/apis'
import { ChevronLeft, Edit } from '@mui/icons-material';
import { Box, Button, List, ListItem, ListItemText, Paper, Typography } from "@mui/material"
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

export default () => {
  const { id } = useParams();
  const [rows, setRows] = useState<any[]>([])
  const formatter = Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  })
  const [data, setData] = useState({
    name: '',
    customer: {
      displayName: '',
    },
    createdAt: '',
    updatedAt: '',
  })

  const columns: GridColDef[] = [
    { field: 'displayName', headerName: 'NAMA PRODUK', flex: 1, sortable: false },
    {
      field: 'price',
      headerName: 'HARGA PRODUK',
      flex: 1,
      sortable: false,
      valueFormatter: (params) => formatter.format(params.value)
    },
    { field: 'quantity', headerName: 'QUANTITY', flex: 1, type: 'number', sortable: false, editable: true },
  ];

  const onFetch = async () => {
    try {
      if (!id) return enqueueSnackbar("Missing row id", { variant: 'error' })

      const { data: orderData } = await api.order.show(id)

      setData(orderData!)
      setRows(orderData!.products)
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
          <ListItemText primary="Kode Penjualan" secondary="Kode unique yang dimiliki setiap penjualan" />
        </ListItem>
        <ListItem secondaryAction={
          <Typography>{data.customer.displayName}</Typography>
        }>
          <ListItemText primary="Nama Pelanggan" secondary="Nama pelanggan" />
        </ListItem>
        <ListItem secondaryAction={
          <Typography>{formatter.format((data as any).subtotal ?? 0)}</Typography>
        }>
          <ListItemText primary="Subtotal" secondary="Subtotal penjualan pelanggan" />
        </ListItem>
        <Box mx={2} my={4}>
          <DataGrid
            rows={rows}
            columns={columns}
            columnHeaderHeight={42}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 100 },
              },
            }}
            pageSizeOptions={[25]}
            sx={{ height: 300 }}
            disableColumnFilter
            hideFooter
          />
        </Box>
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
        <NavLink to={'/dashboard/order'}>
          <Button startIcon={<ChevronLeft />} variant='outlined' disableElevation color='primary'>
            Go Back
          </Button>
        </NavLink>

        <NavLink to={`/dashboard/order/${id}/edit`}>
          <Button startIcon={<Edit />} variant='outlined' disableElevation color='success'>
            Edit
          </Button>
        </NavLink>
      </Box>
    </Paper>
  )
}
