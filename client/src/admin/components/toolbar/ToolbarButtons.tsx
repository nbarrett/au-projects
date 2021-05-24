import { Box, Button, } from "@material-ui/core";
import { useRecoilValue } from 'recoil';
import * as React from 'react';
import { ToolbarButton } from '../../../models/toolbar-models';
import { toolbarButtonState } from '../../../atoms/navbar-atoms';
import { log } from '../../../util/logging-config';
import { useEffect } from 'react';
import { findAll } from '../../../data-services/firebase-services';
import { AuthenticatedUserData } from '../../../models/authentication-models';

export default function ToolbarButtons() {
    const toolbarButtons = useRecoilValue<ToolbarButton[]>(toolbarButtonState);
    log.info("buttons to render:", toolbarButtons);

    useEffect(() => {
        log.info("initial render:", toolbarButtons);
    }, [])

    return (
        <Box sx={{display: {xs: "none", md: "none", lg: "flex"}}}>
            {toolbarButtons.map(caption => typeof caption === "string" ?
                <Button key={caption} sx={{mx: 1}} color="primary" variant="contained">{caption}</Button> : caption)}
        </Box>
    );
}
