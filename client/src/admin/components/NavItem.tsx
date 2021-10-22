import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import * as React from "react";
import { MenuItem } from "../../models/menu-models";
import MenuButton from "./MenuButton";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";
import { log } from "../../util/logging-config";

export default function NavItem(props: { menuItem: MenuItem }) {
    const location = useLocation();
    const active: boolean = location.pathname.includes(props.menuItem.href);
    log.debug(props.menuItem, "active:", active)
    const [open, setOpen] = React.useState(active);
    const handleClick = () => setOpen(!open);
    return (
        <>
            <ListItem onClick={handleClick} disableGutters
                      sx={{display: "flex", py: 0,}}>
                <MenuButton menuItem={props.menuItem}/>
                {props.menuItem.subItems &&
                <Box>{open ? <ExpandMore/> :
                    <ChevronRightIcon/>}</Box>}
            </ListItem>
            {props.menuItem.subItems && <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <>{props.menuItem.subItems?.map(item => <ListItem key={item.href} disableGutters
                                                                      sx={{display: "flex", py: 0, pl: 4}}>
                        <ListItemIcon>
                            <MenuButton menuItem={item} omitIcon/>
                        </ListItemIcon>
                    </ListItem>)}
                    </>
                </List>
            </Collapse>}
        </>
    );
};
