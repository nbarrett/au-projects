import CompanySelector from "../common/CompanySelector";
import { GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import * as React from "react";

export function CustomToolbar() {
    return (
        <><CompanySelector/>
            <GridToolbarContainer>
                <GridToolbar/>
            </GridToolbarContainer></>);
}
