import * as React from "react";
import { useEffect, useState } from "react";
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
import MoreIcon from "@material-ui/icons/MoreVert";
import Logo from "./Logo";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { mobileNavOpenState } from "../../atoms/dashboard-atoms";
import { useLogout } from "../../hooks/use-logout";
import InputIcon from "@material-ui/icons/Input";
import { Tooltip } from "@material-ui/core";
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
