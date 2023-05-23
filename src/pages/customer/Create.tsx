import api from '@/apis'
import { Box, Button, Paper, Typography } from '@mui/material';
import { ChevronLeft, Save } from '@mui/icons-material';
import { FormContainer, TextFieldElement, SelectElement } from 'react-hook-form-mui';
import { NavLink, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

export default () => {
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await api.customer.store(data)

      enqueueSnackbar('Request is successful', { variant: 'success' })

      return navigate('/dashboard/customer')
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
          <Typography variant={'h6'}>Create a customer</Typography>
          <TextFieldElement
            label="Kode Pelanggan"
            variant="filled"
            name="name"
            required
          />
          <TextFieldElement
            label="Nama Pelanggan"
            variant="filled"
            name="displayName"
            required
          />
          <TextFieldElement
            label="Domisili"
            variant="filled"
            name="location"
            required
          />
          <SelectElement
            label="Jenis Kelamin"
            variant="filled"
            name="gender"
            required
            options={[
              { id: 'M', label: 'Male' },
              { id: 'F', label: 'Female', }
            ]}
          >
          </SelectElement>
          <TextFieldElement
            label="Alamat"
            variant="filled"
            name="address"
            required
          />

          <Box display={'flex'} justifyContent={'end'} gap={1}>
            <NavLink to={'/dashboard/customer'}>
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
