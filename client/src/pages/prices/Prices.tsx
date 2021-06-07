import * as React from "react";
import { useEffect, useState } from "react";
import { Theme } from "@material-ui/core/styles";
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
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Avatar,
  Card,
  Grid,
  InputAdornment,
  ListItemText,
  MenuItem,
  Paper,
  TablePagination,
  TextField,
} from "@material-ui/core";
import { companyId } from "../../mappings/company-mappings";
import useProductData from "../../hooks/use-product-data";
import useCompanyData from "../../hooks/use-company-data";
import useSelectedItems from "../../hooks/use-selected-items";
import { useNavigate } from "react-router-dom";
import { DEFAULT_THICKNESSES } from "../../mappings/product-mappings";
import { WithUid } from "../../models/common-models";
import { Product } from "../../models/product-models";
import { chunk, cloneDeep, range } from "lodash";
import { log } from "../../util/logging-config";
import { asMoney, fullTextSearch } from "../../util/strings";
import { useNavbarSearch } from "../../use-navbar-search";
import { Company } from "../../models/company-models";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { sortBy } from '../../util/arrays';

export default function Prices() {
  const navigate = useNavigate();
  const navbarSearch = useNavbarSearch();
  const companyData = useCompanyData()
  const productData = useProductData()
  const [percentLosses, setPercentLosses] = useState<number>(10);
  const [markup, setMarkup] = useState<number>(192.5);
  const [page, setPage] = useState<number>(1);
  const [currentCompany, setCurrentCompany] = useState<WithUid<Company>>();
  const selectedItems = useSelectedItems();
  const [filteredProducts, setFilteredProducts] = useState<WithUid<Product>[]>([]);
  const pageSizes: number[] = [5].concat(range(10, productData.products.length + 10, 10));
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [orderBy, setOrderBy] = useState<string>("data.title");
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const allowSelection = false;

  const useStyles = makeStyles((theme: Theme) => ({
    input: {
      width: 400
    }
  }));

  interface HeadCell {
    disablePadding: boolean;
    noWrap: boolean;
    id: string;
    label: string;
    numeric: boolean;
  }

  const headCells: readonly HeadCell[] = [
    {
      id: "data.title",
      numeric: false,
      disablePadding: true,
      noWrap: true,
      label: "Title",
    },
    {
      id: "data.specificGravity",
      numeric: true,
      disablePadding: true,
      noWrap: true,
      label: "Specific Gravity",
    },
    {
      id: "data.type",
      numeric: false,
      disablePadding: false,
      noWrap: true,
      label: "Type",
    },
    {
      id: "data.colour",
      numeric: false,
      disablePadding: false,
      noWrap: true,
      label: "Colour",
    },
    {
      id: "data.hardness",
      numeric: false,
      disablePadding: false,
      noWrap: true,
      label: "Hardness",
    },
    {
      id: "data.price",
      numeric: true,
      disablePadding: false,
      noWrap: true,
      label: "Unit Price",
    },
    {
      id: "data.price",
      numeric: true,
      disablePadding: false,
      noWrap: true,
      label: "Unit Price\n + Losses",
    },
  ].concat(DEFAULT_THICKNESSES.map(thickness => ({
    id: "thickness-cost-" + thickness,
    numeric: true,
    disablePadding: false,
    noWrap: true,
    label: thickness + " mm"
  })));

  const classes = useStyles();

  function applyFilteredProducts(): WithUid<Product>[] {
    const filteredProducts = fullTextSearch(productData.products, navbarSearch.search).filter(item => currentCompany?.data?.availableProducts?.includes(item.uid));
    const sortByColumn = `${order === "asc" ? "" : "-"}${orderBy}`;
    const filtered = cloneDeep(filteredProducts).sort(sortBy(sortByColumn));
    log.info("filtering:", navbarSearch.search, "availableProducts:", currentCompany?.data?.availableProducts, filteredProducts.length, "of", productData.products.length, "filtered", "sortByColumn", sortByColumn, "filtered:", filtered);
    return filtered;
  }

  useEffect(() => {
    if (!currentCompany && companyData.companies.length > 0) {
      setCurrentCompany(companyData.companies[0])
    }
  }, [companyData.companies])

  useEffect(() => {
    setFilteredProducts(applyFilteredProducts())
    setPage(1);
  }, [productData.products, navbarSearch.search, currentCompany])

  useEffect(() => {
    log.info("currentCompany:", currentCompany);
  }, [currentCompany])

  useEffect(() => {
    setFilteredProducts(applyFilteredProducts())
  }, [order, orderBy])


  function handleRowsPerPageChange(event) {
    setRowsPerPage(+event.target.value);
    setPage(1)
    log.info("setRowsPerPage:", +event.target.value);
  }

  function pages(): WithUid<Product>[][] {
    return chunk(filteredProducts, rowsPerPage);
  }

  function currentPage(): WithUid<Product>[] {
    return pages()[page - 1] || [];
  }

  function handlePageChange(event: any, value: number) {
    log.info("handlePageChange:", value);
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

  function CompanySelector() {
    return <TextField className={clsx(classes.input)}
                      size={"small"}
                      select
                      label="Show prices for"
                      value={currentCompany?.uid || ""}
                      onChange={(event) => setCurrentCompany(companyData.companies.find(company => company.uid === event.target.value))}>
      {companyData.companies.map((option) => (
          <MenuItem key={option.uid} value={option.uid}>
            <ListItemText sx={{display: 'inline'}} primary={option.data.name}
                          secondary={`${option.data.availableProducts?.length || 0} available products`}/>
          </MenuItem>
      ))}
    </TextField>
  }

  function priceWithLosses(product: WithUid<Product>) {
    const price = product?.data?.price || 0;
    return price + (price * percentLosses / 100);
  }

  function thicknessPrice(product: WithUid<Product>, thickness: number) {
    return priceWithLosses(product) * product.data.specificGravity * thickness;
  }

  function createSortHandler(id: string) {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrderBy(id);
    setOrder(newOrder)
  }

  return (
      <>
        <Paper sx={{p: 2, margin: "auto", width: "100%"}}>
          <Grid container spacing={2}>
            <Grid item xs>
              <CompanySelector/>
            </Grid>
            <Grid item xs>
              <TextField className={clsx(classes.input)}
                         InputProps={{
                           endAdornment: <InputAdornment position="start">%</InputAdornment>,
                         }}
                         size={"small"}
                         type={"number"}
                         label="Losses"
                         value={percentLosses}
                         onChange={(value) => {
                           const losses = value.target.value;
                           log.info("value:", losses)
                           setPercentLosses(+losses)
                         }}
              >
              </TextField>
            </Grid>
            <Grid item xs>
              <TextField className={clsx(classes.input)}
                         InputProps={{
                           endAdornment: <InputAdornment position="start">%</InputAdornment>,
                         }}
                         size={"small"}
                         type={"number"}
                         label="Full Price Factor"
                         value={markup}
                         onChange={(value) => {
                           const markup = value.target.value;
                           log.info("value:", markup)
                           setMarkup(+markup)
                         }}
              >
              </TextField>
            </Grid>
          </Grid>
        </Paper>
        <Card>
          <PerfectScrollbar>
            <TableContainer sx={{maxHeight: 800}}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan={7}>
                      Product Details
                    </TableCell>
                    <TableCell align="center" colSpan={DEFAULT_THICKNESSES.length}>
                      Cost Price per Square Metre
                    </TableCell>
                  </TableRow>
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
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? "right" : "left"}
                            padding={"normal"}
                            sortDirection={(orderBy === headCell.id ? order : false) as SortDirection}>
                          <TableSortLabel active={orderBy === headCell.id}
                                          direction={orderBy === headCell.id ? order : "asc"}
                                          onClick={() => createSortHandler(headCell.id)}>
                            <Typography noWrap={headCell.noWrap}>{headCell.label}</Typography>
                            {orderBy === headCell.id ? (
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
                  {currentPage().map((product) => {
                    return (
                        <TableRow
                            hover
                            key={product.uid}
                            selected={selectedItems.itemsSelected.includes(product.uid)}>
                          {allowSelection && <TableCell padding="checkbox">
                            <Checkbox
                                checked={selectedItems.itemsSelected.includes(product.uid)}
                                onChange={(event) => handleSelectOne(event, companyId(product))}
                                value="true"
                            />
                          </TableCell>}
                          <TableCell>
                            <Box sx={{
                              alignItems: "center",
                              display: "flex",
                            }}>
                              <Avatar sizes={"sm"} src={product.data.media} sx={{mr: 2}}/>
                              <Typography noWrap color="textPrimary" variant="body1">
                                {product.data.title}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align={"right"}>
                            {product.data.specificGravity}
                          </TableCell>
                          <TableCell>
                            {product.data.type}
                          </TableCell>
                          <TableCell>
                            {product.data.colour}
                          </TableCell>
                          <TableCell>
                            {product.data.hardness}
                          </TableCell>
                          <TableCell align={"right"}>
                            {asMoney(product.data.price, 2, "R")}
                          </TableCell>
                          <TableCell align={"right"}>
                            {asMoney(priceWithLosses(product), 2, "R")}
                          </TableCell>
                          {DEFAULT_THICKNESSES.map(thickness => {
                            const pricePerSquareMetre = thicknessPrice(product, thickness);
                            return <TableCell key={`${product.uid}-${thickness}`}
                                              align={"right"}>
                              <ListItemText primary={asMoney(pricePerSquareMetre, 2, "R")}
                                            secondary={asMoney(pricePerSquareMetre * markup / 100, 2, "R")}/>
                            </TableCell>;
                          })}
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
          </PerfectScrollbar>
        </Card>
      </>
  );
}
