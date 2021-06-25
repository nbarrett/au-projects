import * as React from "react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { productsInEditModeState, productsState } from "../atoms/product-atoms";
import { log } from "../util/logging-config";
import { CellComponent, CellFormat, DataColumn, WithUid } from '../models/common-models';
import { Product } from '../models/product-models';
import { cloneDeep, set } from 'lodash';
import { DataBoundAutoComplete } from '../components/DataBoundAutoComplete';
import { InputAdornment, TextField } from '@material-ui/core';
import get from 'lodash/get';
import useUniqueValues from './use-unique-values';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { cellStyle } from '../admin/components/GlobalStyles';

export default function useProductEditing(asTable?: boolean) {

    const [edit, setEdit] = useRecoilState<string[]>(productsInEditModeState);
    const [product, setProduct] = useState<WithUid<Product>>();
    const products = useRecoilValue<WithUid<Product>[]>(productsState);
    const uniqueValues = useUniqueValues(products);
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            input: {
                width: 200,
                padding: 0,
                margins: 0
            },
        })
    );

    const classes = useStyles();

    useEffect(() => {
        log.debug("edit:", edit)
    }, [edit])

    function changeField(field: string, value: any, numeric: boolean) {
        log.info("productChange:" + product.data.title, "field:", field, "value:", value, "typeof:", typeof value);
        const mutableProduct: WithUid<Product> = cloneDeep(product);
        set(mutableProduct, field, numeric ? +value : value)
        setProduct(mutableProduct);
    }

    function productChange(event: any) {
        const field = event.target.name || event.target.id;
        const value = event.target.value;
        changeField(field, value, false);
    }

    function numericProductChange(event: any) {
        const field = event.target.name || event.target.id;
        log.info("numericProductChange:field:", field);
        const value = event.target.value;
        changeField(field, value, true);
    }

    useEffect(() => {
        log.info("changed product:", product);
    }, [product])

    function editEnabled(uid: string) {
        const enabled = edit.includes(uid);
        log.debug("editEnabled:uid:", uid, enabled)
        return enabled;
    }

    function toggleProductEdit(uid: string) {
        if (editEnabled(uid)) {
            log.info("toggleProductEdit - removing uid:", uid)
            setEdit(edit.filter(item => item !== uid))
        } else {
            log.info("toggleProductEdit - adding uid:", uid)
            setEdit([uid].concat(edit));
        }
    }
    function cellComponent<T>(document: WithUid<T>, dataColumn: DataColumn) {
        const data = document.data[dataColumn.fieldName];
        const type = dataColumn.cellFormat === CellFormat.NUMERIC ? "number" : "text";
        switch (dataColumn.component) {
            case CellComponent.AUTOCOMPLETE:
                return <DataBoundAutoComplete<Product> field={dataColumn.fieldName}
                                                       label={asTable ? null : dataColumn.label}
                                                       sx={cellStyle}
                                                       size={"small"}
                                                       type={type}
                                                       options={[]}
                                                       document={product}
                                                       onChange={changeField} inputProps={{
                    endAdornment: dataColumn.cellFormat === CellFormat.PERCENT ?
                        <InputAdornment position="end">%</InputAdornment> : null,
                }}/>;
            case CellComponent.TEXTFIELD:
                return <TextField
                    InputProps={{
                        startAdornment: dataColumn.cellFormat === CellFormat.CURRENCY ?
                            <InputAdornment position="start">R</InputAdornment> : null,
                    }}
                    sx={cellStyle}
                    onChange={dataColumn.disabled ? null : dataColumn.cellFormat === CellFormat.NUMERIC ? numericProductChange : productChange}
                    disabled={dataColumn.disabled}
                    label={asTable ? null : dataColumn.label}
                    name={dataColumn.fieldName}
                    type={type}
                    size={"small"}
                    value={get(document, dataColumn.fieldName) || ""}
                    variant="outlined"/>
            default:
                return data;
        }
    }

    return {
        cellComponent,
        products,
        toggleProductEdit,
        editEnabled,
        product,
        setProduct,
        numericProductChange,
        productChange,
        changeField
    }

}
