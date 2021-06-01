import { Link as RouterLink } from "react-router-dom";
import { Avatar, Box, Divider, Drawer, Hidden, List, Typography, } from "@material-ui/core";
import {
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    ShoppingBag as ShoppingBagIcon,
    User as UserIcon,
    Users as UsersIcon,
} from "react-feather";
import NavItem from "./NavItem";
import { useRecoilState, useRecoilValue } from "recoil";
import { FirebaseUser} from "../../models/authentication-models";
import { currentUserDataState, currentUserState } from "../../atoms/user-atoms";
import { mobileNavOpenState } from "../../atoms/dashboard-atoms";
import { AppRoute } from "../../constants";
import { UserData } from "../../models/user-models";

const navItems = [
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
    },
    {
        href: AppRoute.ACCOUNT,
        icon: UserIcon,
        title: "Account",
    },
    {
        href: AppRoute.SETTINGS,
        icon: SettingsIcon,
        title: "Settings",
    },
    {
        href: AppRoute.EXAMPLE_DASHBOARD,
        icon: BarChartIcon,
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
                <List>
                    {navItems.map((item) => (
                        <NavItem
                            href={item.href}
                            key={item.title}
                            title={item.title}
                            icon={item.icon}
                        />
                    ))}
                </List>
            </Box>
            <Box sx={{flexGrow: 1}}/>
        </Box>
    );

    return (
        <>
            <Hidden lgUp>
                <Drawer
                    anchor="left"
                    onClose={() => setMobileNavOpen(false)}
                    open={mobileNavOpen}
                    variant="temporary"
                    PaperProps={{sx: {width: 256,},}}>
                    {content}
                </Drawer>
            </Hidden>
            <Hidden lgDown>
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
            </Hidden>
        </>
    );
}
