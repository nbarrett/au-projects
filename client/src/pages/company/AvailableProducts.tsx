import * as React from "react";
import { useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { Grid, ListItemAvatar, MenuItem, TextField, Typography } from "@mui/material";
import { log } from "../../util/logging-config";
import useSingleCompany from "../../hooks/use-single-company";
import useSelectedItems from "../../hooks/use-selected-items";
import useProducts from "../../hooks/use-products";
import { sortBy } from "../../util/arrays";
import usePricingTierMarkupData from "../../hooks/use-product-markup-data";
import useProductCoding from "../../hooks/use-product-coding";

export default function AvailableProducts() {
    const company = useSingleCompany();
    const products = useProducts();
    const productCoding = useProductCoding();
    const selectedItems = useSelectedItems(company.document.data.availableProducts || []);
    const pricingTierMarkupData = usePricingTierMarkupData(true);
    const validProductIds = products.documents.map(item => item.uid);

    useEffect(() => {
        const validAvailableProducts = selectedItems.itemsSelected.filter(item => validProductIds.includes(item));
        if (validProductIds.length > 0) {
            log.debug("itemsSelected:", selectedItems.itemsSelected, "validProductIds:", validProductIds, "validAvailableProducts:", validAvailableProducts);
            company.changeField("data.availableProducts", validAvailableProducts);
        }
    }, [selectedItems.itemsSelected]);

    return (
        <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
                <TextField
                    select
                    fullWidth
                    name="data.pricingTier"
                    label="Pricing Tier"
                    value={company.document?.data?.pricingTier || ""}
                    onChange={company.companyChange}>
                    {pricingTierMarkupData.mutablePricingTiers().sort(sortBy("data.name")).map((option) => (
                        <MenuItem key={option.uid} value={option.uid}>
                            {option.data.name} - {option.data.pricingFactor.toFixed(0)}%
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item md={6} xs={12}>
                <Typography color="textPrimary" gutterBottom>
                    Select items below by checking checkboxes to make products available to {company.document.data.name}.
                </Typography>
                <Typography color="textSecondary" variant="body1">
                    {selectedItems.itemsSelected.length} of {products.documents.length} selected
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <List>
                    {products.documents.map((product, i) => (
                        <ListItem divider={i < products.documents.length - 1}
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
                                primary={productCoding.productCode(product.data)}
                                secondary={productCoding.productDescription(product.data)}
                            />
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
    );
}
