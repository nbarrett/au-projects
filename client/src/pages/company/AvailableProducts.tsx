import * as React from "react";
import { useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { Grid, ListItemAvatar, MenuItem, TextField, Typography } from "@material-ui/core";
import { log } from "../../util/logging-config";
import { productDetails } from '../../mappings/product-mappings';
import useSingleCompany from '../../hooks/use-single-company';
import useSelectedItems from '../../hooks/use-selected-items';
import useProductData from '../../hooks/use-product-data';
import { sortBy } from '../../util/arrays';
import usePricingTierMarkupData from '../../hooks/use-product-markup-data';

export default function AvailableProducts() {
    const company = useSingleCompany();
    const productData = useProductData()
    const selectedItems = useSelectedItems(company.company.data.availableProducts || []);
    const pricingTierMarkupData = usePricingTierMarkupData(true);
    useEffect(() => {
        log.info("itemsSelected:", selectedItems.itemsSelected);
        company.changeField("data.availableProducts", selectedItems.itemsSelected)
    }, [selectedItems.itemsSelected])

    return (
        <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
                <Typography color="textPrimary" gutterBottom>
                    Select items below by checking checkboxes to make products available to {company.company.data.name}.
                </Typography>
                <Typography color="textSecondary" variant="body1">
                    {selectedItems.itemsSelected.length} of {productData.products.length} selected
                </Typography>
            </Grid>
            <Grid item md={6} xs={12}>
                <TextField
                    select
                    fullWidth
                    name="data.pricingTier"
                    label="Pricing Tier"
                    value={company.company?.data?.pricingTier || ""}
                    onChange={company.companyChange}>
                    {pricingTierMarkupData.mutablePricingTiers().sort(sortBy("data.name")).map((option) => (
                        <MenuItem key={option.uid} value={option.uid}>
                            {option.data.name} - {option.data.pricingFactor.toFixed(0)}%
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <List>
                    {productData.products.map((product, i) => (
                        <ListItem divider={i < productData.products.length - 1}
                                  key={product.uid}>
                            <ListItemIcon>
                                <Checkbox
                                    onClick={() => selectedItems.toggleItem(product.uid)}
                                    edge="start"
                                    checked={selectedItems.itemsSelected.includes(product.uid)}
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
