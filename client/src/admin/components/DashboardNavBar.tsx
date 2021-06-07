import * as React from "react";
import { alpha, experimentalStyled as styled } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import Logo from "./Logo";
import { Link as RouterLink } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { mobileNavOpenState } from "../../atoms/dashboard-atoms";
import { useLogout } from "../../auth/logout";
import InputIcon from "@material-ui/icons/Input";
import { Tooltip } from "@material-ui/core";
import ToolbarButtons from "./toolbar/ToolbarButtons";
import { useNavbarSearch } from "../../use-navbar-search";

export const Search = styled("div")(({theme}) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    }, [theme.breakpoints.up("lg")]: {
        marginLeft: theme.spacing(3),
        minWidth: 800,
    },
}));

export const SearchIconWrapper = styled("div")(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

export default function DashboardNavBar() {
    const navbarSearch = useNavbarSearch();
    const setMobileNavOpen = useSetRecoilState<boolean>(mobileNavOpenState);
    const logout = useLogout();
    const [
        mobileMoreAnchorEl,
        setMobileMoreAnchorEl,
    ] = React.useState<null | HTMLElement>(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                        <MailIcon/>
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton aria-label="show 11 new notifications" color="inherit">
                    <Badge badgeContent={11} color="secondary">
                        <NotificationsIcon/>
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem>
                <IconButton color="inherit" onClick={logout}>
                    <InputIcon/>
                </IconButton>
                <p>Logout</p>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar elevation={0}>
                <Toolbar>
                    <RouterLink to="/">
                        <Logo/>
                    </RouterLink>
                    <Typography variant="h3"
                                noWrap
                                component="div"
                                sx={{display: {marginLeft: 15, xs: "none", sm: "block"}}}>AU Projects</Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase value={navbarSearch.search}
                                         onChange={(event) => navbarSearch.onChange(event.target.value)}
                                         placeholder="Search…"
                                         inputProps={{"aria-label": "search"}}
                        />
                    </Search>

                    <Box sx={{flexGrow: 1}}/>
                    <ToolbarButtons/>
                    <Box sx={{display: {xs: "none", md: "flex"}}}>
                        <Tooltip title={"Show new emails (doesn't do anything yet)"}>
                            <IconButton aria-label="show 4 new mails" color="inherit">
                                <Badge badgeContent={4} color="secondary">
                                    <MailIcon/>
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Show new notifications (doesn't do anything yet)"}>
                            <IconButton aria-label="show 17 new notifications" color="inherit">
                                <Badge badgeContent={17} color="secondary">
                                    <NotificationsIcon/>
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Logout from portal"}>
                            <IconButton color="inherit" onClick={logout}>
                                <InputIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{display: {xs: "flex", md: "none"}}}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon/>
                        </IconButton>
                        <IconButton onClick={() => setMobileNavOpen(true)}
                                    edge="start"
                                    color="inherit"
                                    aria-label="open drawer"
                                    sx={{mr: 2}}>
                            <MenuIcon/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
        </Box>
    );
}
