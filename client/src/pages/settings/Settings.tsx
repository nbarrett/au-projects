import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import SettingsNotifications from "../../admin/components/settings/SettingsNotifications";
import { SettingsPassword } from "../../admin/components/settings/SettingsPassword";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { ToolbarButton } from "../../models/toolbar-models";
import { toolbarButtonState } from "../../atoms/navbar-atoms";

export function Settings() {
    const setToolbarButtons = useSetRecoilState<ToolbarButton[]>(toolbarButtonState);
    useEffect(() => {
        setToolbarButtons([])
    }, [])
    return (
        <>
            <Helmet>
                <title>Settings | AU Projects</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 3,
                }}
            >
                <Container maxWidth="lg">
                    <SettingsNotifications/>
                    <Box sx={{pt: 3}}>
                        <SettingsPassword/>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
