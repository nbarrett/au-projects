import * as React from "react";
import { useEffect, useState } from "react";
import { alpha, experimentalStyled as styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";
import Logo from "./Logo";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { mobileNavOpenState } from "../../atoms/dashboard-atoms";
import { useLogout } from "../../hooks/use-logout";
import InputIcon from "@mui/icons-material/Input";
import { Tooltip } from "@mui/material";
import ToolbarButtons from "./toolbar/ToolbarButtons";
import { useNavbarSearch } from "../../hooks/use-navbar-search";
import { WithUid } from "../../models/common-models";
import { Order, OrderStatus } from "../../models/order-models";
import { ordersState } from "../../atoms/order-atoms";
import { pluralise, pluraliseWithCount } from "../../util/strings";
import { useUpdateUrl } from "../../hooks/use-url-updating";
import { toAppRoute } from "../../mappings/route-mappings";
import { AppRoute } from "../../models/route-models";
import { ShoppingCart } from "react-feather";
import useOrders from "../../hooks/use-orders";
import useCurrentUser from "../../hooks/use-current-user";

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
    const updateUrl = useUpdateUrl();
    const currentUser = useCurrentUser();
    const navbarSearch = useNavbarSearch();
    const setMobileNavOpen = useSetRecoilState<boolean>(mobileNavOpenState);
    const logout = useLogout();
    const orders = useOrders();
    const orderHistory = useRecoilValue<WithUid<Order>[]>(ordersState);
    const unsubmittedOrderCount = orderHistory.filter(item => item.data.status < OrderStatus.CANCELLED).length;
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu anchorEl={mobileMoreAnchorEl}
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
              onClose={handleMobileMenuClose}>
            <MenuItem onClick={() => updateUrl({path: toAppRoute(AppRoute.ORDERS)})}>
                <IconButton
                    aria-label={`Show ${pluraliseWithCount(unsubmittedOrderCount, "unsubmitted order")}`}
                    color="inherit">
                    <Badge badgeContent={unsubmittedOrderCount} color="secondary">
                        <ShoppingCart/>
                    </Badge>
                </IconButton>
                <p>{`${pluralise(unsubmittedOrderCount, "Unsubmitted order")}`}</p>
            </MenuItem>
            <MenuItem onClick={() => logout("DashboardNavBar")}>
                <IconButton color="inherit">
                    <InputIcon/>
                </IconButton>
                <p>Logout</p>
            </MenuItem>
        </Menu>
    );

    useEffect(() => {
        orders.refreshOrders();
    }, [currentUser.document.data?.companyId]);

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
                        <Tooltip title={`Show ${pluraliseWithCount(unsubmittedOrderCount, "unsubmitted order")}`}
                                 color="inherit">
                            <IconButton color="inherit" onClick={() => updateUrl({path: toAppRoute(AppRoute.ORDERS)})}>
                                <Badge badgeContent={unsubmittedOrderCount} color="secondary">
                                    <ShoppingCart/>
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Logout from portal"}>
                            <IconButton color="inherit" onClick={() => logout("DashboardNavBar")}>
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
