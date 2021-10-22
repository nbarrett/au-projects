import { MenuItem } from "../../models/menu-models";
import { Button } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import { log } from "../../util/logging-config";
import { SxProps } from "@mui/system";

export default function MenuButton(props: { menuItem: MenuItem, omitIcon?: boolean }) {
    const location = useLocation();
    const active = location.pathname.endsWith(props.menuItem.href);
    const buttonTheme: SxProps<Theme> = {
        color: "text.secondary",
        fontWeight: "medium",
        justifyContent: "flex-start",
        letterSpacing: 0,
        py: 1.25,
        textTransform: "none",
        width: "100%",
        ...(active && {
            color: "primary.main",
        }),
        "& svg": {
            mr: 1,
        },
    };

    log.debug("active", active, props.menuItem.href, location.pathname)

    return (
        <><Button component={NavLink}
                  sx={buttonTheme} to={props.menuItem.href}>
            {props.omitIcon ? null : <props.menuItem.icon/>}
            <span>{props.menuItem.title}</span>
        </Button></>
    );
}
