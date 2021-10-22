import { log } from "../util/logging-config";
import { GridCallbackDetails, GridCellParams, MuiEvent } from "@mui/x-data-grid";
import { WithUid } from "../models/common-models";
import React from "react";

export default function useDataGrid() {
    function onCellClick(params: GridCellParams<string>, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) {
        const {colDef} = params;
        log.debug("onCellClick:params:", params, "event:", event, "details:", details);
        if (colDef.editable) {
            // apiRef.current.setCellMode(params.id, params.field, "edit");
        }
    }

    function onCellLeave(params: GridCellParams<string>, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) {
        const {colDef} = params;
        log.debug("handleCellClick:params:", params);
        if (colDef.editable) {
            // apiRef.current.setCellMode(params.id, params.field, "view");
        }
    }

    function toRow<T>(item: WithUid<T>) {
        return {id: item.uid, ...item.data};
    }

    return {onCellClick, onCellLeave, toRow};

}

