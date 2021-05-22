import { Helmet } from "react-helmet";
import { Box, Container, Grid, MenuItem, Pagination, TextField, Typography } from "@material-ui/core";
import ProductCard from "./ProductCard";
import { useSetRecoilState } from "recoil";
import { toolbarButtonState } from "../../../atoms/dashboard-atoms";
import { useEffect, useState } from "react";
import { log } from "../../../util/logging-config";
import { PRODUCTS } from "../../__mocks__/products";
import { Product } from "../../../models/product-models";
import { fullTextSearch } from "../../../util/strings";
import { useNavbarSearch } from "../../../use-navbar-search";
import { chunk } from "lodash";

export default function ProductList() {
    const setButtonCaptions = useSetRecoilState<string[]>(toolbarButtonState);
    const navbarSearch = useNavbarSearch();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [page, setPage] = useState<number>(1);
    const pageSizes: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100];
    const [itemsPerPage, setItemsPerPage] = useState<number>(15);
    useEffect(() => {
        log.info("ProductList initial render");
        setButtonCaptions(["add product", "export", "import"])
    }, [])

    useEffect(() => {
        const products = fullTextSearch(PRODUCTS, navbarSearch.search);
        log.info("filtering:", navbarSearch.search, products.length, "of", PRODUCTS.length, "filtered");
        setFilteredProducts(products)
        setPage(1);
    }, [navbarSearch.search])

    useEffect(() => {
        if (filteredProducts) {
            log.info("pages():", pages(), "currentPage()", currentPage());
        }
    }, [filteredProducts])

    function pages(): Product[][] {
        return chunk(filteredProducts, itemsPerPage);
    }

    function currentPage(): Product[] {
        return pages()[page - 1] || [];
    }

    function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
        log.info("handlePageChange:", value);
        setPage(value);
    }

    return (
        <>
            <Helmet>
                <title>AU Products</title>
            </Helmet>
            <Box sx={{backgroundColor: "background.default", minHeight: "100%", py: 3}}>
                <Container maxWidth={false}>
                    <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", pt: 3}}>
                        <Typography>Showing {filteredProducts.length} of {PRODUCTS.length} products</Typography>
                        <Pagination color="primary" count={pages().length} size="small" onChange={handlePageChange}/>
                        <TextField sx={{width: 150, marginRight: 2}} id="items-per-page"
                                   select
                                   size={"small"}
                                   label="products per page"
                                   value={itemsPerPage}
                                   onChange={(event) => {
                                       setItemsPerPage(+event.target.value);
                                       setPage(1)
                                       log.info("setItemsPerPage:", +event.target.value);
                                   }}
                                   variant="outlined">
                            {pageSizes.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box sx={{pt: 3}}>
                        <Grid container spacing={3}>
                            {currentPage().map((product) => (
                                <Grid item key={product.id || product.title} lg={4} md={6} xs={12}>
                                    <ProductCard product={product}/>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
