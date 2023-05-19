import api from '@/apis'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, debounce } from "@mui/material";
import parse from 'autosuggest-highlight/parse';
import { useEffect, useMemo, useState } from "react";
import { AutocompleteElement, FormContainer, TextFieldElement } from 'react-hook-form-mui';

interface ProductModalProps {
  show: boolean;
  onClose: any | undefined,
  onSubmit: any | undefined,
}

export default (props: ProductModalProps) => {
  const [inputValue, setInputValue] = useState('');
  const [products, setProducts] = useState<App.Model.Product[]>([])
  const [product, setProduct] = useState<App.Model.Product | null>(null)

  const fetch = useMemo(
    () => debounce(
      async (request: { search: string }, callback: (results?: App.Model.Product[]) => void) => {
        const { data } = await api.product.index(request)

        callback(data)
      }, 300,
    ), [],
  );

  const onClear = () => {
    setInputValue('')
    setProduct(null)
    setProducts([])
  }

  useEffect(() => {
    onClear()
  }, [])

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setProducts(product ? [product] : []);
      return undefined;
    }

    fetch({ search: inputValue }, (results?: App.Model.Product[]) => {
      if (active) {
        let newProducts: App.Model.Product[] = [];

        if (product) {
          newProducts = [product];
        }

        if (results) {
          newProducts = [...newProducts, ...results];
        }

        setProducts(newProducts);
      }
    });

    return () => {
      active = false;
    };
  }, [product, inputValue, fetch]);

  const onFormSubmit = (data: App.Model.OrderProduct) => {
    props.onSubmit({
      ...data,
      id: data.product.id
    })

    onDialogClose()
  }

  const onDialogClose = () => {
    props.onClose()

    onClear()
  }

  return (
    <Dialog
      open={props.show}
      onClose={onDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={'sm'}
      fullWidth
    >
      <FormContainer
        onSuccess={onFormSubmit}
        FormProps={{
          'aria-autocomplete': 'none',
          autoComplete: 'off',
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Add Product
        </DialogTitle>

        <DialogContent>
          <Box
            display={'flex'}
            flexDirection={'column'}
            height={'100%'}
            gap={4}
          >
            <AutocompleteElement
              label="Produk"
              options={products}
              name="product"
              required
              textFieldProps={{
                variant: 'filled',
              }}
              autocompleteProps={{
                filterOptions: (x) => x,
                autoComplete: true,
                includeInputInList: true,
                filterSelectedOptions: true,
                value: product,
                noOptionsText: "No products",
                getOptionLabel: (option: App.Model.Product) => option.displayName,
                onChange: (_: any, newValue: App.Model.Product | null) => {
                  setProducts(newValue ? [newValue, ...products] : products);
                  setProduct(newValue);
                },
                onInputChange: (_, newInputValue) => {
                  setInputValue(newInputValue);
                },
                renderOption: (props, option: App.Model.Product) => {
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

            <TextFieldElement
              label="Quantity"
              variant="filled"
              name="quantity"
              type="number"
              required
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onDialogClose}>Cancel</Button>
          <Button type='submit' autoFocus>
            Add
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog >
  )
}