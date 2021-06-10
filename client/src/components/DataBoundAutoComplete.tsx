import { Autocomplete, InputAdornment, TextField, } from "@material-ui/core";
import * as React from "react";
import { get, uniq } from "lodash";
import { WithUid } from "../models/common-models";
import { log } from "../util/logging-config";
import { InputProps as StandardInputProps } from '@material-ui/core/Input/Input';

export function DataBoundAutoComplete<T>(props: {
    field: string, label: string, type: string, document: WithUid<T>,
    allDocuments: WithUid<T>[], onChange: (field: string, value: any, numeric: boolean) => void, inputProps?: Partial<StandardInputProps>
}) {

    const numeric: boolean = props.type === "number";
    const value: string = get(props.document, props.field) || "";

    function uniqueValuesFor(field: string): string[] {
        const uniqueValues = uniq(props.allDocuments.map((option) => {
            return get(option, field)
        }).filter(item => item)).sort();
        log.debug("uniqueValuesFor:", field, uniqueValues);
        return uniqueValues;
    }

    function productChange(event?: any) {
        const field = event.target.name || event.target.id;
        const value = event.target.value;
        props.onChange(field, value, numeric);

    }
    return (
        <Autocomplete
            freeSolo
            disableClearable
            value={value}
            getOptionLabel={item => item?.toString()}
            onChange={(event, value) => props.onChange(props.field, value, numeric)}
            options={uniqueValuesFor(props.field)}
            renderInput={(params) =>
                <TextField  {...params}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password",
                                startAdornment:
                                    <>
                                        <InputAdornment position="start">
                                            {props.inputProps?.startAdornment}
                                        </InputAdornment>{params.InputProps.startAdornment}
                                    </>,
                                endAdornment:
                                    <>
                                        <InputAdornment position="end">
                                            {props.inputProps?.endAdornment}
                                        </InputAdornment>{params.InputProps.endAdornment}
                                    </>
                            }}
                            fullWidth
                            type={props.type}
                            onChange={productChange}
                            value={value}
                            name={props.field}
                            label={props.label}
                            variant="outlined"/>}/>
    );
}
