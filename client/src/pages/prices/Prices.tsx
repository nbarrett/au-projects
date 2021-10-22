import * as React from "react";
import { useState } from "react";
import { Grid, } from "@mui/material";
import { Product } from "../../models/product-models";
import { isNumber } from "lodash";
import { log } from "../../util/logging-config";
import { useNavbarSearch } from "../../hooks/use-navbar-search";
import useSingleCompany from "../../hooks/use-single-company";
import { asCurrencyFromGrid, asPercent, pricePerKgFromGrid } from "../../mappings/product-mappings";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useProductCoding from "../../hooks/use-product-coding";
import { CustomToolbar } from "./CustomToolbar";
import { contentContainer } from "../../admin/components/GlobalStyles";
import useDataGrid from "../../hooks/use-data-grid";
import usePricedProducts from "../../hooks/use-priced-products";
import { makeStyles } from "@mui/styles";

export default function Prices() {
  const dataGrid = useDataGrid();
  const navbarSearch = useNavbarSearch();
  const company = useSingleCompany();
  const pricedProducts = usePricedProducts(company.document, navbarSearch.search);
  const productCodings = useProductCoding(false);

  const styles = makeStyles(
      {
        root: {
          display: "flex",
          alignItems: "center",
          paddingRight: 16,
        },
        tableCell: {
          padding: 15,
          height: window.innerHeight - 100,
          width: "100%",
          backgroundColor: "white"
        },
      }
  );

  const classes = styles();
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const sortComparator = (v1, v2, cellParams1, cellParams2) => {
    const value1 = productCodings.cellFieldValue(cellParams1.field, cellParams1.value, productColumns);
    const value2 = productCodings.cellFieldValue(cellParams2.field, cellParams2.value, productColumns);
    const sortResult = isNumber(value1) ? value1 - value2 : value1.localeCompare(value2);
    log.debug("value1:", value1, "value2:", value2, "sortResult:", sortResult);
    return sortResult;
  };

  const minWidth = 190;
  const productColumns: GridColDef[] = [
    {
      field: "productCode",
      type: "string",
      headerName: "Product Code",
      renderCell: productCodings.productCodeFromGrid,
      flex: 1,
      minWidth,
    },
    {
      field: "description",
      type: "string",
      headerName: "Product Description",
      renderCell: productCodings.productDescriptionGrid,
      sortComparator,
      flex: 2,
      minWidth,
    },
    {
      field: "specificGravity",
      type: "number",
      headerName: "Specific Gravity",
      sortComparator,
      flex: 1,
      minWidth,
    },
    {
      field: "costPerKg",
      type: "number",
      headerName: "Cost Per Kg",
      renderCell: asCurrencyFromGrid,
      sortComparator,
      flex: 1,
      minWidth,
    },
    {
      field: "salePricePerKg",
      type: "number",
      headerName: "Sale Price Per Kg",
      renderCell: asCurrencyFromGrid,
      sortComparator,
      flex: 1,
      minWidth,
    },
    {
      field: "pricePerKg",
      hide: true,
      type: "number",
      headerName: "Price Per Kg",
      renderCell: pricePerKgFromGrid,
      sortComparator,
      flex: 1,
      minWidth,
    },
    {
      field: "markup",
      hide: true,
      headerName: "Product Markup",
      renderCell: asPercent,
      sortComparator,
      flex: 1,
      minWidth,
    },
    {
      field: "pricingTierName",
      type: "string",
      hide: true,
      headerName: "Pricing Tier",
      sortComparator,
      flex: 2,
      minWidth,
    },
    {
      field: "pricingFactor",
      type: "number",
      hide: true,
      headerName: "Pricing Factor",
      renderCell: asPercent,
      sortComparator,
      flex: 2,
      minWidth,
    }
  ];

  return (
      <Grid sx={contentContainer} container spacing={1}>
        <Grid item xs={12}>
          <DataGrid density={"compact"}
                    className={classes.tableCell}
                    components={{Toolbar: CustomToolbar}}
                    pageSize={itemsPerPage}
                    onPageSizeChange={(value) => setItemsPerPage(value)}
                    rowsPerPageOptions={[5, 10, 15, 20, 15, 30, 50, 60, 80, 100]}
                    pagination
                    disableSelectionOnClick
                    checkboxSelection
                    rows={pricedProducts.documents().map(item => dataGrid.toRow<Product>(item))}
                    columns={productColumns}/>
          </Grid>
        </Grid>
  );
}
