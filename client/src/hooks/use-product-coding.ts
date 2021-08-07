import { WithUid } from "../models/common-models";
import { findAll, saveAll, subscribe } from "../data-services/firebase-services";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { ProductCoding, ProductCodingType } from "../models/product-models";
import cloneDeep from "lodash/cloneDeep";
import { sortBy } from "../util/arrays";
import { productCodingState } from "../atoms/product-atoms";

export default function useProductCoding(subscribeToUpdates?: boolean) {
    const [documents, setDocuments] = useRecoilState<WithUid<ProductCoding>[]>(productCodingState);
    const collection = "productCodings";

    useEffect(() => {
        log.debug("useProductCoding initial render:", documents);
        if (subscribeToUpdates) {
            const unsub = subscribe<ProductCoding>(collection, setDocuments)
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
        log.debug("useProductCoding:documents:", documents);
    }, [documents])

    function saveAllProductCodings(): Promise<any> {
        return saveAll<ProductCoding>(collection, documents).then(() => {
            if (!subscribeToUpdates) {
                refresh()
            }
        });
    }

    function refresh(): Promise<any> {
        return findAll<ProductCoding>(collection).then(response => setDocuments(response
            .sort(sortBy("data.code"))));
    }

    function mutableProductCodings(): WithUid<ProductCoding>[] {
        return cloneDeep(documents);
    }

    function productCodingForUid(uid: string): WithUid<ProductCoding> {
        return mutableProductCodings().find(compound => compound?.uid === uid);
    }

    function productCodingsForType(productCodingType: ProductCodingType): WithUid<ProductCoding>[] {
        return mutableProductCodings()
            .filter(item => item?.data?.productCodingType === productCodingType)
            .sort(sortBy("data.code")) || [];
    }

    function setDocument(product: WithUid<ProductCoding>): void {
        if (productCodingForUid(product.uid)) {
            setDocuments(documents.map(item => item.uid === product.uid ? product : item))
        } else {
            setDocuments(documents.concat([product]))
        }
    }

    return {
        refresh,
        saveAllProductCodings,
        productCodingsForType,
        productCodingForUid,
        documents,
        setDocument,
        setDocuments
    }

}
