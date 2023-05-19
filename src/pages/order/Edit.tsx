import api from '@/apis'
import parse from 'autosuggest-highlight/parse';
import { useState, useEffect, useMemo } from 'react'
import { Box, Button, Grid, Paper, Typography, debounce } from '@mui/material';
import { ChevronLeft, Save, Delete, Add } from '@mui/icons-material';
import { AutocompleteElement, FormContainer } from 'react-hook-form-mui';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowParams } from '@mui/x-data-grid';
import AddProductModal from '@/pages/order/Create/ProductModal';

export default () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [inputValue, setInputValue] = useState('');
  const [customers, setCustomers] = useState<App.Model.Customer[]>([])
  const [customer, setCustomer] = useState<App.Model.Customer | null>(null)
  const [rows, setRows] = useState<App.Model.OrderProduct[]>([])
  const [show, setShow] = useState(false);

  const columns: GridColDef[] = [
    {
      field: 'product', headerName: 'NAMA PRODUK', flex: 1, sortable: false, valueGetter(params) {
        return (params.value as App.Model.Product).displayName
      },
    },
    { field: 'quantity', headerName: 'QUANTITY', flex: 1, type: 'number', sortable: false, editable: true },
    {
      field: 'actions',
      headerName: 'AKSI',
      type: 'actions',
      flex: 1,
      sortable: false,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem icon={<Delete />} onClick={() => handleDelete(params.id)} label="Delete" />,
      ]
    }
  ];

  const onSubmit = async (data: any) => {
    try {
      if (!id) return enqueueSnackbar("Missing row id", { variant: 'error' })

      await api.order.update(id, {
        ...data,
        id,
        products: rows,
      })

      enqueueSnackbar('Request is successful', { variant: 'success' })

      return navigate('/dashboard/order')
    } catch (error) {
      if (typeof error === 'string') {
        enqueueSnackbar(error, { variant: 'error' })
      }
    }
  }

  const handleDelete = (id: string | number | GridRowId) => {
    setRows((rows) => rows.filter(row => row.id !== id))
  }

  const handleOpenAdd = () => {
    setShow(true)
  }

  const handleSubmitAdd = (value?: App.Model.OrderProduct) => {
    handleCloseAdd()

    if (value) {
      if (rows.some(row => row.product.id == value.product.id)) {
        enqueueSnackbar('Product is already in table', { variant: 'error' })
      } else {
        setRows([value, ...rows])
      }
    }
  }

  const handleCloseAdd = () => {
    setShow(false)
  }

  const fetch = useMemo(
    () => debounce(
      async (request: { search: string }, callback: (results?: App.Model.Customer[]) => void) => {
        const { data } = await api.customer.index(request)

        callback(data)
      }, 300,
    ), [],
  );

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setCustomers(customer ? [customer] : []);
      return undefined;
    }

    fetch({ search: inputValue }, (results?: App.Model.Customer[]) => {
      if (active) {
        let newCustomers: App.Model.Customer[] = [];

        if (customer) {
          newCustomers = [customer];
        }

        if (results) {
          newCustomers = [...newCustomers, ...results];
        }

        setCustomers(newCustomers);
      }
    });

    return () => {
      active = false;
    };
  }, [customer, inputValue, fetch]);

  const onFetch = async () => {
    try {
      if (!id) return enqueueSnackbar("Missing row id", { variant: 'error' })

      const { data: orderData } = await api.order.show(id)

      setCustomer(orderData!.customer)
      setCustomers([orderData!.customer])
      setRows(orderData!.products.map((product: any) => {
        return {
          id: product.id,
          product: {
            id: product.id,
            name: product.name,
            displayName: product.displayName,
            category: product.category,
            price: product.price,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          },
          quantity: product.quantity,
        }
      }) as App.Model.OrderProduct[])

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
        values={{
          customer,
        }}
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
          <Typography variant={'h6'}>Create a order</Typography>
          <AutocompleteElement
            label="Pelanggan"
            options={customers}
            name="customer"
            required
            textFieldProps={{
              variant: 'filled',
              SelectProps: {
                renderValue: (value: any) => value.displayName ?? ''
              }
            }}
            autocompleteProps={{
              filterOptions: (x) => x,
              autoComplete: true,
              includeInputInList: true,
              filterSelectedOptions: true,
              value: customer,
              noOptionsText: "No customers",
              getOptionLabel: (option: App.Model.Customer) => option.displayName,
              onChange: (_: any, newValue: App.Model.Customer | null) => {
                setCustomers(newValue ? [newValue, ...customers] : customers);
                setCustomer(newValue);
              },
              onInputChange: (_, newInputValue) => {
                setInputValue(newInputValue);
              },
              renderOption: (props, option: App.Model.Customer) => {
                const matches = option.displayName ? [option.displayName] : [];

                const parts = parse(
                  option.displayName,
                  matches.map((match: any) => [match.offset, match.offset + match.length]),
                );

                return (
                  <li {...props}>
                    <Grid container alignItems="center">
                      <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                        {parts.map((part: any, index: number) => (
                          <Box
                            key={index}
                            component="span"
                            sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                          >
                            {part.text}
                          </Box>
                        ))}

                        <Typography variant="body1" color="text.primary">
                          {option.displayName}
                        </Typography>
                      </Grid>
                    </Grid>
                  </li>
                );
              },
            }}
          />

          <Box flexGrow={1} display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} justifyContent={'end'}>
              <Button startIcon={<Add />} variant='contained' disableElevation color='primary' onClick={handleOpenAdd}>
                Add Product
              </Button>
            </Box>

            <Box flex={1} flexGrow={1} height={400}>
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
                disableColumnFilter
                sx={{ height: 300 }}
              />
            </Box>
          </Box>

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

      <AddProductModal show={show} onClose={handleCloseAdd} onSubmit={handleSubmitAdd} />
    </Paper>
  )
}
