import { WithUid } from "../models/common-models";
import { saveAll, subscribe } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { productsState } from '../atoms/product-atoms';
import { Product } from '../models/product-models';

export default function useProductData() {
    const [products, setProducts] = useRecoilState<WithUid<Product>[]>(productsState);

    useEffect(() => {
        log.info("Products initial render:", products);
        const unsub = subscribe<Product>("products", setProducts)
        return (() => {
            unsub()
        })
    }, [])

    useEffect(() => {
        log.debug("Products change:", products);
    }, [products])


    function saveAllProducts() {
        saveAll<Product>("products", products).then((response) => {
            log.info("response was:", response)
        });
    }

    return {saveAllProducts, products, setProducts}

}
