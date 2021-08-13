import { WithUid } from "../models/common-models";
import { findAll, saveAll, subscribe } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { Product, ProductCoding, ProductCodingType } from "../models/product-models";
import cloneDeep from "lodash/cloneDeep";
import { sortBy } from "../util/arrays";
import { productCodingState } from "../atoms/product-atoms";
import { GridValueGetterParams } from "@material-ui/data-grid";
import useCompanyData from "./use-company-data";

export default function useProductCoding(subscribeToUpdates?: boolean) {
    const companyData = useCompanyData();
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

    function productCode(product: Product) {
        return defaultString("",
            companyData.companyForUid(product.compoundOwner)?.data?.code,
            "-",
            productCodingForUid(product.curingMethod)?.data?.code,
            productCodingForUid(product.hardness)?.data?.code,
            productCodingForUid(product.type)?.data?.code,
            productCodingForUid(product.grade)?.data?.code,
            productCodingForUid(product.colour)?.data?.code
        );
    }

    function productCodeFromGrid(params: GridValueGetterParams): string {
        return productCode(params.row as Product);
    }

    function productDescription(product: Product) {
        return defaultString(", ",
            companyData.companyForUid(product.compoundOwner)?.data?.name,
            productCodingForUid(product.curingMethod)?.data?.name,
            productCodingForUid(product.hardness)?.data?.name,
            productCodingForUid(product.type)?.data?.name,
            productCodingForUid(product.grade)?.data?.name,
            productCodingForUid(product.colour)?.data?.name
        );
    }

    function defaultString(separator: string, ...fields: string[]): string {
        return fields.map(item => item ? item : "").filter(item => item.length > 0).join(separator);
    }

    return {
        productCodeFromGrid,
        productDescription,
        productCode,
        refresh,
        saveAllProductCodings,
        productCodingsForType,
        productCodingForUid,
        documents,
        setDocument,
        setDocuments
    }

}
