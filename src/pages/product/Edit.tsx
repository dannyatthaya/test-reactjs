import api from '@/apis'
import { useEffect, useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { ChevronLeft, Save } from '@mui/icons-material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

export default () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({
    name: '',
    displayName: '',
    category: '',
    price: 0,
  })

  const onSubmit = async (data: any) => {
    try {
      if (!id) return enqueueSnackbar("Missing row id", { variant: 'error' })

      await api.product.update(id, data)

      enqueueSnackbar('Request is successful', { variant: 'success' })

      return navigate('/dashboard/product')
    } catch (error) {
      if (typeof error === 'string') {
        enqueueSnackbar(error, { variant: 'error' })
      }
    }
  }

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
    <Paper sx={{ display: 'flex', flexDirection: 'column', p: 2 }} variant='outlined'>
      <FormContainer
        onSuccess={onSubmit}
        defaultValues={data}
        values={data}
        FormProps={{
          'aria-autocomplete': 'none',
          autoComplete: 'off'
        }}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          height={'100%'}
          gap={4}
        >
          <Typography variant={'h6'}>Edit a product</Typography>
          <TextFieldElement
            label="Kode Produk"
            variant="filled"
            name="name"
            required
          />
          <TextFieldElement
            label="Nama Produk"
            variant="filled"
            name="displayName"
            required
          />
          <TextFieldElement
            label="Kategori"
            variant="filled"
            name="category"
            required
          />
          <TextFieldElement
            label="Harga"
            variant="filled"
            name="price"
            type="number"
            required
          />

          <Box display={'flex'} justifyContent={'end'} gap={1}>
            <NavLink to={'/dashboard/product'}>
              <Button startIcon={<ChevronLeft />} variant='outlined' disableElevation color='primary'>
                Go Back
              </Button>
            </NavLink>

            <Button startIcon={<Save />} variant='contained' disableElevation color='primary' type='submit'>
              Edit
            </Button>
          </Box>
        </Box>
      </FormContainer>
    </Paper>
  )
}
