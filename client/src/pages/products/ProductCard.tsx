import { Avatar, Box, Card, CardContent, Divider, Grid, IconButton, Tooltip, Typography, } from "@material-ui/core";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import EditIcon from "@material-ui/icons/Edit";
import { Product } from "../../models/product-models";
import * as React from "react";
import { timeAgo } from "../../util/dates";
import ProductCardEdit from "./ProductCardEdit";
import useProductEditing from "../../hooks/use-product-editing";
import { WithUid } from "../../models/common-models";

export default function ProductCard(props: { product: WithUid<Product>, rest?: any[] }) {
    const editing = useProductEditing();

    return (
        editing.editEnabled(props.product.uid || "")
            ? <ProductCardEdit product={props.product}/>
            : <Card
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
                {...props.rest}
            >

                <CardContent>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        pb: 3
                    }}>
                        <Avatar alt="Product" src={props.product.data.media} variant="square"/>
                    </Box>
                    <Typography align="center" color="textPrimary" gutterBottom variant="h4">
                        {props.product.data.title}
                    </Typography>
                    <Typography align="center" color="textPrimary" variant="body1">
                        SG: {props.product.data.specificGravity}
                        Price: R{props.product.data.price}
                    </Typography>
                </CardContent>
                <Box sx={{flexGrow: 1}}/>
                <Divider/>
                <Box sx={{p: 2}}>
                    <Grid container
                          justifyContent="space-between"
                          alignItems="center">
                        <Grid item sx={{alignItems: "center", display: "flex"}}>
                            <AccessTimeIcon color="action"/>
                            {props.product.data.updatedAt && <Typography color="textSecondary"
                                                                         display="inline"
                                                                         sx={{pl: 1}}
                                                                         variant="body2">Updated {timeAgo(props.product.data.updatedAt)}
                            </Typography>}
                        </Grid>
                        <Grid item sx={{alignItems: "center", display: "flex"}}>
                            <Tooltip title={`Edit ${props.product.data.title}`}>
                                <IconButton onClick={() => editing.toggleProductEdit(props.product.uid || "")}>
                                    <EditIcon
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
