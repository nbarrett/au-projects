import * as React from "react";
import { Grid } from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import Typography from "@mui/material/Typography";

export default function Loading(props: { text?: string, children: any, busy: boolean }) {
    return (
        props.busy ? <Grid container justifyContent="center" spacing={1}>
            <Grid item>
                <RotateLeftIcon color={"primary"}/>
            </Grid>
            <Grid item>
                <Typography variant={"h4"}>{props.text || "loading"}</Typography>
            </Grid>
        </Grid> : props.children);
}

