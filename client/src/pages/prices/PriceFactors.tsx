import * as React from "react";
import { useState } from "react";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Card, Grid, InputAdornment, TextField, } from "@mui/material";
import { log } from "../../util/logging-config";
import clsx from "clsx";
import CompanySelector from "../common/CompanySelector";

export default function PriceFactors() {
    const [percentLosses, setPercentLosses] = useState<number>(10);
    const [markup, setMarkup] = useState<number>(192.5);

    const cardStyle = {p: 4, m: 2};

  const useStyles = makeStyles((theme: Theme) => ({
    input: {
      width: 400
    }
  }));

  const classes = useStyles();

  return (
      <Card sx={cardStyle}>
        <Grid container spacing={2}>
          <Grid item xs>
            <CompanySelector/>
          </Grid>
          <Grid item xs>
            <TextField className={clsx(classes.input)}
                       InputProps={{
                         endAdornment: <InputAdornment position="start">%</InputAdornment>,
                       }}
                       size={"small"}
                       type={"number"}
                       label="Losses"
                       value={percentLosses}
                       onChange={(value) => {
                         const losses = value.target.value;
                         log.debug("value:", losses)
                         setPercentLosses(+losses)
                       }}
            >
            </TextField>
          </Grid>
          <Grid item xs>
            <TextField className={clsx(classes.input)}
                       InputProps={{
                         endAdornment: <InputAdornment position="start">%</InputAdornment>,
                       }}
                       size={"small"}
                       type={"number"}
                       label="Full Price Factor"
                       value={markup}
                       onChange={(value) => {
                         const markup = value.target.value;
                         log.debug("value:", markup)
                         setMarkup(+markup)
                       }}>
            </TextField>
          </Grid>
        </Grid>
      </Card>
  );
}
