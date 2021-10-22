import React from "react";
import { TextField, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import max from "lodash/max";

export function NumericInput(props: { onFocus?: () => any, value: number, maxValue?: number, onChange: (value: number) => void, disabled: boolean, incrementDisabled?: boolean, decrementDisabled?: boolean }) {

    const iconSx = {cursor: "pointer", p: 0, m: 0};
    const classes = makeStyles((theme: Theme) => ({
        input: {
            width: 100,
            "& .MuiOutlinedInput-input": {textAlign: "center"}
        },
    }))({});

    function handleIncrement() {
        !props.disabled && !props.incrementDisabled && props.onChange(props.value + 1);
    }


    function handleDecrement() {
        !props.disabled && !props.decrementDisabled && props.value > 0 && props.onChange(props.value - 1);
    }


    return <TextField onFocus={props.onFocus} className={classes.input} size={"small"}
                      inputProps={{inputMode: "numeric", pattern: "[0-9]*"}}
                      disabled={props.disabled}
                      type={"text"}
                      onChange={(event: any) => {
                          props.onChange(max([+event.target.value, props.maxValue]));
                      }}
                      value={props.value}
                      name={"quantity"}
                      variant={"outlined"}
                      InputProps={{
                          startAdornment: <Tooltip title={"Decrement quantity"}>
                              <ChevronLeftIcon onClick={handleDecrement} sx={iconSx}
                                               color={props.disabled || props.value === 0 ? "disabled" : "action"}
                                               fontSize="small"/>
                          </Tooltip>,
                          endAdornment: <Tooltip title={"Increment quantity"}>
                              <ChevronRightIcon onClick={handleIncrement} sx={iconSx}
                                                color={props.disabled ? "disabled" : "action"} fontSize="small"/>
                          </Tooltip>
                      }}/>;
}
