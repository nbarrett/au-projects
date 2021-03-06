import { Autocomplete, AutocompleteRenderInputParams, TextField, } from "@mui/material";
import * as React from "react";
import { get } from "lodash";
import { WithUid } from "../models/common-models";
import { InputProps as StandardInputProps } from "@mui/material/Input/Input";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";

export function DataBoundAutoComplete<T>(props: {
    sx?: SxProps<Theme>,
    size?: any; field: string, label?: string, variant?: any, type: string, document: WithUid<T>,
    options: any[], onChange: (field: string, value: any, numeric: boolean) => void, inputProps?: Partial<StandardInputProps>
}) {

    const numeric: boolean = props.type === "number";
    const value: string = get(props.document, props.field) || "";

    function productChange(event?: any) {
        const field = event.target.name || event.target.id;
        const value = event.target.value;
        props.onChange(field, value, numeric);
    }
    return (
        <Autocomplete
            fullWidth
            freeSolo
            sx={props.sx}
            disableClearable
            size={props.size || "small"}
            value={value}
            getOptionLabel={item => item?.toString()}
            onChange={(event, value) => props.onChange(props.field, value, numeric)}
            options={props.options || []}
            renderInput={(params: AutocompleteRenderInputParams) =>
                <TextField  {...params}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password",
                            }}
                            sx={props.sx}
                            fullWidth
                            type={props.type}
                            onChange={productChange}
                            value={value}
                            name={props.field}
                            label={props.label}
                            variant={props.variant || "outlined"}/>}/>
    );
}
