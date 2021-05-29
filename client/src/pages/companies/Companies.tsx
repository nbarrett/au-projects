import { Helmet } from "react-helmet";
import { Box, Button, Container } from "@material-ui/core";
import { useSetRecoilState } from "recoil";
import * as React from "react";
import { useEffect } from "react";
import CompaniesList from "./CompaniesList";
import { ToolbarButton } from "../../models/toolbar-models";
import { toolbarButtonState } from "../../atoms/navbar-atoms";
import useCompanyData from '../../hooks/use-company-data';

export default function Companies() {
    const setToolbarButtons = useSetRecoilState<ToolbarButton[]>(toolbarButtonState);

    useEffect(() => {
        setToolbarButtons([
            "export",
            "import"])
    })

    return (
        <>
            <Helmet>
                <title>Companies | AU Projects</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 3,
                }}
            >
                <Container maxWidth={false}>
                    <Box sx={{pt: 3}}>
                        <CompaniesList/>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
