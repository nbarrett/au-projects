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
import useProductEditing from "../../hooks/use-product-editing";
import { remove, save } from "../../data-services/firebase-services";
import { WithUid } from "../../models/common-models";
import DeleteIcon from "@material-ui/icons/Delete";
import { DataBoundAutoComplete } from "../../components/DataBoundAutoComplete";
import { pricePerKg } from "../../mappings/product-mappings";
import useUniqueValues from "../../hooks/use-unique-values";

export default function ProductCardEdit(props: { product: WithUid<Product>, rest?: any[] }) {
    const editing = useProductEditing();
    const uniqueValues = useUniqueValues(editing.products);
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
                            onChange={editing.productChange}
                            value={editing.product?.data.title || ""}
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
                            onChange={editing.productChange}
                            value={editing.product?.data.description || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.specificGravity"} label={"Specific Gravity"}
                                                        type={"number"} options={uniqueValues.field("specificGravity")}
                                                        document={editing.product}
                                                        onChange={editing.changeField}/>
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
                            onChange={editing.numericProductChange}
                            value={editing.product?.data.costPerKg || ""}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.markup"} label={"Markup"}
                                                        type={"number"} options={uniqueValues.field("markup")}
                                                        document={editing.product}
                                                        onChange={editing.changeField} inputProps={{
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
                            value={pricePerKg(editing.product)}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.type"} label={"Type"}
                                                        type={"text"} options={uniqueValues.field("type")}
                                                        document={editing.product}
                                                        onChange={editing.changeField}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.colour"} label={"Colour"}
                                                        type={"text"} options={uniqueValues.field("colour")}
                                                        document={editing.product}
                                                        onChange={editing.changeField}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.grade"} label={"Grade"}
                                                        type={"text"} options={uniqueValues.field("grade")}
                                                        document={editing.product}
                                                        onChange={editing.changeField}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.hardness"} label={"Hardness"}
                                                        type={"text"} options={uniqueValues.field("hardness")}
                                                        document={editing.product}
                                                        onChange={editing.changeField}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <DataBoundAutoComplete<Product> field={"data.curingMethod"} label={"Curing Method"}
                                                        type={"text"} options={uniqueValues.field("curingMethod")}
                                                        document={editing.product}
                                                        onChange={editing.changeField}/>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            label="Media"
                            name="data.media"
                            onChange={editing.productChange}
                            value={editing.product?.data?.media || ""}
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
                        <Tooltip title={`Delete ${editing.product?.data?.title}`}>
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
                        <Tooltip title={`Save ${editing.product?.data?.title}`}>
                            <IconButton onClick={() => {
                                save<Product>("products", editing.product)
                                    .then(() => editing.toggleProductEdit(props.product.uid || ""));
                            }}>
                                <SaveIcon color="primary"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={`Undo changes to ${editing.product?.data?.title}`}>
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
