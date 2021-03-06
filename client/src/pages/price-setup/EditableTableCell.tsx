import { log } from "../../util/logging-config";
import { TableCell, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { CellAddress } from "../../models/common-models";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { InputProps as StandardInputProps } from "@mui/material/Input/Input";
import isNumber from "lodash/isNumber";

export function EditableTableCell(props: { inputProps?: Partial<StandardInputProps>, value: string | number, address: CellAddress, onChange: (event: any, address: CellAddress) => void }) {
    const classes = makeStyles((theme: Theme) => ({
        tableCell: {
            height: 5
        },
        fullWidth: {
            width: "100%",
        },
        propertiesTable: {
            maxHeight: 400,
        },
    }))({});
    const type = isNumber(props.value) ? "number" : "text";

    useEffect(() => {
        log.debug("EditableTableCell:re-rendering", props.value, props.address, "type:", type)
    }, []);


    return (
        <TableCell align="left" className={classes.tableCell}>
            <TextField InputProps={props.inputProps} variant={"outlined"}
                       value={props.value || (props.address.numeric ? 0 : "")}
                       type={type}
                       size={"small"}
                       onChange={(event) => props.onChange(event, props.address)}
                       className={classes.fullWidth}/>
        </TableCell>
    );
}
