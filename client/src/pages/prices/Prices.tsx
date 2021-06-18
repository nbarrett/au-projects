import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { SortDirection } from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { visuallyHidden } from "@material-ui/utils";
import { Card, Grid, TablePagination, } from "@material-ui/core";
import { companyId } from "../../mappings/company-mappings";
import useProductData from "../../hooks/use-product-data";
import useSelectedItems from "../../hooks/use-selected-items";
import { CellFormat, DataColumn, WithUid } from "../../models/common-models";
import { PricedProduct, PricingTier } from "../../models/product-models";
import { chunk, range } from "lodash";
import { log } from "../../util/logging-config";
import { fullTextSearch } from "../../util/strings";
import { useNavbarSearch } from "../../use-navbar-search";
import { sortBy } from '../../util/arrays';
import CompanySelector from '../common/CompanySelector';
import useSingleCompany from '../../hooks/use-single-company';
import usePricingTierMarkupData from '../../hooks/use-product-markup-data';
import { TitledMedia, toAlignment } from '../products/ProductComponents';
import { toPricedProduct } from '../../mappings/product-mappings';
import { formatCell } from '../../mappings/document-mappings';


export default function Prices() {
  const navbarSearch = useNavbarSearch();
  const singleCompany = useSingleCompany();
  const productData = useProductData()
  const pricingTierMarkupData = usePricingTierMarkupData(true);
  const [page, setPage] = useState<number>(1);
  const currentCompany = singleCompany.company
  const selectedItems = useSelectedItems();
  const [filteredProducts, setFilteredProducts] = useState<WithUid<PricedProduct>[]>([]);
  const pageSizes: number[] = [5].concat(range(10, productData.products.length + 10, 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [companyPricingTier, setCompanyPricingTier] = useState<PricingTier>();
  const [orderBy, setOrderBy] = useState<string>("data.title");
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const allowSelection = false;

  const cardStyle = {p: 4, m: 2};

  const dataColumns: readonly DataColumn[] = [
    {
      fieldName: "title",
      cellFormat: CellFormat.STRING,
      disablePadding: true,
      noWrap: true,
      label: "Title",
    },
    {
      fieldName: "costPerKg",
      cellFormat: CellFormat.CURRENCY,
      disablePadding: false,
      noWrap: true,
      label: "Cost Per Kg",
    },
    {
      fieldName: "markup",
      cellFormat: CellFormat.PERCENT,
      disablePadding: false,
      noWrap: true,
      label: "Product Markup",
    },
    {
      fieldName: "pricePerKg",
      cellFormat: CellFormat.CURRENCY,
      disablePadding: false,
      noWrap: true,
      label: "Price Per Kg",
    },
    {
      fieldName: "pricingTierName",
      cellFormat: CellFormat.STRING,
      disablePadding: false,
      noWrap: true,
      label: "Pricing Tier",
    },
    {
      fieldName: "pricingFactor",
      cellFormat: CellFormat.PERCENT,
      disablePadding: false,
      noWrap: true,
      label: "Pricing Factor",
    },
    {
      fieldName: "salePricePerKg",
      cellFormat: CellFormat.CURRENCY,
      disablePadding: false,
      noWrap: true,
      label: "Sale Price Per Kg",
    },
    {
      fieldName: "specificGravity",
      cellFormat: CellFormat.NUMERIC,
      disablePadding: true,
      noWrap: true,
      label: "Specific Gravity",
    },
    {
      fieldName: "type",
      cellFormat: CellFormat.STRING,
      disablePadding: false,
      noWrap: true,
      label: "Type",
    },
    {
      fieldName: "colour",
      cellFormat: CellFormat.STRING,
      disablePadding: false,
      noWrap: true,
      label: "Colour",
    },
    {
      fieldName: "hardness",
      cellFormat: CellFormat.STRING,
      disablePadding: false,
      noWrap: true,
      label: "Hardness",
    },
    {
      fieldName: "curingMethod",
      cellFormat: CellFormat.STRING,
      disablePadding: false,
      noWrap: true,
      label: "Curing Method",
    },
    {
      fieldName: "grade",
      cellFormat: CellFormat.STRING,
      disablePadding: false,
      noWrap: true,
      label: "Grade",
    },
  ];

  function applyFilteredProducts(): WithUid<PricedProduct>[] {
    const filteredProducts = fullTextSearch(productData.products, navbarSearch.search).filter(item => currentCompany?.data?.availableProducts?.includes(item.uid));
    const sortByColumn = `${order === "asc" ? "" : "-"}${orderBy}`;
    const pricedProducts: WithUid<PricedProduct>[] = filteredProducts.map(product => toPricedProduct(product, companyPricingTier)).sort(sortBy(sortByColumn));
    log.debug("filtering:", navbarSearch.search, "availableProducts:", currentCompany?.data?.availableProducts, filteredProducts.length, "of", productData.products.length, "filtered", "sortByColumn", sortByColumn, "pricedProducts:", pricedProducts);
    return pricedProducts;
  }

  useEffect(() => {
    setFilteredProducts(applyFilteredProducts())
    setPage(1);
  }, [productData.products, navbarSearch.search, currentCompany, companyPricingTier])

  useEffect(() => {
    const pricingTier = pricingTierMarkupData.pricingTierForIUid(singleCompany.company.data.pricingTier);
    log.debug("company:", currentCompany, "has pricing tier:", pricingTier);
    setCompanyPricingTier(pricingTier);
  }, [currentCompany, pricingTierMarkupData.pricingTiers])

  useEffect(() => {
    setFilteredProducts(applyFilteredProducts())
  }, [order, orderBy])


  function handleRowsPerPageChange(event) {
    setRowsPerPage(+event.target.value);
    setPage(1)
    log.debug("setRowsPerPage:", +event.target.value);
  }

  function pages(): WithUid<PricedProduct>[][] {
    return chunk(filteredProducts, rowsPerPage);
  }

  function currentPage(): WithUid<PricedProduct>[] {
    return pages()[page - 1] || [];
  }

  function handlePageChange(event: any, value: number) {
    log.debug("handlePageChange:", value);
    setPage(value);
  }


  function handleSelectAll() {
    if (selectedItems.itemsSelected.length === 0) {
      selectedItems.setItemsSelected(productData.products.map(item => item.uid))
    } else {
      selectedItems.setItemsSelected([])
    }
  }

  function handleSelectOne(event: React.ChangeEvent<HTMLInputElement>, uid: string) {
    selectedItems.toggleItem(uid)
  }

  function createSortHandler(id: string) {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrderBy(id);
    setOrder(newOrder)
  }

  return (
      <>
        <Card sx={cardStyle}>
          <Grid container spacing={2}>
            <Grid item xs>
              <CompanySelector/>
            </Grid>
          </Grid>
        </Card>
        <Card sx={cardStyle}>
          <TableContainer sx={{maxHeight: 800}}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {allowSelection && <TableCell padding="checkbox">
                    <Checkbox
                        checked={selectedItems.itemsSelected.length === productData.products.length}
                        color="primary"
                        indeterminate={
                          selectedItems.itemsSelected.length > 0 &&
                          selectedItems.itemsSelected.length < productData.products.length
                        }
                        onChange={handleSelectAll}
                    />
                  </TableCell>}
                  {dataColumns.map((dataColumn) => (
                      <TableCell
                          key={dataColumn.fieldName}
                          align={toAlignment(dataColumn)}
                          padding={"normal"}
                          sortDirection={(orderBy === dataColumn.fieldName ? order : false) as SortDirection}>
                        <TableSortLabel active={orderBy === dataColumn.fieldName}
                                        direction={orderBy === dataColumn.fieldName ? order : "asc"}
                                        onClick={() => createSortHandler(dataColumn.fieldName)}>
                          <Typography noWrap={dataColumn.noWrap}>{dataColumn.label}</Typography>
                          {orderBy === dataColumn.fieldName ? (
                              <Box component="span" sx={visuallyHidden}>
                                {order === "desc" ? "sorted descending" : "sorted ascending"}
                              </Box>
                          ) : null}
                        </TableSortLabel>
                      </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPage().map((pricedProduct) => {
                  return (
                      <TableRow
                          hover
                          key={pricedProduct.uid}
                          selected={selectedItems.itemsSelected.includes(pricedProduct.uid)}>
                        {allowSelection && <TableCell padding="checkbox">
                          <Checkbox
                              checked={selectedItems.itemsSelected.includes(pricedProduct.uid)}
                              onChange={(event) => handleSelectOne(event, companyId(pricedProduct))}
                              value="true"
                          />
                        </TableCell>}
                        {dataColumns.map((dataColumn, index) => (
                            <TableCell
                                key={dataColumn.fieldName}
                                align={toAlignment(dataColumn)}
                                padding={"normal"}>
                              {index === 0 ? <TitledMedia product={pricedProduct}/> :
                                  formatCell(pricedProduct, dataColumn)}
                            </TableCell>
                        ))}
                      </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={2}>
            <Grid item xs>
              <TablePagination
                  component="div"
                  count={filteredProducts.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={pageSizes}/>
            </Grid>
          </Grid>
        </Card>
      </>
  );
}
