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
    location: '',
    gender: '',
    createdAt: '',
    updatedAt: '',
  })

  const onFetch = async () => {
    try {
      if (!id) return enqueueSnackbar("Missing row id", { variant: 'error' })

      const { data: customerData } = await api.customer.show(id)

      setData(customerData!)
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
          <ListItemText primary="Kode Pelanggan" secondary="Kode unique yang dimiliki setiap pelanggan" />
        </ListItem>
        <ListItem secondaryAction={
          <Typography>{data.displayName}</Typography>
        }>
          <ListItemText primary="Nama Pelanggan" secondary="Nama lengkap pelanggan" />
        </ListItem>
        <ListItem secondaryAction={
          <Typography>{data.location}</Typography>
        }>
          <ListItemText primary="Domisili" secondary="Domisili pelanggan" />
        </ListItem>
        <ListItem secondaryAction={
          <>
            {data.gender === 'F' ? <Typography>Perempuan</Typography> : null}
            {data.gender === 'M' ? <Typography>Laki-laki</Typography> : null}
          </>
        }>
          <ListItemText primary="Jenis Kelamin" secondary="Jenis kelamin dari pelanggan" />
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
        <NavLink to={'/dashboard/customer'}>
          <Button startIcon={<ChevronLeft />} variant='outlined' disableElevation color='primary'>
            Go Back
          </Button>
        </NavLink>

        <NavLink to={`/dashboard/customer/${id}/edit`}>
          <Button startIcon={<Edit />} variant='outlined' disableElevation color='success'>
            Edit
          </Button>
        </NavLink>
      </Box>
    </Paper>
  )
}
