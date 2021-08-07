import * as React from "react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { productsInEditModeState, productsState } from "../atoms/product-atoms";
import { log } from "../util/logging-config";
import { WithUid } from "../models/common-models";
import { Product } from "../models/product-models";
import { cloneDeep, set } from "lodash";
import { createStyles, makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles";

export default function useProductEditing() {

    const [edit, setEdit] = useRecoilState<string[]>(productsInEditModeState);
    const [product, setProduct] = useState<WithUid<Product>>();
    const products = useRecoilValue<WithUid<Product>[]>(productsState);
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
        log.debug("productChange:" + product?.data?.title, "field:", field, "value:", value, "typeof:", typeof value);
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
        log.debug("numericProductChange:field:", field);
        const value = event.target.value;
        changeField(field, value, true);
    }

    useEffect(() => {
        if (product) {
            log.debug("changed product:", product);
        }
    }, [product])

    function editEnabled(uid: string) {
        const enabled = edit.includes(uid);
        log.debug("editEnabled:uid:", uid, enabled)
        return enabled;
    }

    function toggleProductEdit(uid: string) {
        if (editEnabled(uid)) {
            log.debug("toggleProductEdit - removing uid:", uid)
            setEdit(edit.filter(item => item !== uid))
        } else {
            log.debug("toggleProductEdit - adding uid:", uid)
            setEdit([uid].concat(edit));
        }
    }

    return {
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
