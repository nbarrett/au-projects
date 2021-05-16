import { Box, Button, } from "@material-ui/core";
import { useRecoilValue } from 'recoil';
import { toolbarButtonState } from '../../../atoms/dashboard-atoms';

export default function ToolbarButtons() {
    const buttonCaptions = useRecoilValue<string[]>(toolbarButtonState);
    return (
        <Box>
            {buttonCaptions.map(caption => <Button key={caption} sx={{mx: 1}} color="primary" variant="contained">{caption}</Button>)}
        </Box>
    );
}
