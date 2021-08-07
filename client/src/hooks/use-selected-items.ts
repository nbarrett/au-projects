import { useState } from "react";
import { log } from "../util/logging-config";

export default function useSelectedItems(initialValue?: string[]) {
    const [itemsSelected, setItemsSelected] = useState<string[]>(initialValue || []);

    function toggleItem(value: string) {
        if (itemsSelected.includes(value)) {
            log.debug("removing value:", value);
            const newChecked = itemsSelected.filter(item => item !== value);
            setItemsSelected(newChecked);
        } else {
            log.debug("adding value:", value);
            const newChecked = itemsSelected.concat(value);
            setItemsSelected(newChecked);
        }
    }

    return {itemsSelected, setItemsSelected, toggleItem}
}
