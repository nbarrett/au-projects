import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import * as React from "react";
import { MenuItem } from '../../models/menu-models';
import MenuButton from './MenuButton';
import Box from '@material-ui/core/Box';

export default function NavItem(props: { menuItem: MenuItem }) {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => setOpen(!open);
    return (
        <>
            <ListItem disableGutters
                      sx={{display: "flex", py: 0,}}>
                <MenuButton menuItem={props.menuItem}/>
                {props.menuItem.subItems && <Box onClick={handleClick}>{open ? <ExpandLess/> : <ExpandMore/>}</Box>}
            </ListItem>
            {props.menuItem.subItems && <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <>{props.menuItem.subItems?.map(item => <ListItem key={item.href} disableGutters
                                                                      sx={{display: "flex", py: 0, pl: 4}}>
                        <ListItemIcon>
                            <MenuButton menuItem={item}/>
                        </ListItemIcon>
                    </ListItem>)}
                    </>
                </List>
            </Collapse>}
        </>
    );
};
