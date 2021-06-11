import { WithUid } from "../models/common-models";
import { renameField, saveAll, saveAllWithId, subscribe } from "../data-services/firebase-services";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { log } from "../util/logging-config";
import { productsState } from '../atoms/product-atoms';
import { Product } from '../models/product-models';
import { useSnackbarNotification } from '../snackbarNotification';
import { newDocument } from '../mappings/document-mappings';

export default function useProductData() {
    const [products, setProducts] = useRecoilState<WithUid<Product>[]>(productsState);
    const notification = useSnackbarNotification();
    useEffect(() => {
        log.debug("Products initial render:", products);
        const unsub = subscribe<Product>("products", setProducts)
        return (() => {
            unsub()
        })
    }, [])

    useEffect(() => {
        log.debug("Products change:", products);
    }, [products])


    function saveAllProducts() {
        saveAll<Product>("products", products).then((response) => notification.success(`${products.length} products were saved`));
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

    return {saveAllProducts, priceMigration, backupProducts, products, setProducts, add}

}
