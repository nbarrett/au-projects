import { Helmet } from "react-helmet";
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Pagination,
    RadioGroup,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core";
import { useSetRecoilState } from "recoil";
import * as React from "react";
import { useEffect, useState } from "react";
import { log } from "../../util/logging-config";
import { Product } from "../../models/product-models";
import { fullTextSearch } from "../../util/strings";
import { useNavbarSearch } from "../../use-navbar-search";
import { chunk, range } from "lodash";
import { ToolbarButton } from "../../models/toolbar-models";
import { toolbarButtonState } from "../../atoms/navbar-atoms";
import { WithUid } from "../../models/common-models";
import useProductData from "../../hooks/use-product-data";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import ProductCards from "./ProductCards";
import Radio from "@material-ui/core/Radio";
import ProductsDataGrid from "./ProductsDataGrid";

export default function Products() {
    const setToolbarButtons = useSetRecoilState<ToolbarButton[]>(toolbarButtonState);
    const navbarSearch = useNavbarSearch();
    const productData = useProductData();
    const [filteredProducts, setFilteredProducts] = useState<WithUid<Product>[]>([]);
    const [page, setPage] = useState<number>(1);
    const [viewAs, setViewAs] = useState<string>("table");
    const pageSizes: number[] = [5].concat(range(10, productData.products.length + 10, 10));
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);

    useEffect(() => {
        const filteredProducts = fullTextSearch(productData.products, navbarSearch.search);
        log.debug("filtering:", navbarSearch.search, filteredProducts.length, "of", productData.products.length, "filtered");
        setFilteredProducts(filteredProducts)
        setPage(1);
        const MigrationTasks = [<Button onClick={productData.priceMigration} key={"Migrate products"} sx={{pr: 1}}
                                        size={"small"}
                                        color="secondary"
                                        variant="contained">{"Migrate"}</Button>,
            <Button onClick={productData.backupProducts} key={"Backup products"} sx={{pr: 1}} size={"small"}
                    color="secondary"
                    variant="contained">{"Backup"}</Button>,
            <Button onClick={productData.saveAllProducts} key={"Save products"} sx={{pr: 1}} size={"small"}
                    color="primary"
                    variant="contained">{"Save products"}</Button>];

        setToolbarButtons([
            <Tooltip title={"New Product"}>
                <IconButton key={"new-product"} onClick={() => {
                    productData.add();
                }}>
                    <AddShoppingCartIcon color="secondary" fontSize="large"/>
                </IconButton>
            </Tooltip>,
            "export",
            "import"])
    }, [productData.products, navbarSearch.search])

    useEffect(() => {
        if (filteredProducts) {
            log.debug("pages():", pages(), "currentPage()", currentPage());
        }
    }, [filteredProducts])

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
            <Box sx={{paddingLeft: 0, flexGrow: 1, width: window.innerWidth - 280}}>
                <Grid container sx={{p: 3, pb: 0}}
                      justifyContent="space-between"
                      alignItems="center" spacing={3}>
                    <Grid item xs>
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="position" defaultValue="table" value={viewAs} onChange={(x) => {
                                const newValue = x.target.value;
                                log.debug("x.target.value", x.target.value, "newValue", newValue);
                                setViewAs(newValue)
                            }} name="row-radio-buttons-group">
                                <FormControlLabel value={"table"} control={<Radio/>} label="Display as Table"/>
                                <FormControlLabel value={"cards"} control={<Radio/>} label="Display as Cards"/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    {viewAs === "cards" && <><Grid item xs>
                        <TextField id="items-per-page"
                                   fullWidth
                                   select
                                   size={"small"}
                                   label="products per page"
                                   value={itemsPerPage}
                                   onChange={(event) => {
                                       setItemsPerPage(+event.target.value);
                                       setPage(1)
                                       log.debug("setItemsPerPage:", +event.target.value);
                                   }}
                                   variant="outlined">
                            {pageSizes.map((option, index) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                        <Grid item xs>
                            <Pagination color="primary" count={pages().length} size="small"
                                        onChange={handlePageChange}/>
                        </Grid>
                        <Grid item xs>
                            <Typography>Showing {filteredProducts.length} of {productData.products.length} products</Typography>
                        </Grid></>}
                </Grid>
                <Grid container sx={{p: 3}} spacing={3}>
                    <Grid item xs>
                        {viewAs === "cards" && <ProductCards products={currentPage()}/>}
                        {viewAs === "table" && <ProductsDataGrid products={productData.products}/>}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
