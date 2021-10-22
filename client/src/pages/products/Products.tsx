import { Helmet } from "react-helmet";
import { Button, Grid } from "@mui/material";
import * as React from "react";
import { useEffect } from "react";
import { log } from "../../util/logging-config";
import { fullTextSearch } from "../../util/strings";
import { useNavbarSearch } from "../../hooks/use-navbar-search";
import useProducts from "../../hooks/use-products";
import { contentContainer } from "../../admin/components/GlobalStyles";
import ProductsDataGrid from "./ProductsDataGrid";
import { makeStyles } from "@mui/styles";

export default function Products() {
    const navbarSearch = useNavbarSearch();
    const products = useProducts();
    const classes = makeStyles(
        {
            root: {
                height: window.innerHeight - 200
            },
        }
    )();

    useEffect(() => {
        const filteredProducts = fullTextSearch(products.documents, navbarSearch.search);
        log.debug("filtering:", navbarSearch.search, filteredProducts.length, "of", products.documents.length, "filtered");
        const MigrationTasks = [<Button onClick={products.priceMigration} key={"Migrate documents"} sx={{pr: 1}}
                                        size={"small"}
                                        color="secondary"
                                        variant="contained">{"Migrate"}</Button>,
            <Button onClick={products.backupProducts} key={"Backup documents"} sx={{pr: 1}} size={"small"}
                    color="secondary"
                    variant="contained">{"Backup"}</Button>,
            <Button onClick={products.saveAllProducts} key={"Save documents"} sx={{pr: 1}} size={"small"}
                    color="primary"
                    variant="contained">{"Save documents"}</Button>];

    }, [products.documents, navbarSearch.search])

    return (
        <>
            <Helmet>
                <title>Products | AU Projects</title>
            </Helmet>
            <Grid className={classes.root} sx={contentContainer} container spacing={3}>
                <Grid item xs={12}>
                    <ProductsDataGrid/>
                </Grid>
            </Grid>
        </>);
}
