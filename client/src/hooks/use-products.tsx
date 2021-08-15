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

export default function useProducts() {
    const [documents, setDocuments] = useRecoilState<WithUid<Product>[]>(productsState);
    const notification = useSnackbarNotification();
    useEffect(() => {
        log.debug("Products initial render:", documents);
        const unsub = subscribe<Product>("products", setDocuments);
        return (() => {
            log.debug("unsub");
            unsub();
        });
    }, []);

    useEffect(() => {
        log.debug("Products change:", documents);
    }, [documents]);

    function add(index?: number): WithUid<Product> {
        const document = newDocument<Product>();
        setDocuments([
            ...documents.slice(0, index || 0),
            document,
            ...documents.slice(index)
        ]);
        return document;
    }

    function saveAllProducts() {
        saveAll<Product>("products", documents)
            .then((response) => notification.success(`${documents.length} products were saved`))
            .catch(error => notification.error(error.toString()));
    }

    function refresh(): void {
        subscribe<Product>("products", setDocuments);
        notification.success("Products were refreshed to their previous values");
    }

    function backupProducts() {
        const collection = "productsBackup";
        saveAllWithId<Product>(collection, documents)
            .then((response) => notification.success(`${documents.length} products were backed up to the ${collection} collection`))
            .catch(error => notification.error(error.toString()));
    }

    function priceMigration() {
        const collection = "products";
        const fromName = "price";
        const toName = "costPerKg";
        renameField<Product>(collection, fromName, toName, true, true)
            .then((response) => notification.success(`${documents.length} products had field ${fromName} renamed to ${toName} in the ${collection} collection`))
            .catch(error => notification.error(error.toString()));
    }

    function setDocument(product: WithUid<Product>): void {
        setDocuments(documents.map(item => item.uid === product.uid ? product : item));
    }

    function findProduct(id): WithUid<Product> {
        const document = cloneDeep(documents.find(item => (item.uid || "") === (id || "")));
        log.info("finding product with id", id, "returning:", document);
        return document;
    }

    return {
        saveAllProducts,
        priceMigration,
        backupProducts,
        documents,
        setDocument,
        setDocuments,
        add,
        refresh,
        findProduct
    };

}
