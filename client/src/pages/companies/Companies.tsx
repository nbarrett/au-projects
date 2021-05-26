import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { log } from "../../util/logging-config";
import CompaniesList from "./CompaniesList";
import { COMPANIES } from "../../admin/__mocks__/companies";
import { ToolbarButton } from "../../models/toolbar-models";
import { toolbarButtonState } from "../../atoms/navbar-atoms";
import { useLocation } from "react-router-dom";

export default function Companies() {
    const setToolbarButtons = useSetRecoilState<ToolbarButton[]>(toolbarButtonState);
    const location = useLocation();

    useEffect(() => {
        log.info("Companies rendered:", location);
        setToolbarButtons(["add company", "export", "import"])
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
                        <CompaniesList companies={COMPANIES}/>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
