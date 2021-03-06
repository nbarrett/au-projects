import * as React from "react";
import { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridEditRowsModel,
    GridRenderCellParams,
    GridSelectionModel,
    GridToolbar,
    GridToolbarContainer
} from "@mui/x-data-grid";
import useProducts from "../../hooks/use-products";
import { GridColumnVisibilityChangeParams, WithUid } from "../../models/common-models";
import { Product, ProductCoding, ProductCodingType } from "../../models/product-models";
import { log } from "../../util/logging-config";
import { IconButton, Select, Tooltip } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import map from "lodash/map";
import { asCurrencyFromGrid, asPercent, pricePerKgFromGrid } from "../../mappings/product-mappings";
import { isNumber } from "lodash";
import { makeStyles } from "@mui/styles";
import MenuItem from "@mui/material/MenuItem";
import useCompanyData from "../../hooks/use-company-data";
import { companyCodeAndName } from "../../mappings/company-mappings";
import useProductCoding from "../../hooks/use-product-coding";
import useDataGrid from "../../hooks/use-data-grid";
import Loading from "../common/Loading";
import DeleteManyIcon from "../common/DeleteManyIcon";
import AddchartIcon from "@mui/icons-material/Addchart";
import { useLocation, useNavigate } from "react-router-dom";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { AppRoute, FULL_SCREEN } from "../../models/route-models";
import useSnackbar from "../../hooks/use-snackbar";
import { useUpdateUrl } from "../../hooks/use-url-updating";
import { toAppRoute, toFullScreenRoute } from "../../mappings/route-mappings";

