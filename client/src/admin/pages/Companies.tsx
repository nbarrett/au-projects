import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import { useSetRecoilState } from 'recoil';
import { toolbarButtonState } from '../../atoms/dashboard-atoms';
import { useEffect } from 'react';
import { log } from '../../util/logging-config';

export default function Companies() {
    const setButtonCaptions = useSetRecoilState<string[]>(toolbarButtonState);
    useEffect(() => {
        log.info("CustomerListResults triggered");
        setButtonCaptions(["add company", "export", "import"])
    },[])

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
                        <div>to add</div>
                        {/*<CustomerListResults customers={customers}/>*/}
                    </Box>
                </Container>
            </Box>
        </>
    );
}
