import * as React from "react";
import { useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { Grid, ListItemAvatar, Typography } from "@material-ui/core";
import { WithUid } from "../../models/common-models";
import { Product } from "../../models/product-models";
import { log } from "../../util/logging-config";
import { findAll } from "../../data-services/firebase-services";
import { productDetails } from '../../mappings/product-mappings';
import useSingleCompany from '../../hooks/use-single-company';

export default function AvailableProducts() {
    const [products, setProducts] = useState<WithUid<Product>[]>([]);
    const company = useSingleCompany();
    const [checked, setChecked] = useState<string[]>(company.company.data.availableProducts || []);

    function toggleProductAvailability(value: string) {
        if (checked.includes(value)) {
            log.info("removing value:", value);
            const newChecked = checked.filter(item => item !== value);
            setChecked(newChecked);
        } else {
            log.info("adding value:", value);
            const newChecked = checked.concat(value);
            setChecked(newChecked);
        }
    }

    useEffect(() => {
        log.info("AvailableProducts initial render:", company.company);
        queryProducts();
    }, [])

    useEffect(() => {
        log.info("checked products:", checked);
        company.changeField("data.availableProducts", checked)
    }, [checked])

    function queryProducts() {
        findAll<Product>("products").then(setProducts);
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography color="textPrimary" gutterBottom>
                    Select items below by checking checkboxes to make products available to {company.company.data.name}.
                </Typography>
                <Typography color="textSecondary" variant="body1">
                    {checked.length} of {products.length} selected
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <List>
                    {products.map((product, i) => (
                        <ListItem divider={i < products.length - 1}
                                  key={product.uid}>
                            <ListItemIcon>
                                <Checkbox
                                    onClick={() => toggleProductAvailability(product.uid)}
                                    edge="start"
                                    checked={checked.includes(product.uid)}
                                    tabIndex={-1}/>
                            </ListItemIcon>
                            <ListItemAvatar>
                                {product.data.media && <img alt={product.data.title}
                                                            src={product.data.media}
                                                            style={{
                                                                height: 48,
                                                                width: 48,
                                                            }}
                                />}
                            </ListItemAvatar>
                            <ListItemText
                                primary={product.data.title}
                                secondary={productDetails(product)}
                            />
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
    );
}
