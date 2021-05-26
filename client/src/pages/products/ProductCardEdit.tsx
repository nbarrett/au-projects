import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton,
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
import { save } from "../../data-services/firebase-services";
import { WithUid } from "../../models/common-models";

export default function ProductCardEdit(props: { product: WithUid<Product>, rest?: any[] }) {
    const [product, setProduct] = useState<Product>(props.product.data);
    const editing = useProductEditing();

    function productChange(event?: any) {
        const field = event.target.name;
        const value = event.target.value;
        log.info("productChange:" + product.title, "field:", field, "value:", value);
        setProduct({
            ...product,
            [field]: value,
        });
    }

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
            {...props.rest}        >
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
                        <TextField
                            fullWidth
                            label="Specific Gravity"
                            name="specificGravity"
                            onChange={productChange}
                            type={"number"}
                            value={product?.specificGravity || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            label="Type"
                            name="type"
                            onChange={productChange}
                            value={product?.type || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            label="Colour"
                            name="colour"
                            onChange={productChange}
                            value={product?.colour || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            label="Media"
                            name="media"
                            onChange={productChange}
                            value={product?.media || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            label="Grade"
                            name="grade"
                            onChange={productChange}
                            value={product?.grade || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            label="Hardness"
                            name="hardness"
                            onChange={productChange}
                            value={product?.hardness || ""}
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
                                <SaveIcon color="action"/>
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
