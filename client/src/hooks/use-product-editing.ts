import * as React from "react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { productsInEditModeState } from "../atoms/product-atoms";
import { log } from "../util/logging-config";

export default function useProductEditing() {

    const [edit, setEdit] = useRecoilState<string[]>(productsInEditModeState);

    useEffect(() => {
        log.debug("edit:", edit)
    }, [edit])

    function editEnabled(uid: string) {
        const enabled = edit.includes(uid);
        log.debug("editEnabled:uid:", uid, enabled)
        return enabled;
    }

    function toggleProductEdit(uid: string) {
        // if (!uid) {
        //     log.info("toggleProductEdit - no uid:", uid)
        //     setEdit(edit.filter(item => item !== uid))
        if (editEnabled(uid)) {
            log.info("toggleProductEdit - removing uid:", uid)
            setEdit(edit.filter(item => item !== uid))
        } else {
            log.info("toggleProductEdit - adding uid:", uid)
            setEdit([uid].concat(edit));
        }
    }

    return {toggleProductEdit, editEnabled}

}
