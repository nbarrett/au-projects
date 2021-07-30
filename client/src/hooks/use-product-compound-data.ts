import { WithUid } from "../models/common-models";
import { findAll, saveAll, subscribe } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { ProductCompound } from '../models/product-models';
import { productCompoundState } from '../atoms/product-atoms';
import cloneDeep from 'lodash/cloneDeep';
import { sortBy } from '../util/arrays';

export default function useProductCompoundData(subscribeToUpdates: boolean) {
    const [productCompounds, setProductCompounds] = useRecoilState<WithUid<ProductCompound>[]>(productCompoundState);

    const collection = "productCompounds";

    useEffect(() => {
        log.debug("useProductCompoundMarkupData initial render:", productCompounds);
        if (subscribeToUpdates) {
            const unsub = subscribe<ProductCompound>(collection, setProductCompounds)
            return (() => {
                unsub()
            })
        } else {
            refresh()
            return (() => {
            })
        }
    }, [])

    useEffect(() => {
        log.debug("useProductCompoundMarkupData change:", productCompounds);
    }, [productCompounds])

    function saveAllProductCompounds(): Promise<any> {
        return saveAll<ProductCompound>(collection, productCompounds).then(() => {
            if (!subscribeToUpdates) {
                refresh()
            }
        });
    }

    function refresh(): Promise<any> {
        return findAll<ProductCompound>(collection).then(response => setProductCompounds(response.sort(sortBy("data.code"))));
    }

    function mutableProductCompounds(): WithUid<ProductCompound>[] {
        return cloneDeep(productCompounds);
    }

    function productCompoundForIUid(uid: string) {
        return productCompounds?.find(tier => tier?.uid === uid)?.data;
    }

    return {
        refresh,
        saveAllProductCompounds,
        mutableProductCompounds,
        productCompoundForIUid,
        productCompounds,
        setProductCompounds
    }

}
