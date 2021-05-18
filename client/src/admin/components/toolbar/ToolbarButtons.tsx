import { Box, Button, } from "@material-ui/core";
import { useRecoilValue } from 'recoil';
import { toolbarButtonState } from '../../../atoms/dashboard-atoms';
import * as React from 'react';

export default function ToolbarButtons() {
    const buttonCaptions = useRecoilValue<string[]>(toolbarButtonState);
    return (
        <Box sx={{display: {xs: "none", md: "none", lg:"flex"}}}>
            {buttonCaptions.map(caption => <Button key={caption} sx={{mx: 1}} color="primary" variant="contained">{caption}</Button>)}
        </Box>
    );
}
