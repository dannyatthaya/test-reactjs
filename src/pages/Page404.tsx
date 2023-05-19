import { NavLink, useRouteError } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <Box id="error-page" sx={{ width: "100%", textAlign: "center" }}>
      <Typography variant="h1">Oops!</Typography>

      <Typography variant="body1" sx={{ my: "1rem" }}>
        Sorry, an unexpected error has occurred. <br />
        The page that you are looking is no found anymore.
      </Typography>

      <NavLink to={'/dashboard/metric'}>
        <Button color="primary">
          <i>Go Back</i>
        </Button>
      </NavLink>
    </Box>
  );
}
