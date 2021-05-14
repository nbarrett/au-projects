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
import { useRecoilValue } from 'recoil';
import { FirebaseUser, UserData } from '../../models/auth-models';
import { currentUserDataState, currentUserState } from '../../atoms/user-atoms';

const dummyUser = {
  avatar: "/static/images/avatars/nick.png",
};

const items = [
  {
    href: "/app/dashboard",
    icon: BarChartIcon,
    title: "Dashboard",
  },
  {
    href: "/app/customers",
    icon: UsersIcon,
    title: "Customers",
  },
  {
    href: "/app/products",
    icon: ShoppingBagIcon,
    title: "Products",
  },
  {
    href: "/app/account",
    icon: UserIcon,
    title: "Account",
  },
  {
    href: "/app/settings",
    icon: SettingsIcon,
    title: "Settings",
  },
];

export default function DashboardSidebar(props: {
  onMobileClose: () => any;
  openMobile: boolean;
}) {
  const user = useRecoilValue<FirebaseUser>(currentUserState);
  const userData = useRecoilValue<UserData>(currentUserDataState);

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
              src={dummyUser.avatar}
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
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={props.onMobileClose}
          open={props.openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256,
            },
          }}
        >
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
              width: 256,
              top: 64,
              height: "calc(100% - 64px)",
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
}
