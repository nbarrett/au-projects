import { Link as RouterLink } from "react-router-dom";
import { Avatar, Box, Divider, Drawer, List, Typography, } from "@material-ui/core";
import {
    BarChart,
    Settings,
    ShoppingBag as ShoppingBagIcon,
    ShoppingCart,
    User as UserIcon,
    Users as UsersIcon,
} from "react-feather";
import { useRecoilState, useRecoilValue } from "recoil";
import { FirebaseUser } from "../../models/authentication-models";
import { currentUserDataState, currentUserState } from "../../atoms/user-atoms";
import { mobileNavOpenState } from "../../atoms/dashboard-atoms";
import { AppRoute } from "../../constants";
import { UserData } from "../../models/user-models";
import { lgDownHidden, lgUpHidden } from "../../display/display";
import { MenuItem } from "../../models/menu-models";
import NavItem from "./NavItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import * as React from "react";
import { ProductCodingType } from "../../models/product-models";
import { productRoute } from "../../mappings/product-mappings";

const navItems: MenuItem[] = [
    {
        href: AppRoute.USERS,
        icon: UsersIcon,
        title: "Users",
    },
    {
        href: AppRoute.COMPANIES,
        icon: UsersIcon,
        title: "Companies",
    },
    {
        href: AppRoute.PRODUCTS,
        icon: ShoppingBagIcon,
        title: "Products",
        subItems: [
            {
                href: productRoute(ProductCodingType.COMPOUND),
                title: "Compounds",
            },
            {
                href: productRoute(ProductCodingType.COLOUR),
                title: "Colours",
            },
            {
                href: productRoute(ProductCodingType.CURING_METHOD),
                title: "Curing Methods",
            },
            {
                href: productRoute(ProductCodingType.GRADE),
                title: "Grades",
            },
            {
                href: productRoute(ProductCodingType.HARDNESS),
                title: "Hardnesses",
            }]
    },
    {
        href: AppRoute.PRICES,
        icon: ShoppingCart,
        title: "Prices",
        subItems: [{
            href: AppRoute.PRICING_SETUP,
            icon: Settings,
            title: "Pricing Setup",
        }]
    },
    {
        href: AppRoute.ACCOUNT,
        icon: UserIcon,
        title: "Account",
        subItems: [{
            href: AppRoute.SETTINGS,
            icon: Settings,
            title: "Settings",
        }]
    },
    {
        href: AppRoute.EXAMPLE_DASHBOARD,
        icon: BarChart,
        title: "Example Dashboard",
    },
];

export default function DashboardSidebar() {
    const user = useRecoilValue<FirebaseUser>(currentUserState);
    const userData = useRecoilValue<UserData>(currentUserDataState);
    const [mobileNavOpen, setMobileNavOpen] = useRecoilState<boolean>(mobileNavOpenState);
    const content = (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                }}
            >
                <Avatar
                    component={RouterLink}
                    src={userData.avatarUrl}
                    sx={{
                        cursor: "pointer",
                        width: 64,
                        height: 64,
                    }}
                    to="/app/account"
                />
                <Typography color="textPrimary" variant="h5">
                    {user?.email}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                    {`${userData.firstName} ${userData.lastName}`}
                </Typography>
            </Box>
            <Divider/>
            <Box sx={{p: 2}}>
                <List subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Back Office Menu
                    </ListSubheader>
                }>{navItems.map((item) => <NavItem key={item.href} menuItem={item}/>)}
                </List>
            </Box>
            <Box sx={{flexGrow: 1}}/>
        </Box>
    );

    return (
        <>
            <Box sx={lgUpHidden}>
                <Drawer
                    anchor="left"
                    onClose={() => setMobileNavOpen(false)}
                    open={mobileNavOpen}
                    variant="temporary"
                    PaperProps={{sx: {width: 256}}}>
                    {content}
                </Drawer>
            </Box>
            <Box sx={lgDownHidden}>
                <Drawer
                    anchor="left"
                    open
                    variant="persistent"
                    PaperProps={{
                        sx: {
                            width: 256, top: 64, height: "calc(100% - 64px)",
                        },
                    }}>
                    {content}
                </Drawer>
            </Box>
        </>
    );
}
