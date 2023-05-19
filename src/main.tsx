import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { router } from '@/routers';
import { SnackbarProvider } from 'notistack';
import { ConfirmProvider } from "material-ui-confirm";
import '@/assets/scss/index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfirmProvider defaultOptions={{
    dialogProps: {
      maxWidth: 'xs'
    }
  }}>
    <SnackbarProvider anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }} autoHideDuration={3000} />
    <RouterProvider router={router} />
  </ConfirmProvider>
)
