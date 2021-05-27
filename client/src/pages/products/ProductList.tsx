import { Helmet } from "react-helmet";
import { Box, Button, Container, Grid, MenuItem, Pagination, TextField, Typography } from "@material-ui/core";
import ProductCard from "./ProductCard";
import { useRecoilState, useSetRecoilState } from "recoil";
import * as React from "react";
import { useEffect, useState } from "react";
import { log } from "../../util/logging-config";
import { Product } from "../../models/product-models";
import { fullTextSearch } from "../../util/strings";
import { useNavbarSearch } from "../../use-navbar-search";
import { chunk, range } from "lodash";
import { ToolbarButton } from "../../models/toolbar-models";
import { saveAll, subscribe } from "../../data-services/firebase-services";
import { toolbarButtonState } from "../../atoms/navbar-atoms";
import { WithUid } from "../../models/common-models";
import { productsState } from '../../atoms/product-atoms';

export default function ProductList() {
    const setToolbarButtons = useSetRecoilState<ToolbarButton[]>(toolbarButtonState);
    const navbarSearch = useNavbarSearch();
    const [filteredProducts, setFilteredProducts] = useState<WithUid<Product>[]>([]);
    const [products, setProducts] = useRecoilState<WithUid<Product>[]>(productsState);
    const [page, setPage] = useState<number>(1);
    const pageSizes: number[] = [5].concat(range(10, products.length + 10, 10));
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);

    useEffect(() => {
        log.info("ProductList initial render");
        const unsub = subscribe<Product>("products", setProducts)
        return (() => {
            unsub()
        })
    }, [])

    useEffect(() => {
        const filteredProducts = fullTextSearch(products, navbarSearch.search);
        log.info("filtering:", navbarSearch.search, filteredProducts.length, "of", products.length, "filtered");
        setFilteredProducts(filteredProducts)
        setPage(1);
        setToolbarButtons([
            <Button onClick={saveAllProducts} key={"Save products"} sx={{mx: 1}} color="primary"
                    variant="contained">{"Save products"}</Button>,
            "add product",
            "export",
            "import"])
    }, [products, navbarSearch.search])

    useEffect(() => {
        if (filteredProducts) {
            log.info("pages():", pages(), "currentPage()", currentPage());
        }
    }, [filteredProducts])

    function saveAllProducts() {
        saveAll<Product>("products", products).then((response) => {
            log.info("response was:", response)
        });
    }

    function pages(): WithUid<Product>[][] {
        return chunk(filteredProducts, itemsPerPage);
    }

    function currentPage(): WithUid<Product>[] {
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
                        <Typography>Showing {filteredProducts.length} of {products.length} products</Typography>
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
                            {pageSizes.map((option, index) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box sx={{pt: 3}}>
                        <Grid container spacing={3}>
                            {currentPage().map((product) => (
                                <Grid item key={product?.uid || product?.data?.title} lg={4} md={6} xs={12}>
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
