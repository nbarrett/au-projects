import * as React from 'react';
import { DataGrid, GridEditCellPropsParams, GridEditRowModelParams, GridToolbar } from '@material-ui/data-grid';
import useProductData from '../../hooks/use-product-data';
import { productColumns } from './ProductsTable';
import { CellFormat, DataColumn, WithUid } from '../../models/common-models';
import { Product } from '../../models/product-models';
import { log } from '../../util/logging-config';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { columnHasNumber } from './ProductComponents';
import { Box, Grid, IconButton, Tooltip, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import { useSnackbarNotification } from '../../snackbarNotification';
import map from 'lodash/map';

export default function BasicEditingGrid(props: { products: WithUid<Product>[] }) {

    const productData = useProductData()
    const inputRows = props.products.map(item => toRow(item));
    const notification = useSnackbarNotification();

    function handleEditRowModelChange(params: GridEditRowModelParams) {
        map(params.model, ((editedData, uid) => {
            map(editedData, ((value, field) => {
                log.debug("field", field, "value", value.value, "uid", uid);
                const updatedProduct = findProduct(uid);
                if (updatedProduct) {
                    updatedProduct.data[field] = cellFieldValue(field, value.value);
                    log.debug("updatedProduct:", updatedProduct);
                    productData.setSingleProduct(updatedProduct)
                } else {
                    notification.error(`Cant update product based with id: ${uid}, ${field}, ${JSON.stringify(value)}`)
                }
            }))
        }))
    }

    function cellFieldValue(field: string, value) {
        log.debug("value:", value)
        return columnHasNumber(productColumns.find(item => item.fieldName.endsWith(field))) ? +value : value
    }

    function findProduct(id) {
        return cloneDeep(productData.products.find(item => item.uid === id));
    }

    function toGridColumn(item: DataColumn) {
        return {
            id: item.fieldName,
            field: item.fieldName.replace("data.", ""),
            headerName: item.label,
            width: 280,
            editable: true,
            type: item.cellFormat === CellFormat.STRING ? "string" : "number"
        };
    }

    function toRow(item: WithUid<Product>) {
        return {id: item.uid, ...item.data};
    }

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item>
                    <Tooltip title={`Delete selected products`}>
                        <IconButton onClick={() => {
                            notification.warning(`Best we dont do this yet!! (data could get screwed up)`)
                        }}>
                            <DeleteIcon color="secondary"/>
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title={`Save all change`}>
                        <IconButton onClick={() => {
                            productData.saveAllProducts();
                        }}>
                            <SaveIcon color="primary"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={`Undo all changes`}>
                        <IconButton onClick={() => {
                            productData.refresh()
                        }}>
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
            <div style={{height: window.innerHeight - 200, width: '100%'}}>
                <DataGrid components={{
                    Toolbar: GridToolbar,
                }}isCellEditable={(params) => true}
                          disableSelectionOnClick
                          onEditRowModelChange={handleEditRowModelChange}
                          checkboxSelection rows={inputRows}
                          columns={productColumns.map(item => toGridColumn(item))}/>
            </div>
        </Box>
    );
}

