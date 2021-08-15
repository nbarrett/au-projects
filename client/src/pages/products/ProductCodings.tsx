import { Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { log } from "../../util/logging-config";
import { WithUid } from "../../models/common-models";
import { ProductCoding, productCodingColumns, ProductCodingType } from "../../models/product-models";
import AddchartIcon from "@material-ui/icons/Addchart";
import { Helmet } from "react-helmet";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import { useSnackbarNotification } from "../../snackbarNotification";
import {
    DataGrid,
    GridEditRowsModel,
    GridSelectionModel,
    GridToolbar,
    GridToolbarContainer
} from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/styles";
import map from "lodash/map";
import cloneDeep from "lodash/cloneDeep";
import { sortBy } from "../../util/arrays";
import DeleteIcon from "@material-ui/icons/Delete";
import useProductCoding from "../../hooks/use-product-coding";
import { pluraliseWithCount, titleCase } from "../../util/strings";
import { contentContainer } from "../../admin/components/GlobalStyles";
import useDataGrid from "../../hooks/use-data-grid";

export function ProductCodings(props: { productCodingType: ProductCodingType }) {
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const notification = useSnackbarNotification();
    const productCoding = useProductCoding();
    const dataGrid = useDataGrid();
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

    const styles = makeStyles(
        {
            root: {
                display: "flex",
                alignItems: "center",
                paddingRight: 16,
            },
            title: {
                fontWeight: "bold",
            },
            tableCell: {
                padding: 15,
                height: window.innerHeight - 200,
                backgroundColor: "white"
            },
        }
    );

    const classes = styles();

    useEffect(() => {
        log.debug("ProductCodings:initial render")
    }, []);

    useEffect(() => {
        log.debug("selectionModel:", selectionModel)
    }, [selectionModel]);

    function markForDelete(uid: string) {
        productCoding.setDocuments(productCoding.documents.map(coding => coding.uid === uid ? {
            ...coding,
            markedForDelete: true
        } : coding));
    }

    function addDocument(index: number) {
        const defaultValue: WithUid<ProductCoding> = {
            data: {
                productCodingType: props.productCodingType,
                code: "",
                name: ""
            }, uid: ""
        };
        productCoding.setDocuments([
            ...productCoding.documents.slice(0, index),
            defaultValue,
            ...productCoding.documents.slice(index)
        ]);
    }

    const saveOptions = <>
            <IconButton onClick={() => addDocument(0)}>
                <Tooltip title={`New ${props.productCodingType}`}>
                    <AddchartIcon color="action"/>
                </Tooltip>
            </IconButton>
        <IconButton onClick={() => {
            productCoding.saveAllProductCodings().then(() => notification.success(`Saved ${productCoding.documents.length} product codes of type ${props.productCodingType}`));
        }}>
            <Tooltip title={`Save all changes`}>
                <SaveIcon color="primary"/>
            </Tooltip>
        </IconButton>
        <IconButton
            onClick={() => productCoding.refresh().then(() => notification.success(`Any changes were reverted`))}>
            <Tooltip title={`Undo all changes`}>
                <UndoIcon color="action"/>
            </Tooltip>
        </IconButton>
        <IconButton disabled={selectionModel.length === 0}
                    onClick={() => Promise.resolve(selectionModel.forEach(markForDelete)).then(() => notification.success(`${pluraliseWithCount(selectionModel.length, "product code")} were marked for delete. The next save will permanently delete them`))}>
            <Tooltip title={`Mark ${selectionModel.length} items for delete`}><DeleteIcon
                color={selectionModel.length === 0 ? "disabled" : "secondary"}/></Tooltip>
        </IconButton>
        </>
    ;

    function CustomToolbar() {
        return (<> <Typography color="textSecondary" variant="h4">Product Codes - {titleCase(props.productCodingType)}</Typography>
                <GridToolbarContainer>
                    {saveOptions}
                    <GridToolbar/>
                </GridToolbarContainer></>
        );
    }

    function changeField(field: string, value: any, uid: string) {
        log.debug("field", field, "value", value, typeof value, "uid", uid);
        const updatedProduct = productCoding.productCodingForUid(uid);
        if (updatedProduct) {
            updatedProduct.data[field] = value;
            log.debug("updatedProduct:", updatedProduct);
            productCoding.setDocument(updatedProduct);
        } else {
            notification.error(`Cant update product curingMethod with id: ${uid}, ${field}, ${JSON.stringify(value)}`);
        }
    }

    function handleEditRowModelChange(params: GridEditRowsModel) {
        log.debug("handleEditRowModelChange", params);
        map(params, ((editedData, uid) => {
            log.debug("editedData", editedData, "uid", uid);
            map(editedData, ((value, field) => {
                changeField(field, value.value, uid);
            }));
        }));
    }

    return <>
        <Helmet>
            <title>Product Coding - {props.productCodingType} | AU Projects</title>
        </Helmet>
        <Grid sx={contentContainer} container spacing={3}>
            <Grid item xs={12}>
                <DataGrid density={"compact"}
                          className={classes.tableCell}
                          components={{Toolbar: CustomToolbar}}
                          pageSize={itemsPerPage}
                          onCellClick={dataGrid.onCellClick}
                          onSelectionModelChange={(newSelectionModel) => {
                              setSelectionModel(newSelectionModel);
                          }}
                          selectionModel={selectionModel}

                          onPageSizeChange={setItemsPerPage}
                          rowsPerPageOptions={[20]}
                          pagination
                          disableSelectionOnClick
                          onEditRowsModelChange={handleEditRowModelChange}
                          checkboxSelection
                          rows={cloneDeep(productCoding.documents)
                              .filter((item: WithUid<ProductCoding>) => item?.data?.productCodingType === props.productCodingType)
                              .filter((item: WithUid<ProductCoding>) => !item.markedForDelete)
                              .sort(sortBy("code"))
                              .map(item => dataGrid.toRow<ProductCoding>(item))}
                          columns={productCodingColumns}/>
            </Grid>
        </Grid>
    </>

}