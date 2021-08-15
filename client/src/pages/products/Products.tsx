import { Helmet } from "react-helmet";
import {
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Pagination,
    RadioGroup,
    TextField
} from "@material-ui/core";
import * as React from "react";
import { useEffect, useState } from "react";
import { log } from "../../util/logging-config";
import { Product } from "../../models/product-models";
import { fullTextSearch } from "../../util/strings";
import { useNavbarSearch } from "../../use-navbar-search";
import { chunk, range } from "lodash";
import { WithUid } from "../../models/common-models";
import useProducts from "../../hooks/use-products";
import Radio from "@material-ui/core/Radio";
import { contentContainer } from "../../admin/components/GlobalStyles";
import ProductCards from "./ProductCards";
import ProductsDataGrid from "./ProductsDataGrid";
import Typography from "@material-ui/core/Typography";
import { AppRoute, FULL_SCREEN } from "../../constants";
import { useNavigate } from "react-router-dom";

export default function Products() {
    const navigate = useNavigate();
    const navbarSearch = useNavbarSearch();
    const products = useProducts();
    const [filteredProducts, setFilteredProducts] = useState<WithUid<Product>[]>([]);
    const [page, setPage] = useState<number>(1);
    const [viewAs, setViewAs] = useState<string>("table");
    const pageSizes: number[] = [5].concat(range(10, products.documents.length + 10, 10));
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);

    useEffect(() => {
        const filteredProducts = fullTextSearch(products.documents, navbarSearch.search);
        log.debug("filtering:", navbarSearch.search, filteredProducts.length, "of", products.documents.length, "filtered");
        setFilteredProducts(filteredProducts);
        setPage(1);
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

    useEffect(() => {
        if (filteredProducts) {
            log.debug("pages():", pages(), "currentPage()", currentPage());
        }
    }, [filteredProducts]);

    useEffect(() => {
        if (viewAs === "full-screen") {
            navigate(`/${FULL_SCREEN}/${AppRoute.PRODUCTS}`);
        }
    }, [viewAs]);

    function pages(): WithUid<Product>[][] {
        return chunk(filteredProducts, itemsPerPage);
    }

    function currentPage(): WithUid<Product>[] {
        return pages()[page - 1] || [];
    }

    function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
        log.debug("handlePageChange:", value);
        setPage(value);
    }

    return (
        <>
            <Helmet>
                <title>Products | AU Projects</title>
            </Helmet>
            <Grid sx={contentContainer} container spacing={3}>
                <Grid item xs={5}>
                    <FormControl component="fieldset">
                        <RadioGroup row aria-label="position" defaultValue="table" value={viewAs} onChange={(x) => {
                            const newValue = x.target.value;
                            log.debug("x.target.value", x.target.value, "newValue", newValue);
                            setViewAs(newValue);
                        }} name="row-radio-buttons-group">
                            <FormControlLabel value={"table"} control={<Radio/>} label="Display as Table"/>
                            <FormControlLabel value={"cards"} control={<Radio/>} label="Display as Cards"/>
                            <FormControlLabel value={"full-screen"} control={<Radio/>} label="Display Full Screen"/>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                {viewAs === "cards" &&
                <Grid item xs>
                    <TextField id="items-per-page"
                               fullWidth
                               select
                               size={"small"}
                               label="products per page"
                               value={itemsPerPage}
                               onChange={(event) => {
                                   setItemsPerPage(+event.target.value);
                                   setPage(1);
                                   log.debug("setItemsPerPage:", +event.target.value);
                               }}
                               variant="outlined">
                        {pageSizes.map((option, index) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>}
                {viewAs === "cards" && <Grid item xs>
                    <Pagination color="primary" count={pages().length} size="small"
                                onChange={handlePageChange}/>
                </Grid>}
                {viewAs === "cards" && <Grid item xs>
                    <Typography>Showing {filteredProducts.length} of {products.documents.length} documents</Typography>
                </Grid>}
                <Grid item xs={12}>
                    {viewAs === "cards" && <ProductCards products={currentPage()}/>}
                    {viewAs === "table" && <ProductsDataGrid/>}
                </Grid>
            </Grid>
        </>);
}
