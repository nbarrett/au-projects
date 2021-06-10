import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    TextareaAutosize,
    TextField,
    Tooltip,
    Typography,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import { Product } from "../../models/product-models";
import * as React from "react";
import { useEffect, useState } from "react";
import { log } from "../../util/logging-config";
import useProductEditing from "../../hooks/use-product-editing";
import { remove, save } from "../../data-services/firebase-services";
import { WithUid } from "../../models/common-models";
import DeleteIcon from "@material-ui/icons/Delete";
import { useRecoilValue } from "recoil";
import { productsState } from "../../atoms/product-atoms";
import { cloneDeep, set } from "lodash";
import { DataBoundAutoComplete } from "../../components/DataBoundAutoComplete";
import { productMarkup } from '../../mappings/product-mappings';

export default function ProductCardEdit(props: { product: WithUid<Product>, rest?: any[] }) {
    const [product, setProduct] = useState<WithUid<Product>>(props.product);
    const products = useRecoilValue<WithUid<Product>[]>(productsState);
    const editing = useProductEditing();

    function changeField(field: string, value: any, numeric: boolean) {
        log.info("productChange:" + product.data.title, "field:", field, "value:", value, "typeof:", typeof value);
        const mutableProduct: WithUid<Product> = cloneDeep(product);
        set(mutableProduct, field, numeric ? +value : value)
        setProduct(mutableProduct);
    }

    function productChange(event: any) {
        const field = event.target.name || event.target.id;
        const value = event.target.value;
        changeField(field, value, false);
    }

    function numericProductChange(event: any) {
        const field = event.target.name || event.target.id;
        log.info("numericProductChange:field:", field);
        const value = event.target.value;
        changeField(field, value, true);
    }

    useEffect(() => {
        log.info("changed product:", product);
    }, [product])

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
            {...props.rest}>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="data.title"
                            onChange={productChange}
                            value={product?.data.title || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            InputProps={{
                                inputComponent: TextareaAutosize,
                                rows: 3
                            }}
                            fullWidth
                            label="Description"
                            name="data.description"
                            onChange={productChange}
                            value={product?.data.description || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.specificGravity"} label={"Specific Gravity"}
                                                        type={"number"} allDocuments={products} document={product}
                                                        onChange={changeField}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R</InputAdornment>,
                            }}
                            fullWidth
                            label="Cost Per KG"
                            name="data.costPerKg"
                            type="number"
                            onChange={numericProductChange}
                            value={product?.data.costPerKg || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.markup"} label={"Markup"}
                                                        type={"number"} allDocuments={products} document={product}
                                                        onChange={changeField} inputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R</InputAdornment>,
                            }}
                            fullWidth
                            disabled
                            label="Price Per KG"
                            name="data.pricePerKg"
                            type="number"
                            value={productMarkup(product)}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.type"} label={"Type"}
                                                        type={"text"} allDocuments={products} document={product}
                                                        onChange={changeField}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.colour"} label={"Colour"}
                                                        type={"text"} allDocuments={products} document={product}
                                                        onChange={changeField}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.grade"} label={"Grade"}
                                                        type={"text"} allDocuments={products} document={product}
                                                        onChange={changeField}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.hardness"} label={"Hardness"}
                                                        type={"text"} allDocuments={products} document={product}
                                                        onChange={changeField}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.curingMethod"} label={"Curing Method"}
                                                        type={"text"} allDocuments={products} document={product}
                                                        onChange={changeField}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            label="Media"
                            name="data.media"
                            onChange={productChange}
                            value={product?.data?.media || ""}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Box sx={{flexGrow: 1}}/>
            <Divider/>
            <Box sx={{p: 2}}>
                <Grid container spacing={2} sx={{justifyContent: "space-between"}}>
                    <Grid item sx={{alignItems: "center", display: "flex"}}>
                        <Tooltip title={`Delete ${product?.data?.title}`}>
                            <IconButton onClick={() => {
                                remove<Product>("products", props.product.uid).then(() => editing.toggleProductEdit(props.product.uid || ""));
                            }}>
                                <DeleteIcon color="secondary"/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item sx={{
                        alignItems: "center",
                        display: "flex",
                    }}>
                        <Tooltip title={`Save ${product?.data?.title}`}>
                            <IconButton onClick={() => {
                                save<Product>("products", product)
                                    .then(() => editing.toggleProductEdit(props.product.uid || ""));
                            }}>
                                <SaveIcon color="primary"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={`Undo changes to ${product?.data?.title}`}>
                            <IconButton onClick={() => editing.toggleProductEdit(props.product.uid || "")}>
                                <UndoIcon
                                    color="action"/>
                            </IconButton>
                        </Tooltip>
                        <Typography
                            color="textSecondary"
                            display="inline"
                            sx={{pl: 1}}
                            variant="body2"
                        >
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
}
