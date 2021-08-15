import * as React from "react";
import { useEffect, useState } from "react";
import {
    DataGrid,
    GridCellParams,
    GridColDef,
    GridEditRowsModel,
    GridToolbar,
    GridToolbarContainer
} from "@material-ui/data-grid";
import useProductData from "../../hooks/use-product-data";
import { GridColumnVisibilityChangeParams, WithUid } from "../../models/common-models";
import { Product, ProductCoding, ProductCodingType } from "../../models/product-models";
import { log } from "../../util/logging-config";
import { IconButton, Select, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import { useSnackbarNotification } from "../../snackbarNotification";
import map from "lodash/map";
import { asCurrency, asPercent, pricePerKgFromRow } from "../../mappings/product-mappings";
import { isNumber } from "lodash";
import { makeStyles } from "@material-ui/styles";
import MenuItem from "@material-ui/core/MenuItem";
import useCompanyData from "../../hooks/use-company-data";
import { companyCodeAndName } from "../../mappings/company-mappings";
import useProductCoding from "../../hooks/use-product-coding";
import useDataGrid from "../../hooks/use-data-grid";
import Loading from "../common/Loading";

export default function ProductsDataGrid(props: { products: WithUid<Product>[] }) {
    const productData = useProductData();
    const companyData = useCompanyData();
    const dataGrid = useDataGrid();
    const productCodings = useProductCoding(false);
    const inputRows = props.products.map(item => dataGrid.toRow<Product>(item));
    const notification = useSnackbarNotification();
    const sortComparator = (v1, v2, cellParams1, cellParams2) => {
        const value1 = productCodings.cellFieldValue(cellParams1.field, cellParams1.value, productColumns);
        const value2 = productCodings.cellFieldValue(cellParams2.field, cellParams2.value, productColumns);
        const sortResult = isNumber(value1) ? value1 - value2 : value1.localeCompare(value2);
        log.debug("value1:", value1, "value2:", value2, "sortResult:", sortResult);
        return sortResult;
    };
    const [productColumns, setProductColumns] = useState<GridColDef[]>([]);
    const initialProductColumns: GridColDef[] = [
        {
            field: "title",
            hide: true,
            editable: true,
            type: "string",
            headerName: "Title",
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "description",
            hide: true,
            editable: true,
            type: "string",
            headerName: "Description",
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "productCode",
            type: "string",
            headerName: "Product Code",
            valueFormatter: productCodings.productCodeFromGrid,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "compoundOwner",
            editable: true,
            type: "string",
            headerName: "Compound Owner",
            renderEditCell: CompoundOwnerSelect,
            renderCell: CompoundOwner,
            sortComparator,
            flex: 2,
            minWidth: 180,
        },
        {
            field: "curingMethod",
            editable: true,
            type: "string",
            headerName: "Curing Method",
            renderEditCell: CuringMethodSelect,
            renderCell: productCodings.ProductCoding,
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "hardness",
            editable: true,
            type: "string",
            headerName: "Hardness",
            renderEditCell: ProductHardnessSelect,
            renderCell: productCodings.ProductCoding,
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "type",
            editable: true,
            type: "string",
            headerName: "Type",
            renderEditCell: ProductCompoundSelect,
            renderCell: productCodings.ProductCoding,
            sortComparator,
            flex: 2,
            minWidth: 180,
        },
        {
            field: "grade",
            editable: true,
            type: "string",
            headerName: "Grade",
            renderEditCell: ProductGradeSelect,
            renderCell: productCodings.ProductCoding,
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "colour",
            editable: true,
            type: "string",
            headerName: "Colour",
            renderEditCell: ProductColourSelect,
            renderCell: productCodings.ProductCoding,
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "specificGravity",
            editable: true,
            type: "number",
            headerName: "Specific Gravity",
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "costPerKg",
            editable: true,
            type: "number",
            headerName: "Cost Per Kg",
            valueFormatter: asCurrency,
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "markup",
            editable: true,
            type: "number",
            headerName: "Product Markup",
            valueFormatter: asPercent,
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "pricePerKg",
            editable: false,
            type: "number",
            headerName: "Price Per Kg",
            valueFormatter: pricePerKgFromRow,
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "media",
            editable: true,
            type: "string",
            headerName: "Media",
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
    ];

    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const styles = makeStyles(
        {
            root: {
                display: "flex",
                alignItems: "center",
                paddingRight: 16,
            },
            tableCell: {
                padding: 15,
                height: window.innerHeight - 200,
                width: "100%",
                backgroundColor: "white"
            },
        }
    );

    const classes = styles(props);

    useEffect(() => {
        setProductColumns(initialProductColumns);
    }, [productCodings.available]);

    function changeField(field: string, value: any, uid: string) {
        log.debug("field", field, "value", value, typeof value, "uid", uid);
        const updatedProduct = productData.findProduct(uid);
        if (updatedProduct) {
            updatedProduct.data[field] = productCodings.cellFieldValue(field, value, productColumns);
            log.debug("updatedProduct:", updatedProduct);
            productData.setSingleProduct(updatedProduct);
        } else {
            notification.error(`Cant update product based with id: ${uid}, ${field}, ${JSON.stringify(value)}`);
        }
    }

    function handleEditRowModelChange(params: GridEditRowsModel) {
        log.debug("handleEditRowModelChange", params)
        map(params, ((editedData, uid) => {
            log.debug("editedData", editedData, "uid", uid)
            map(editedData, ((value, field) => {
                changeField(field, value.value, uid);
            }))
        }))
    }

    function onChange(gridCellParams: GridCellParams, event) {
        const {id, field, api} = gridCellParams;
        log.debug("id:", id, "field:", field, "changed value:", event.target.value);
        api.setEditCellValue({id, field, value: event.target.value}, event);
        api.commitCellChange({id, field});
        api.setCellMode(id, field, "view");
    }

    function CompoundOwnerSelect(props: GridCellParams) {
        const {id, value, field} = props;
        log.debug("CompoundOwnerSelect:", id, field, value);
        return (
            <Select
                fullWidth
                value={productData.findProduct(id).data[field] || ""}
                onChange={(event) => onChange(props, event)}>
                {companyData.documents.filter(item => item.data.code).map((company) => (
                    <MenuItem key={company.uid}
                              value={company.uid}>
                        {companyCodeAndName(company)}
                    </MenuItem>
                ))}
            </Select>
        );
    }

    function ProductCompoundSelect(props: GridCellParams) {
        return <ProductCodeSelect codingsForType={productCodings.productCodingsForType(ProductCodingType.COMPOUND)}
                                  gridCellParams={props}/>
    }

    function ProductColourSelect(props: GridCellParams) {
        return <ProductCodeSelect codingsForType={productCodings.productCodingsForType(ProductCodingType.COLOUR)}
                                  gridCellParams={props}/>
    }

    function ProductHardnessSelect(props: GridCellParams) {
        return <ProductCodeSelect codingsForType={productCodings.productCodingsForType(ProductCodingType.HARDNESS)}
                                  gridCellParams={props}/>
    }

    function ProductGradeSelect(props: GridCellParams) {
        return <ProductCodeSelect codingsForType={productCodings.productCodingsForType(ProductCodingType.GRADE)}
                                  gridCellParams={props}/>
    }

    function CuringMethodSelect(props: GridCellParams) {
        return <ProductCodeSelect codingsForType={productCodings.productCodingsForType(ProductCodingType.CURING_METHOD)}
                                  gridCellParams={props}/>
    }

    function ProductCodeSelect(props: { gridCellParams: GridCellParams, codingsForType: WithUid<ProductCoding>[] }) {
        const {id, value, field} = props.gridCellParams;
        log.debug("ProductCodeSelect:", id, field, value);
        return (
            <Select
                fullWidth
                value={productData.findProduct(id).data[field] || ""}
                onChange={(event) => onChange(props.gridCellParams, event)}>
                {props.codingsForType.map((colour) => (
                    <MenuItem key={colour.uid}
                              value={colour.uid}>
                        {colour.data.name}
                    </MenuItem>
                ))}
            </Select>);
    }

    function CompoundOwner(props: GridCellParams) {
        const {value} = props;
        log.debug("ProductCoding:", value);
        return companyCodeAndName(companyData.companyForUid(value as string));
    }

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <IconButton onClick={() => {
                    notification.warning(`Best we dont do this yet!! (data could get screwed up)`)
                }}>
                    <Tooltip title={`Delete selected products`}>
                        <DeleteIcon color="secondary"/>
                    </Tooltip>
                </IconButton>
                <IconButton onClick={productData.saveAllProducts}>
                    <Tooltip title={`Save all product changes`}>
                        <SaveIcon color="primary"/>
                    </Tooltip>
                </IconButton>
                <IconButton onClick={productData.refresh}>
                    <Tooltip title={`Undo all product changes`}>
                        <UndoIcon color="action"/></Tooltip>
                </IconButton>
                <GridToolbar/>
            </GridToolbarContainer>
        );
    }

    return (
        <Loading text={"loading products"}
                 busy={!productCodings.available}>
            <DataGrid density={"compact"}
                      className={classes.tableCell}
                      components={{Toolbar: CustomToolbar}}
                      pageSize={itemsPerPage}
                      onCellClick={dataGrid.onCellClick}
                      onColumnVisibilityChange={(value: GridColumnVisibilityChangeParams) => {
                          log.debug("onColumnVisibilityChange:value", value.field, value.isVisible);
                      }}
                      onPageSizeChange={(value) => setItemsPerPage(value)}
                      onColumnHeaderOut={(value) => {
                          log.debug("onColumnHeaderOut:value", value);
                      }}
                      rowsPerPageOptions={[5, 10, 15, 20, 15, 30, 50, 60, 80, 100]}
                      pagination
                      disableSelectionOnClick
                      onEditRowsModelChange={handleEditRowModelChange}
                      checkboxSelection
                      rows={inputRows}
                      columns={productColumns}/>
        </Loading>);
}

