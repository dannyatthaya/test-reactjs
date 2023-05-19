import { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef, GridPaginationModel, GridRowId, GridRowParams } from '@mui/x-data-grid';
import api from '@/apis'
import { Box, Button, Paper, Typography } from '@mui/material';
import { Delete, Add, Refresh, Edit, Visibility } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { Axios } from '@/types/axios';

export default () => {
  const navigate = useNavigate()
  const confirm = useConfirm()

  const [rows, setRows] = useState<App.Model.Order[]>([])
  const [loading, setLoading] = useState(false)
  const [rowCount, setRowCount] = useState(0)
  const formatter = Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  })

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'KODE PENJUALAN', flex: 1, sortable: false },
    { field: 'createdAt', headerName: 'TANGGAL', flex: 1, sortable: false },
    {
      field: 'customer', headerName: 'PELANGGAN', flex: 1, sortable: false, valueGetter(params) {
        return (params.value as App.Model.Customer).name
      }
    },
    {
      field: 'subtotal', headerName: 'SUBTOTAL', flex: 1, sortable: false, valueFormatter(params) {
        return formatter.format(params.value)
      }
    },
    {
      field: 'actions',
      headerName: 'AKSI',
      type: 'actions',
      flex: 1,
      sortable: false,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem icon={<Visibility />} onClick={() => handleRead(params.id)} label="Read" />,
        <GridActionsCellItem icon={<Edit />} onClick={() => handleEdit(params.id)} label="Edit" />,
        <GridActionsCellItem icon={<Delete />} onClick={() => handleDelete(params.id)} label="Delete" />,
      ]
    }
  ];

  const handleDelete = async (id: string | number | GridRowId) => {
    try {
      setLoading(true)

      await confirm({
        title: 'Confirmation',
        description: 'Are you sure want to delete this row? this action cannot be undo!',
        confirmationText: 'Delete',
        cancellationText: 'Cancel',
      })

      await api.order.destroy(id)

      enqueueSnackbar("Data deleted successfully", { variant: 'success' })

      onFetch()
    } catch (error) {
      if (typeof error === 'string') {
        enqueueSnackbar(error, { variant: 'error' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string | number | GridRowId) => {
    navigate(`${id}/edit`)
  }

  const handleRead = (id: string | number | GridRowId) => {
    navigate(`${id}/read`)
  }

  const onFetch = async (model?: GridPaginationModel) => {
    try {
      setLoading(true)
      let params: Axios.PaginationParams = {}

      if (model) {
        params.page = model.page + 1
      }

      const { data, meta } = await api.order.index(params)

      setRows(data!)
      setRowCount(meta!.total)
    } catch (error) {
      if (typeof error === 'string') {
        enqueueSnackbar(error, { variant: 'error' })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    onFetch()
    return () => { };
  }, []);

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }} variant='outlined'>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box>
          <Typography variant='h6'>
            List of Orders
          </Typography>
        </Box>

        <Box>
          <Button
            startIcon={<Refresh />}
            variant='outlined'
            disableElevation
            color='primary'
            sx={{ mr: 1 }}
            onClick={() => onFetch()}
          >
            Reload
          </Button>

          <NavLink to={'create'}>
            <Button startIcon={<Add />} variant='outlined' disableElevation color='primary'>
              Add
            </Button>
          </NavLink>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, mt: 1, maxHeight: 'calc(100vh - 191px)' }}>
        <DataGrid
          rows={rows}
          loading={loading}
          columns={columns}
          rowCount={rowCount}
          columnHeaderHeight={42}
          paginationMode='server'
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[25]}
          disableColumnFilter
          onPaginationModelChange={onFetch}
        />
      </Box>
    </Paper>
  )
}
