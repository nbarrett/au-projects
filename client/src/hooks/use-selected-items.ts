import { useState } from "react";
import { log } from '../util/logging-config';

export default function useSelectedItems(initialValue?: string[]) {
    const [itemsSelected, setItemsSelected] = useState<string[]>(initialValue || []);

    function toggleItem(value: string) {
        if (itemsSelected.includes(value)) {
            log.info("removing value:", value);
            const newChecked = itemsSelected.filter(item => item !== value);
            setItemsSelected(newChecked);
        } else {
            log.info("adding value:", value);
            const newChecked = itemsSelected.concat(value);
            setItemsSelected(newChecked);
        }
    }

    return {itemsSelected, setItemsSelected, toggleItem}
}
