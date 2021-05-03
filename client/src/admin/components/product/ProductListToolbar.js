import { Box, Button, Card, CardContent, Grid, InputAdornment, SvgIcon, TextField } from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";

const ProductListToolbar = (props) => (
  <Box {...props}>
    <>
      <Card>
        <CardContent>
          <Grid container alignItems="center">
            <Grid item xs={6} justifyContent="flex-start">
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search product"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} justifyContent="flex-end">
              <Button>Import</Button>
              <Button sx={{ mx: 1 }}>
                Export
              </Button>
              <Button color="primary" variant="contained">
                Add product
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  </Box>
);

export default ProductListToolbar;
