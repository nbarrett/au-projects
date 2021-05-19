import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import SettingsNotifications from "../../components/settings/SettingsNotifications";
import { SettingsPassword } from '../../components/settings/SettingsPassword';
import { useSetRecoilState } from 'recoil';
import { toolbarButtonState } from '../../../atoms/dashboard-atoms';
import { useEffect } from 'react';

export function Settings() {
    const setButtonCaptions = useSetRecoilState<string[]>(toolbarButtonState);
    useEffect(() => {
        setButtonCaptions([])
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
