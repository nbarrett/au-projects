import { WithUid } from "../models/common-models";
import { findAll, saveAll, subscribe } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { Product, ProductCoding, ProductCodingMap, ProductCodingType } from "../models/product-models";
import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";
import isNumber from "lodash/isNumber";
import isUndefined from "lodash/isUndefined";
import { sortBy } from "../util/arrays";
import { productCodingMapState, productCodingState } from "../atoms/product-atoms";
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import useCompanyData from "./use-company-data";

export default function useProductCoding(subscribeToUpdates?: boolean) {
    const companyData = useCompanyData();
    const [documents, setDocuments] = useRecoilState<WithUid<ProductCoding>[]>(productCodingState);
    const [map, setMap] = useRecoilState<ProductCodingMap>(productCodingMapState);
    const collection = "productCodings";
    const available = !isEmpty(map);

    useEffect(() => {
        log.debug("useProductCoding initial render:", documents);
        if (subscribeToUpdates) {
            const unsub = subscribe<ProductCoding>(collection, setDocuments);
            return (() => {
                unsub();
            });
        } else {
            refresh();
        }
    }, [])

    useEffect(() => {
        if (documents.length > 0) {
            log.debug("useProductCoding:documents:", documents);
            const map: ProductCodingMap = {};
            documents.forEach((document: WithUid<ProductCoding>) => set(map, [document.uid], document));
            log.debug("map created:", map);
            setMap(map);
        }
    }, [documents])

    function saveAllProductCodings(): Promise<any> {
        return saveAll<ProductCoding>(collection, documents).then(() => {
            if (!subscribeToUpdates) {
                refresh();
            }
        });
    }

    function add(index: number, productCodingType: ProductCodingType): WithUid<ProductCoding> {
        const document: WithUid<ProductCoding> = {
            data: {
                productCodingType,
                code: "",
                name: ""
            }, uid: ""
        };
        setDocuments([
            ...documents.slice(0, index),
            document,
            ...documents.slice(index)
        ]);
        return document;
    }

    function refresh(): Promise<any> {
        return findAll<ProductCoding>(collection).then(response => setDocuments(response
            .sort(sortBy("data.code"))));
    }

    function mutableProductCodings(): WithUid<ProductCoding>[] {
        return cloneDeep(documents);
    }

    function productCodingForUid(uid: string): WithUid<ProductCoding> {
        return cloneDeep(map[uid]);
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
        log.debug("product:", product);
        return product ? defaultString("",
            companyData.companyForUid(product.compoundOwner)?.data?.code,
            "-",
            productCodingForUid(product.curingMethod)?.data?.code,
            productCodingForUid(product.hardness)?.data?.code,
            productCodingForUid(product.compound)?.data?.code,
            productCodingForUid(product.type)?.data?.code,
            productCodingForUid(product.grade)?.data?.code,
            productCodingForUid(product.colour)?.data?.code
        ) : "-";
    }

    function productCodeFromGrid(params: GridValueGetterParams): string {
        return productCode(params.row as Product);
    }

    function productDescriptionGrid(params: GridValueGetterParams): string {
        return productDescription(params.row as Product);
    }

    function productDescription(product: Product) {
        return product ? defaultString(", ",
            companyData.companyForUid(product.compoundOwner)?.data?.name,
            productCodingForUid(product.curingMethod)?.data?.name,
            productCodingForUid(product.hardness)?.data?.name,
            productCodingForUid(product.type)?.data?.name + productCodingForUid(product.grade)?.data?.name,
            productCodingForUid(product.colour)?.data?.name
        ) : "-";
    }

    function defaultString(separator: string, ...fields: string[]): string {
        return fields.map(item => item ? item : "").filter(item => item.length > 0).join(separator);
    }

    function ProductCoding(props: GridRenderCellParams) {
        const {value} = props;
        log.debug("ProductCoding:", value);
        return productCodingForUid(value as string)?.data?.name;
    }

    function cellFieldValue(field: string, value, productColumns: GridColDef[]) {
        log.debug("cellFieldValue:field", field, "value:", value, typeof value)
        const dataColumn: GridColDef = productColumns.find(item => item.field === field);
        let cleanedValue = value;
        if (isUndefined(value)) {
            log.debug("cellFieldValue:cleanedValue:", cleanedValue, "field:", field);
            cleanedValue = "";
        } else if (isNumber(value)) {
            cleanedValue = value;
        } else if (dataColumn.type === "number") {
            cleanedValue = +value;
        }
        log.debug("cellFieldValue:value:", value, "cleanedValue:", cleanedValue, "dataColumn:", dataColumn);
        return cleanedValue
    }

    return {
        cellFieldValue,
        productCodeFromGrid,
        productDescription,
        productDescriptionGrid,
        productCode,
        refresh,
        add,
        saveAllProductCodings,
        productCodingsForType,
        productCodingForUid,
        documents,
        setDocument,
        setDocuments,
        ProductCoding,
        available
    }

}
