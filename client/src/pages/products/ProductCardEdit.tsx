import {
    Autocomplete,
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton, InputAdornment,
    TextareaAutosize,
    TextField,
    Tooltip,
    Typography,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import { Product } from "../../models/product-models";
import * as React from "react";
import { useState } from "react";
import { log } from "../../util/logging-config";
import useProductEditing from "../../hooks/use-product-editing";
import { remove, save } from "../../data-services/firebase-services";
import { WithUid } from "../../models/common-models";
import DeleteIcon from "@material-ui/icons/Delete";
import { useRecoilValue } from 'recoil';
import { productsState } from '../../atoms/product-atoms';
import { uniq } from "lodash";

export default function ProductCardEdit(props: { product: WithUid<Product>, rest?: any[] }) {
    const [product, setProduct] = useState<Product>(props.product.data);
    const products = useRecoilValue<WithUid<Product>[]>(productsState);
    const editing = useProductEditing();

    function changeField(field: string, value: any) {
        log.info("productChange:" + product.title, "field:", field, "value:", value, "typeof:", typeof value);
        setProduct({
            ...product,
            [field]: value,
        });
    }

    function productChange(event?: any) {
        const field = event.target.name || event.target.id;
        const value = event.target.value;
        changeField(field, value);
    }

    function uniqueValuesFor(field: string): string[] {
        return uniq(products.map((option) => {
            return option.data[field];
        }).filter(item => item)).sort();
    }

    function DataBoundAutoComplete(props: { field: string, label: string, type: string }) {
        const value = product[props.field]?.toString() || "";
        return <Autocomplete
            id={props.field}
            freeSolo
            disableClearable
            value={value}
            getOptionLabel={item => item?.toString()}
            onChange={(event, value) => changeField(props.field, value)}
            options={uniqueValuesFor(props.field)}
            renderInput={(params) =>
                <TextField  {...params}
                            fullWidth
                            type={props.type}
                            onChange={productChange}
                            value={value}
                            name={props.field}
                            label={props.label}
                            variant="outlined"/>}
        />;
    }

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
                        <Typography align="center" color="textPrimary" gutterBottom variant="h4">
                            Editing: {product.title}
                        </Typography></Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            helperText="Please specify the title"
                            label="Title"
                            name="title"
                            onChange={productChange}
                            value={product?.title || ""}
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
                            name="description"
                            onChange={productChange}
                            value={product?.description || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete field={"specificGravity"} label={"Specific Gravity"} type={"number"}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R</InputAdornment>,
                            }}
                            fullWidth
                            label="Price"
                            name="price"
                            type="number"
                            onChange={productChange}
                            value={product?.price || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete field={"type"} label={"Type"} type={"text"}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete field={"colour"} label={"Colour"} type={"text"}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete field={"grade"} label={"Grade"} type={"text"}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete field={"hardness"} label={"Hardness"} type={"text"}/>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <TextField
                            fullWidth
                            label="Media"
                            name="media"
                            onChange={productChange}
                            value={product?.media || ""}
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
                    </Grid>
                    <Grid item sx={{
                        alignItems: "center",
                        display: "flex",
                    }}>
                        <Tooltip title={`Save ${product?.title}`}>
                            <IconButton onClick={() => {
                                save<Product>("products", {
                                    uid: props.product.uid,
                                    data: product
                                }).then(() => editing.toggleProductEdit(props.product.uid || ""));
                            }}>
                                <SaveIcon color="primary"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={`Delete ${product?.title}`}>
                            <IconButton onClick={() => {
                                remove<Product>("products", props.product.uid).then(() => editing.toggleProductEdit(props.product.uid || ""));
                            }}>
                                <DeleteIcon color="secondary"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={`Undo changes to ${product?.title}`}>
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
