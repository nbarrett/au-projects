import { Helmet } from "react-helmet";
import { Box, Container, Grid, Pagination } from "@material-ui/core";
import ProductCard from "./ProductCard";
import { useSetRecoilState } from 'recoil';
import { toolbarButtonState } from '../../../atoms/dashboard-atoms';
import { useEffect } from 'react';
import { log } from '../../../util/logging-config';
import { PRODUCTS } from '../../__mocks__/products';

export default function ProductList() {
    const setButtonCaptions = useSetRecoilState<string[]>(toolbarButtonState);
    useEffect(() => {
        log.info("CustomerListResults triggered");
        setButtonCaptions(["add product", "export", "import"])
    },[])

    return (
        <>
            <Helmet>
                <title>AU Products</title>
            </Helmet>
            <Box
                sx={{backgroundColor: "background.default", minHeight: "100%", py: 3}}
            >
                <Container maxWidth={false}>
                    <Box sx={{pt: 3}}>
                        <Grid container spacing={3}>
                            {PRODUCTS.map((product) => (
                                <Grid item key={product.id} lg={4} md={6} xs={12}>
                                    <ProductCard product={product}/>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Box sx={{display: "flex", justifyContent: "center", pt: 3}}>
                        <Pagination color="primary" count={3} size="small"/>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
