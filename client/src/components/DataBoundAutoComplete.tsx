import { Autocomplete, TextField, } from "@material-ui/core";
import * as React from "react";
import { get } from "lodash";
import { WithUid } from "../models/common-models";
import { InputProps as StandardInputProps } from "@material-ui/core/Input/Input";
import { AutocompletePropsSizeOverrides } from "@material-ui/core/Autocomplete/Autocomplete";
import { OverridableStringUnion } from "@material-ui/types";
import { SxProps } from '@material-ui/system';
import { Theme } from '@material-ui/core/styles';

export function DataBoundAutoComplete<T>(props: {
    sx?: SxProps<Theme>,
    size?: OverridableStringUnion<"small" | "medium", AutocompletePropsSizeOverrides>; field: string, label: string, type: string, document: WithUid<T>,
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
            freeSolo
            sx={props.sx}
            disableClearable
            size={props.size || "small"}
            value={value}
            getOptionLabel={item => item?.toString()}
            onChange={(event, value) => props.onChange(props.field, value, numeric)}
            options={props.options}
            renderInput={(params) =>
                <TextField  {...params}
                    // InputProps={{
                    //     startAdornment:
                    //         <>
                    //             <InputAdornment position="start">
                    //                 {params.InputProps.startAdornment}
                    //             </InputAdornment>{props.inputProps?.startAdornment}
                    //         </>,
                    //     endAdornment:
                    //         <>
                    //             <InputAdornment position="end">
                    //                 {params.InputProps.endAdornment}
                    //             </InputAdornment>{props.inputProps?.endAdornment}
                    //         </>
                    // }}
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
                            variant="outlined"/>}/>
    );
}
