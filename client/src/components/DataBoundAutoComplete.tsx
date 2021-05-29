import { Autocomplete, TextField, } from "@material-ui/core";
import * as React from "react";
import { get, uniq } from "lodash";
import { WithUid } from "../models/common-models";
import { log } from '../util/logging-config';

export function DataBoundAutoComplete<T>(props: { field: string, label: string, type: string, document: WithUid<T>, allDocuments: WithUid<T>[], onChange: (field: string, value: any) => void }) {

    const value = get(props.document, props.field) || "";

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
        props.onChange(field, value);
    }

    return (
        <Autocomplete
            freeSolo
            disableClearable
            value={value}
            getOptionLabel={item => item?.toString()}
            onChange={(event, value) => props.onChange(props.field, value)}
            options={uniqueValuesFor(props.field)}
            renderInput={(params) =>
                <TextField  {...params}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password",
                            }}
                            fullWidth
                            type={props.type}
                            onChange={productChange}
                            value={value}
                            name={props.field}
                            label={props.label}
                            variant="outlined"/>}
        />
    );
}
