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
import { companyId } from "../../mappings/company-mappings";
import useProductData from "../../hooks/use-product-data";
import useSelectedItems from "../../hooks/use-selected-items";
import { CellComponent, CellFormat, DataColumn, WithUid } from "../../models/common-models";
import { Product } from "../../models/product-models";
import { log } from "../../util/logging-config";
import { useNavbarSearch } from "../../use-navbar-search";
import usePricingTierMarkupData from '../../hooks/use-product-markup-data';
import { TitledMedia, toAlignment } from './ProductComponents';
import useProductEditing from '../../hooks/use-product-editing';
import useUniqueValues from '../../hooks/use-unique-values';
import { createStyles, makeStyles } from '@material-ui/styles';
import { cardStyle } from '../../admin/components/GlobalStyles';

export const productColumns: readonly DataColumn[] = [
  {
    fieldName: "data.title",
    cellFormat: CellFormat.STRING,
    component: CellComponent.TEXTFIELD,
    disablePadding: true,
    noWrap: true,
    label: "Title",
  },
  {
    fieldName: "data.description",
    cellFormat: CellFormat.STRING,
    component: CellComponent.TEXTFIELD,
    disablePadding: true,
    noWrap: true,
    label: "Description",
  },
  {
    fieldName: "data.specificGravity",
    cellFormat: CellFormat.NUMERIC,
    component: CellComponent.AUTOCOMPLETE,
    disablePadding: true,
    noWrap: true,
    label: "Specific Gravity",
  },
  {
    fieldName: "data.costPerKg",
    cellFormat: CellFormat.CURRENCY,
    component: CellComponent.TEXTFIELD,
    disablePadding: false,
    noWrap: true,
    label: "Cost Per Kg",
  },
  {
    fieldName: "data.markup",
    cellFormat: CellFormat.PERCENT,
    component: CellComponent.AUTOCOMPLETE,
    disablePadding: false,
    noWrap: true,
    label: "Product Markup",
  },
  {
    fieldName: "data.pricePerKg",
    cellFormat: CellFormat.CURRENCY,
    component: CellComponent.TEXTFIELD,
    disabled: true,
    disablePadding: false,
    noWrap: true,
    label: "Pricing Per Kg",
  },
  {
    fieldName: "data.type",
    cellFormat: CellFormat.STRING,
    component: CellComponent.AUTOCOMPLETE,
    disablePadding: false,
    noWrap: true,
    label: "Type",
  },
  {
    fieldName: "data.colour",
    cellFormat: CellFormat.STRING,
    component: CellComponent.AUTOCOMPLETE,
    disablePadding: false,
    noWrap: true,
    label: "Colour",
  },
  {
    fieldName: "data.grade",
    cellFormat: CellFormat.STRING,
    component: CellComponent.AUTOCOMPLETE,
    disablePadding: false,
    noWrap: true,
    label: "Grade",
  },
  {
    fieldName: "data.hardness",
    cellFormat: CellFormat.STRING,
    component: CellComponent.AUTOCOMPLETE,
    disablePadding: false,
    noWrap: true,
    label: "Hardness",
  },
  {
    fieldName: "data.curingMethod",
    cellFormat: CellFormat.STRING,
    component: CellComponent.AUTOCOMPLETE,
    disablePadding: false,
    noWrap: true,
    label: "Curing Method",
  },
  {
    fieldName: "data.media",
    cellFormat: CellFormat.STRING,
    component: CellComponent.TEXTFIELD,
    disablePadding: false,
    noWrap: true,
    label: "Media",
  },
];

export default function ProductsTable(props: { products: WithUid<Product>[] }) {
  const navbarSearch = useNavbarSearch();
  const productData = useProductData()
  const editing = useProductEditing(true);
  const uniqueValues = useUniqueValues(editing.products);
  const pricingTierMarkupData = usePricingTierMarkupData(true);
  const [page, setPage] = useState<number>(1);
  const selectedItems = useSelectedItems();
  const [orderBy, setOrderBy] = useState<string>("data.title");
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const allowSelection = false;
  const useStyles = makeStyles(() =>
      createStyles({
        tableCell: {
          padding: 0,
          margins: 0
        },
      })
  );
  const classes = useStyles();


  useEffect(() => {
    log.info("products", props.products);
  }, [])

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
      <Box sx={cardStyle}>
        <TableContainer sx={{maxHeight: 800}}>
          <Table stickyHeader size="small" padding={"none"}>
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
                {productColumns.map((dataColumn, index) => (
                    <TableCell
                        colSpan={index === 0 ? 2 : 1}
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
              {props.products.map((product: WithUid<Product>) => {
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
                      <TitledMedia product={product} hideTitle/>{productColumns.map((dataColumn, index) => (
                        <TableCell
                            // sx={cellStyle}
                            key={dataColumn.fieldName}
                            align={toAlignment(dataColumn)}
                            padding={"none"}>
                          {editing.cellComponent(product, dataColumn)}
                        </TableCell>
                    ))}
                    </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  );
}
