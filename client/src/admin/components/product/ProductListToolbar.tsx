import { Box, Button, Card, CardContent, Grid, InputAdornment, SvgIcon, TextField } from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";

export default function ProductListToolbar(props: any) {
    return (
        <Box {...props}>
            <>
                <Card>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xl={6} xs={6}>
                                <TextField
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SvgIcon
                                                    fontSize="small"
                                                    color="action"
                                                >
                                                    <SearchIcon/>
                                                </SvgIcon>
                                            </InputAdornment>
                                        )
                                    }}
                                    placeholder="Search product"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xl={6} xs={6}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs>
                                        <Button variant="contained">Import</Button>
                                    </Grid>
                                    <Grid item xs>
                                        <Button variant="contained">
                                            Export
                                        </Button>
                                    </Grid>
                                    <Grid item xs>
                                        <Button color="primary" variant="contained">
                                            Add product
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </>
        </Box>
    );
}
