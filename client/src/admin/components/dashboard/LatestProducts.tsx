import {
    Box,
    Button,
    Card,
    CardHeader,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { displayDateAndTime } from "../../../util/dates";
import { useEffect, useState } from "react";
import { Product } from "../../../models/product-models";
import { log } from "../../../util/logging-config";
import { findAll } from "../../../data-services/firebase-services";
import { WithUid } from "../../../models/common-models";

export default function LatestProducts(props) {
    const [products, setProducts] = useState<WithUid<Product>[]>([]);

    useEffect(() => {
        log.debug("LatestProducts initial render");
        queryProducts();
    }, [])

    function queryProducts() {
        findAll<Product>("products").then(setProducts);
    }

    return (
        <Card {...props}>
            <CardHeader
                subtitle={`${products.length} in total`}
                title="Latest Products"/>
            <Divider/>
            <List>
                {products.map((product, i) => (
                    <ListItem divider={i < products.length - 1} key={product.uid}>
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
                            secondary={product.data?.updatedAt && `Updated ${displayDateAndTime(product.data?.updatedAt)}`}
                        />
                        <IconButton edge="end" size="small">
                            <MoreVertIcon/>
                        </IconButton>
                    </ListItem>
                ))}
            </List>
            <Divider/>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 2,
                }}
            >
                <Button
                    color="primary"
                    endIcon={<ArrowRightIcon/>}
                    size="small"
                    variant="text">
                    View all
                </Button>
            </Box>
        </Card>
    )
}
