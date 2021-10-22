import { BrowserRouter } from "react-router-dom";
import GlobalStyles from "../../admin/components/GlobalStyles";
import React, { Suspense } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { RecoilRoot } from "recoil";
import { theme } from "../../theme";
import LoadingDiv from "../../components/LoadingDiv";
import AppRoutes from "./AppRoutes";
import { WithSnackBar } from "./WithSnackBar";

export default function AppContainer(): JSX.Element {

    return (
        <RecoilRoot>
            <BrowserRouter>
                <Suspense fallback={<LoadingDiv/>}>
                    <ThemeProvider theme={theme}>
                        <WithSnackBar>
                            <CssBaseline/>
                            <GlobalStyles/>
                            <AppRoutes/>
                        </WithSnackBar>
                    </ThemeProvider>
                </Suspense>
            </BrowserRouter>
        </RecoilRoot>);
}
