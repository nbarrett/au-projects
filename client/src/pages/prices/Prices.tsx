import * as React from "react";
import { useEffect, useState } from "react";
import { Grid, } from "@material-ui/core";
import useProductData from "../../hooks/use-product-data";
import { WithUid } from "../../models/common-models";
import { PricedProduct, PricingTier } from "../../models/product-models";
import { isNumber } from "lodash";
import { log } from "../../util/logging-config";
import { fullTextSearch } from "../../util/strings";
import { useNavbarSearch } from "../../use-navbar-search";
import useSingleCompany from "../../hooks/use-single-company";
import usePricingTierMarkupData from "../../hooks/use-product-markup-data";
import { asCurrency, asPercent, pricePerKgFromRow, toPricedProduct, toRow } from "../../mappings/product-mappings";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/styles";
import useProductCoding from "../../hooks/use-product-coding";
import Box from "@material-ui/core/Box";
import { CustomToolbar } from "./CustomToolbar";

export default function Prices() {
  const navbarSearch = useNavbarSearch();
  const singleCompany = useSingleCompany();
  const productData = useProductData()
  const productCodings = useProductCoding(false);
  const pricingTierMarkupData = usePricingTierMarkupData(true);
  const currentCompany = singleCompany.company
  const [filteredProducts, setFilteredProducts] = useState<WithUid<PricedProduct>[]>([]);
  const [companyPricingTier, setCompanyPricingTier] = useState<PricingTier>();

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
      valueFormatter: productCodings.productCodeFromGrid,
      flex: 1,
      minWidth,
    },
    {
      field: "description",
      type: "string",
      headerName: "Product Description",
      valueFormatter: productCodings.productDescriptionGrid,
      sortComparator,
      flex: 4,
      minWidth,
    },
    {
      field: "costPerKg",
      type: "number",
      headerName: "Cost Per Kg",
      valueFormatter: asCurrency,
      sortComparator,
      flex: 1,
      minWidth,
    },
    {
      field: "markup",
      headerName: "Product Markup",
      valueFormatter: asPercent,
      sortComparator,
      flex: 1,
      minWidth,
    },
    {
      field: "pricePerKg",
      type: "number",
      headerName: "Price Per Kg",
      valueFormatter: pricePerKgFromRow,
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
      headerName: "Pricing Factor",
      valueFormatter: asPercent,
      sortComparator,
      flex: 2,
      minWidth,
    },
    {
      field: "salePricePerKg",
      type: "number",
      headerName: "Sale Price Per Kg",
      valueFormatter: asCurrency,
      sortComparator,
      flex: 1,
      minWidth,
    },
    {
      field: "specificGravity",
      type: "string",
      headerName: "Specific Gravity",
      sortComparator,
      flex: 1,
      minWidth,
    }
  ];

  function applyFilteredProducts(): WithUid<PricedProduct>[] {
    const filteredProducts = fullTextSearch(productData.products, navbarSearch.search).filter(item => currentCompany?.data?.availableProducts?.includes(item.uid));
    const pricedProducts: WithUid<PricedProduct>[] = filteredProducts.map(product => toPricedProduct(product, companyPricingTier));
    log.debug("filtering:", navbarSearch.search, "availableProducts:", currentCompany?.data?.availableProducts, filteredProducts.length, "of", productData.products.length, "pricedProducts:", pricedProducts);
    return pricedProducts;
  }

  useEffect(() => {
    setFilteredProducts(applyFilteredProducts())
  }, [productData.products, navbarSearch.search, currentCompany, companyPricingTier])

  useEffect(() => {
    const pricingTier = pricingTierMarkupData.pricingTierForIUid(singleCompany.company.data.pricingTier);
    log.debug("company:", currentCompany, "has pricing tier:", pricingTier);
    setCompanyPricingTier(pricingTier);
  }, [currentCompany, pricingTierMarkupData.pricingTiers])

  return (
      <Box sx={{marginTop: 2, paddingLeft: 0, flexGrow: 1, width: window.innerWidth - 280}}>
        <Grid container spacing={2}>
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
                      rows={filteredProducts.map(item => toRow(item))}
                      columns={productColumns}/>
          </Grid>
        </Grid>
      </Box>
  );
}
