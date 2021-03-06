import { WithUid } from "../../models/common-models";
import { Product } from "../../models/product-models";
import Box from "@mui/material/Box";
import { Avatar } from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";

export function TitledMedia(props: { product?: WithUid<Product>, hideTitle?:boolean }) {
    return <Box sx={{
        alignItems: "center",
        display: "flex",
    }}>
        <Avatar sizes={"sm"} src={props.product.data.media} sx={{mr: 2}}/>
        {props.hideTitle? null: <Typography noWrap color="textPrimary" variant="body1">
            {props.product.data.title}
        </Typography>}
    </Box>;
}

