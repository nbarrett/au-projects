import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Collapse from "@material-ui/core/Collapse";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import * as React from "react";
import { MenuItem } from "../../models/menu-models";
import MenuButton from "./MenuButton";
import Box from "@material-ui/core/Box";
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
