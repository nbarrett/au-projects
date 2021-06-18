import { Grid, } from "@material-ui/core";
import { Product } from "../../models/product-models";
import * as React from "react";
import { WithUid } from "../../models/common-models";
import ProductCard from './ProductCard';

export default function ProductCards(props: { products: WithUid<Product>[] }) {
    return <Grid container spacing={3}>
        {props.products.map((product, index) => (
            <Grid item key={product?.uid || product?.data?.title || `new-document-${index}`} lg={4}
                  md={6} xs={12}>
                <ProductCard product={product}/>
            </Grid>
        ))}
    </Grid>;
}