export default function ProductsDataGrid() {
    const products = useProducts();
    const location = useLocation();
    const companyData = useCompanyData();
    const dataGrid = useDataGrid();
    const updateUrl = useUpdateUrl();
    const productCodings = useProductCoding(false);
    const inputRows = products.documents.filter(item => !item.markedForDelete).map(item => dataGrid.toRow<Product>(item));
    const snackbar = useSnackbar();
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
    const sortComparator = (v1, v2, cellParams1, cellParams2) => {
        const value1 = productCodings.cellFieldValue(cellParams1.field, cellParams1.value, productColumns);
        const value2 = productCodings.cellFieldValue(cellParams2.field, cellParams2.value, productColumns);
        const sortResult = isNumber(value1) ? value1 - value2 : value1.localeCompare(value2);
        log.debug("value1:", value1, "value2:", value2, "sortResult:", sortResult);
        return sortResult;
    };
    const stringSortComparator = (v1, v2, cellParams1, cellParams2) => {
        const value1: any = cellParams1.value + "";
        const value2: any = cellParams2.field + "";
        const sortResult = value1.localeCompare(value2);
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
            sortComparator: stringSortComparator,
            renderCell: productCodings.productCodeFromGrid,
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
            field: "compound",
            editable: true,
            type: "string",
            headerName: "Compound",
            renderEditCell: ProductCompoundSelect,
            renderCell: productCodings.ProductCoding,
            sortComparator,
            flex: 2,
            minWidth: 180,
        },
        {
            field: "type",
            editable: true,
            type: "string",
            headerName: "Type",
            renderEditCell: ProductTypeSelect,
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
            flex: 2,
            minWidth: 180,
        },
        {
            field: "costPerKg",
            editable: true,
            type: "number",
            headerName: "Cost Per Kg",
            renderCell: asCurrencyFromGrid,
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "markup",
            editable: true,
            type: "number",
            headerName: "Product Markup",
            renderCell: asPercent,
            sortComparator,
            flex: 1,
            minWidth: 180,
        },
        {
            field: "pricePerKg",
            editable: false,
            type: "number",
            headerName: "Price Per Kg",
            renderCell: pricePerKgFromGrid,
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
    const containerHeight = location.pathname.includes(FULL_SCREEN) ? 0 : 200;
    const classes = makeStyles(
        {
            tableCell: {
                padding: 15,
                height: window.innerHeight - containerHeight,
                width: "100%",
                backgroundColor: "white"
            },
        }
    )();

    useEffect(() => {
        setProductColumns(initialProductColumns);
    }, [productCodings.available]);

    useEffect(() => {
        log.debug("selectionModel:", selectionModel);
    }, [selectionModel]);

    useEffect(() => {
        log.debug("products.documents:", products.documents);
    }, [products.documents]);

    function changeField(field: string, value: any, uid: string) {
        log.debug("field", field, "value", value, typeof value, "uid", uid);
        const updatedProduct = products.findProduct(uid);
        if (updatedProduct) {
            updatedProduct.data[field] = productCodings.cellFieldValue(field, value, productColumns);
            log.debug("updatedProduct:", updatedProduct);
            products.setDocument(updatedProduct);
        } else {
            snackbar.error(`Cant update product with id: ${uid}, ${field}, ${JSON.stringify(value)}`);
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

    function onChange(gridCellParams: GridRenderCellParams, event) {
        const {id, field, api} = gridCellParams;
        log.debug("id:", id, "field:", field, "changed value:", event.target.value);
        api.setEditCellValue({id, field, value: event.target.value}, event);
        api.commitCellChange({id, field});
        api.setCellMode(id, field, "view");
    }

    function CompoundOwnerSelect(props: GridRenderCellParams) {
        const {id, value, field} = props;
        log.debug("CompoundOwnerSelect:", id, field, value);
        return (
            <Select
                fullWidth
                value={products.findProduct(id)?.data[field] || ""}
                onChange={(event) => onChange(props, event)}>
                {companyData.documents.filter(item => item.data.compoundOwner).map((company) => (
                    <MenuItem key={company.uid}
                              value={company.uid}>
                        {companyCodeAndName(company)}
                    </MenuItem>
                ))}
            </Select>
        );
    }

    function ProductTypeSelect(props: GridRenderCellParams) {
        return <ProductCodeSelect codingsForType={productCodings.productCodingsForType(ProductCodingType.TYPE)}
                                  gridCellParams={props}/>;
    }

    function ProductCompoundSelect(props: GridRenderCellParams) {
        return <ProductCodeSelect codingsForType={productCodings.productCodingsForType(ProductCodingType.COMPOUND)}
                                  gridCellParams={props}/>;
    }

    function ProductColourSelect(props: GridRenderCellParams) {
        return <ProductCodeSelect codingsForType={productCodings.productCodingsForType(ProductCodingType.COLOUR)}
                                  gridCellParams={props}/>;
    }

    function ProductHardnessSelect(props: GridRenderCellParams) {
        return <ProductCodeSelect codingsForType={productCodings.productCodingsForType(ProductCodingType.HARDNESS)}
                                  gridCellParams={props}/>;
    }

    function ProductGradeSelect(props: GridRenderCellParams) {
        return <ProductCodeSelect codingsForType={productCodings.productCodingsForType(ProductCodingType.GRADE)}
                                  gridCellParams={props}/>;
    }

    function CuringMethodSelect(props: GridRenderCellParams) {
        return <ProductCodeSelect codingsForType={productCodings.productCodingsForType(ProductCodingType.CURING_METHOD)}
                                  gridCellParams={props}/>;
    }

    function ProductCodeSelect(props: { gridCellParams: GridRenderCellParams, codingsForType: WithUid<ProductCoding>[] }) {
        const {id, value, field} = props.gridCellParams;
        log.debug("ProductCodeSelect:", id, field, value);
        return (
            <Select
                fullWidth
                value={products.findProduct(id)?.data[field] || ""}
                onChange={(event) => onChange(props.gridCellParams, event)}>
                {props.codingsForType.map((colour) => (
                    <MenuItem key={colour.uid}
                              value={colour.uid}>
                        {colour.data.name}
                    </MenuItem>
                ))}
            </Select>);
    }

    function CompoundOwner(props: GridRenderCellParams) {
        const {value} = props;
        log.debug("ProductCoding:", value);
        return companyCodeAndName(companyData.companyForUid(value as string));
    }

    function markForDelete() {
        log.debug("marking", selectionModel, "for delete");
        products.setDocuments(products.documents.map(product => selectionModel.includes(product.uid) ? {
            ...product,
            markedForDelete: true
        } : product));
    }

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <IconButton onClick={() => products.add(0)}>
                    <Tooltip title={`New Product`}>
                        <AddchartIcon color="action"/>
                    </Tooltip>
                </IconButton>
                <IconButton onClick={products.saveAllProducts}>
                    <Tooltip title={`Save all product changes`}>
                        <SaveIcon color="primary"/>
                    </Tooltip>
                </IconButton>
                <DeleteManyIcon singular={"product"} selectionModel={selectionModel} markForDelete={markForDelete}/>
                <IconButton onClick={products.refresh}>
                    <Tooltip title={`Undo all product changes`}>
                        <UndoIcon color="action"/></Tooltip>
                </IconButton>
                <GridToolbar/>
                {location.pathname.includes(FULL_SCREEN) && <IconButton onClick={() => {
                    updateUrl({path: toAppRoute(AppRoute.PRODUCTS)});
                }}>
                    <Tooltip title={`Exit full screen`}>
                        <FullscreenExitIcon color="secondary"/></Tooltip>
                </IconButton>}
                {!location.pathname.includes(FULL_SCREEN) && <IconButton onClick={() => {
                    updateUrl({path: toFullScreenRoute(AppRoute.PRODUCTS)});
                }}>
                    <Tooltip title={`View full screen`}>
                        <FullscreenIcon color="secondary"/></Tooltip>
                </IconButton>}
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
                      onSelectionModelChange={(newSelectionModel) => {
                          setSelectionModel(newSelectionModel);
                      }}
                      selectionModel={selectionModel}
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

