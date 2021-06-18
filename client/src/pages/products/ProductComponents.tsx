import { CellFormat, DataColumn, WithUid } from '../../models/common-models';
import { Product } from '../../models/product-models';
import Box from '@material-ui/core/Box';
import { Avatar } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

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

export function columnHasNumber(headCell: DataColumn) {
    return [CellFormat.NUMERIC, CellFormat.CURRENCY, CellFormat.PERCENT].includes(headCell.cellFormat);
}

export function toAlignment(headCell: DataColumn) {
    return columnHasNumber(headCell) ? "right" : "left";
}
