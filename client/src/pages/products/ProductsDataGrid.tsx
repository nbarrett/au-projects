import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridEditRowModelParams, GridPageChangeParams, GridToolbar } from '@material-ui/data-grid';
import useProductData from '../../hooks/use-product-data';
import { CellComponent, CellFormat, DataColumn, WithUid } from '../../models/common-models';
import { Product } from '../../models/product-models';
import { log } from '../../util/logging-config';
import cloneDeep from 'lodash/cloneDeep';
import { Box, Grid, IconButton, Tooltip, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import { useSnackbarNotification } from '../../snackbarNotification';
import map from 'lodash/map';
import { asCurrency, asPercent, pricePerKgFromRow } from '../../mappings/product-mappings';
import { first, isNumber, isUndefined, last } from 'lodash';

export const productColumns: readonly DataColumn[] = [
    {
        fieldName: "data.title",
        editable: true,
        cellFormat: CellFormat.STRING,
        component: CellComponent.TEXTFIELD,
        disablePadding: true,
        noWrap: true,
        label: "Title",
    },
    {
        fieldName: "data.description",
        editable: true,
        cellFormat: CellFormat.STRING,
        component: CellComponent.TEXTFIELD,
        disablePadding: true,
        noWrap: true,
        label: "Description",
    },
    {
        fieldName: "data.specificGravity",
        editable: true,
        cellFormat: CellFormat.NUMERIC,
        component: CellComponent.AUTOCOMPLETE,
        disablePadding: true,
        noWrap: true,
        label: "Specific Gravity",
    },
    {
        fieldName: "data.costPerKg",
        editable: true,
        cellFormat: CellFormat.CURRENCY,
        component: CellComponent.TEXTFIELD,
        disablePadding: false,
        noWrap: true,
        label: "Cost Per Kg",
        valueGetter: asCurrency,
    },
    {
        fieldName: "data.markup",
        editable: true,
        cellFormat: CellFormat.PERCENT,
        component: CellComponent.AUTOCOMPLETE,
        disablePadding: false,
        noWrap: true,
        label: "Product Markup",
        valueGetter: asPercent,
    },
    {
        fieldName: "data.pricePerKg",
        editable: false,
        cellFormat: CellFormat.CURRENCY,
        component: CellComponent.TEXTFIELD,
        disablePadding: false,
        noWrap: true,
        label: "Price Per Kg",
        valueGetter: pricePerKgFromRow,
    },
    {
        fieldName: "data.type",
        editable: true,
        cellFormat: CellFormat.STRING,
        component: CellComponent.AUTOCOMPLETE,
        disablePadding: false,
        noWrap: true,
        label: "Type",
    },
    {
        fieldName: "data.colour",
        editable: true,
        cellFormat: CellFormat.STRING,
        component: CellComponent.AUTOCOMPLETE,
        disablePadding: false,
        noWrap: true,
        label: "Colour",
    },
    {
        fieldName: "data.grade",
        editable: true,
        cellFormat: CellFormat.STRING,
        component: CellComponent.AUTOCOMPLETE,
        disablePadding: false,
        noWrap: true,
        label: "Grade",
    },
    {
        fieldName: "data.hardness",
        editable: true,
        cellFormat: CellFormat.STRING,
        component: CellComponent.AUTOCOMPLETE,
        disablePadding: false,
        noWrap: true,
        label: "Hardness",
    },
    {
        fieldName: "data.curingMethod",
        editable: true,
        cellFormat: CellFormat.STRING,
        component: CellComponent.AUTOCOMPLETE,
        disablePadding: false,
        noWrap: true,
        label: "Curing Method",
    },
    {
        fieldName: "data.media",
        editable: true,
        cellFormat: CellFormat.STRING,
        component: CellComponent.TEXTFIELD,
        disablePadding: false,
        noWrap: true,
        label: "Media",
    },
];

export default function ProductsDataGrid(props: { products: WithUid<Product>[] }) {
    const productData = useProductData()
    const inputRows = props.products.map(item => toRow(item));
    const notification = useSnackbarNotification();
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);

    function handleEditRowModelChange(params: GridEditRowModelParams) {
        map(params.model, ((editedData, uid) => {
            map(editedData, ((value, field) => {

                log.debug("field", field, "value", value.value, typeof value.value, "uid", uid);
                const updatedProduct = findProduct(uid);
                if (updatedProduct) {
                    const editedValue = cellFieldValue(field, value.value);
                    updatedProduct.data[field] = editedValue;
                    value.value = editedValue;
                    log.debug("updatedProduct:", updatedProduct);
                    productData.setSingleProduct(updatedProduct)
                } else {
                    notification.error(`Cant update product based with id: ${uid}, ${field}, ${JSON.stringify(value)}`)
                }
            }))
        }))
    }

    function cellFieldValue(field: string, value) {
        log.debug("cellFieldValue:value", value, typeof value)
        const dataColumn: DataColumn = productColumns.find(item => item.fieldName.endsWith(field));
        let cleanedValue;
        if (isUndefined(value)) {
            log.debug("cellFieldValue:cleanedValue:", cleanedValue, "field:", field);
            cleanedValue = "";
        } else if (isNumber(value)) {
            cleanedValue = value;
        } else {
            const values = value?.toString()?.split(" ");
            if (dataColumn.cellFormat === CellFormat.CURRENCY) {
                cleanedValue = +last(values)
            } else if (dataColumn.cellFormat === CellFormat.PERCENT) {
                cleanedValue = +first(values)
            } else {
                cleanedValue = values.join(" ");
            }
            log.debug("cellFieldValue:values:", values, "cleanedValue:", cleanedValue, "dataColumn:", dataColumn);
        }

        return cleanedValue
    }

    function findProduct(id) {
        return cloneDeep(productData.products.find(item => item.uid === id));
    }

    function toGridColumn(item: DataColumn) {
        return {
            id: item.fieldName,
            field: item.fieldName.replace("data.", ""),
            headerName: item.label,
            width: 180,
            editable: item.editable,
            noWrap: true,
            type: item.cellFormat === CellFormat.STRING ? "string" : "number",
            valueGetter: item.valueGetter,
            sortComparator: (v1, v2, cellParams1, cellParams2) => {
                const value1 = cellFieldValue(cellParams1.field, cellParams1.value);
                const value2 = cellFieldValue(cellParams2.field, cellParams2.value);
                const sortResult = isNumber(value1) ? value1 - value2 : value1.localeCompare(value2);
                log.debug("value1:", value1, "value2:", value2, "sortResult:", sortResult);
                return sortResult;
            },
        };
    }

    function toRow(item: WithUid<Product>) {
        return {id: item.uid, ...item.data};
    }

    function handlePageSizeChange(value: GridPageChangeParams) {
        setItemsPerPage(value.pageSize)
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
                    <Tooltip title={`Save all product changes`}>
                        <IconButton onClick={() => {
                            productData.saveAllProducts();
                        }}>
                            <SaveIcon color="primary"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={`Undo all product changes`}>
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
            <div style={{height: window.innerHeight - 250, width: '100%'}}>
                <DataGrid components={{
                    Toolbar: GridToolbar,
                }} pageSize={itemsPerPage}
                          onPageSizeChange={(value) => handlePageSizeChange(value)}
                          rowsPerPageOptions={[5, 10, 15, 20, 15, 30, 50, 60, 80, 100]}
                          pagination
                          disableSelectionOnClick
                          onEditRowModelChange={handleEditRowModelChange}
                          checkboxSelection rows={inputRows}
                          columns={productColumns.map(item => toGridColumn(item))}/>
            </div>
        </Box>
    );
}

