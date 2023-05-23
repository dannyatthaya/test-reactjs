import api from '@/apis'
import { Box, Button, Paper, Typography } from '@mui/material';
import { ChevronLeft, Save } from '@mui/icons-material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { NavLink, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

export default () => {
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await api.product.store(data)

      enqueueSnackbar('Request is successful', { variant: 'success' })

      return navigate('/dashboard/product')
    } catch (error) {
      if (typeof error === 'string') {
        enqueueSnackbar(error, { variant: 'error' })
      }
    }
  }

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', p: 2 }} variant='outlined'>
      <FormContainer
        onSuccess={onSubmit}
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
          <Typography variant={'h6'}>Create a product</Typography>
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
          <TextFieldElement
            label="Warna"
            variant="filled"
            name="color"
            required
          />

          <Box display={'flex'} justifyContent={'end'} gap={1}>
            <NavLink to={'/dashboard/product'}>
              <Button startIcon={<ChevronLeft />} variant='outlined' disableElevation color='primary'>
                Go Back
              </Button>
            </NavLink>

            <Button startIcon={<Save />} variant='contained' disableElevation color='primary' type='submit'>
              Add
            </Button>
          </Box>
        </Box>
      </FormContainer>
    </Paper>
  )
}
