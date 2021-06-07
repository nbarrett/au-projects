import { Box, Button, } from "@material-ui/core";
import { useRecoilValue } from "recoil";
import * as React from "react";
import { useEffect } from "react";
import { ToolbarButton } from "../../../models/toolbar-models";
import { toolbarButtonState } from "../../../atoms/navbar-atoms";
import { log } from "../../../util/logging-config";

export default function ToolbarButtons() {
    const toolbarButtons = useRecoilValue<ToolbarButton[]>(toolbarButtonState);

    useEffect(() => {
        log.debug("ToolbarButtons rendering:", toolbarButtons);
    }, [])

    return (
        <Box sx={{display: {xs: "none", md: "none", lg: "flex"}}}>
            {toolbarButtons.map((caption, index) => typeof caption === "string" ?
                <Button key={caption || index} sx={{mx: 1}} color="primary"
                        variant="contained">{caption}</Button> : caption)}
        </Box>
    );
}
