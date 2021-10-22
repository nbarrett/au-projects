import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { pluralise, pluraliseWithCount } from "../../util/strings";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridSelectionModel } from "@mui/x-data-grid";
import useSnackbar from "../../hooks/use-snackbar";

export default function DeleteManyIcon(props: { hide?: boolean, selectionModel: GridSelectionModel, markForDelete: () => any, singular: string, plural?: string }) {

    const snackbar = useSnackbar();

    return (
        props.hide ? null : <IconButton disabled={props.selectionModel.length === 0}
                                        onClick={() => {
                                            const wasWere = pluralise(props.selectionModel.length, "was", "were");
                                            const itThem = pluralise(props.selectionModel.length, "it", "them");
                                            Promise.resolve(props.markForDelete())
                                                .then(() => snackbar.success(`${pluraliseWithCount(props.selectionModel.length, props.singular, props.plural)} ${wasWere} marked for delete. The next save will permanently delete ${itThem}`));
                                        }}>
            <Tooltip title={`Mark ${pluraliseWithCount(props.selectionModel.length, "item")} for delete`}><DeleteIcon
                color={props.selectionModel.length === 0 ? "disabled" : "secondary"}/></Tooltip>
        </IconButton>);
}

