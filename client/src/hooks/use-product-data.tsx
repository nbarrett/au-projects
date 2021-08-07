import { WithUid } from "../models/common-models";
import { renameField, saveAll, saveAllWithId, subscribe } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { productsState } from "../atoms/product-atoms";
import { Product } from "../models/product-models";
import { useSnackbarNotification } from "../snackbarNotification";
import { newDocument } from "../mappings/document-mappings";
import cloneDeep from "lodash/cloneDeep";

export default function useProductData() {
    const [products, setProducts] = useRecoilState<WithUid<Product>[]>(productsState);
    const notification = useSnackbarNotification();
    useEffect(() => {
        log.debug("Products initial render:", products);
        const unsub = subscribe<Product>("products", setProducts)
        return (() => {
            log.debug("unsub")
            unsub()
        })
    }, [])

    useEffect(() => {
        log.debug("Products change:", products);
    }, [products])


    function saveAllProducts() {
        saveAll<Product>("products", products)
            .then((response) => notification.success(`${products.length} products were saved`))
            .catch(error => notification.error(error.toString()));
    }

    function refresh(): void {
        subscribe<Product>("products", setProducts)
        notification.success("Products were refreshed to their previous values")
    }

    function backupProducts() {
        const collection = "productsBackup";
        saveAllWithId<Product>(collection, products)
            .then((response) => notification.success(`${products.length} products were backed up to the ${collection} collection`))
            .catch(error => notification.error(error.toString()));
    }

    function priceMigration() {
        const collection = "products";
        const fromName = "price";
        const toName = "costPerKg";
        renameField<Product>(collection, fromName, toName, true, true)
            .then((response) => notification.success(`${products.length} products had field ${fromName} renamed to ${toName} in the ${collection} collection`))
            .catch(error => notification.error(error.toString()));
    }

    function add(): WithUid<Product> {
        const product: WithUid<Product> = newDocument<Product>();
        setProducts([product].concat(products))
        return product;
    }

    function setSingleProduct(product: WithUid<Product>): void {
        setProducts(products.map(item => item.uid === product.uid ? product : item))
    }

    function findProduct(id): WithUid<Product> {
        return cloneDeep(products.find(item => item.uid === id));
    }

    return {saveAllProducts, priceMigration, backupProducts, products, setSingleProduct, setProducts, add, refresh, findProduct}

}
