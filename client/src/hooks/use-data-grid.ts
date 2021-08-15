import { log } from "../util/logging-config";
import { GridCellParams } from "@material-ui/data-grid";
import { WithUid } from "../models/common-models";

export default function useDataGrid() {

    function onCellClick(params: GridCellParams) {
        const {api, colDef} = params;
        log.debug("onCellClick:params:", params);
        if (colDef.editable) {
            api.setCellMode(params.id, params.field, "edit");
        }
    }

    function onCellLeave(params: GridCellParams) {
        const {api, colDef} = params;
        log.debug("handleCellClick:params:", params);
        if (colDef.editable) {
            api.setCellMode(params.id, params.field, "view");
        }
    }

    function toRow<T>(item: WithUid<T>) {
        return {id: item.uid, ...item.data};
    }

    return {onCellClick, onCellLeave, toRow};

}

