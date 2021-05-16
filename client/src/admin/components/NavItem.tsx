import { matchPath, NavLink as RouterLink, useLocation, } from "react-router-dom";
import { Button, ListItem } from "@material-ui/core";
import { Icon } from "react-feather";

export default function NavItem(props: { href: string, icon: Icon, title: string, rest?: any[] }) {
    const location = useLocation();
    const active = props.href
        ? !!matchPath(
            {
                path: props.href,
                end: false,
            },
            location.pathname
        )
        : false;

    return (
        <ListItem
            disableGutters
            sx={{
                display: "flex",
                py: 0,
            }}
            {...props.rest}
        >
            <Button
                component={RouterLink}
                sx={{
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
                }}
                to={props.href}
            >
                {props.icon && <props.icon size="20"/>}
                <span>{props.title}</span>
            </Button>
        </ListItem>
    );
};
