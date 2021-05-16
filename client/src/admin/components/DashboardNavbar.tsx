import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { AppBar, Badge, Box, Hidden, IconButton, Toolbar, } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";
import Logo from "./Logo";
import { useLogout } from "../../auth/logout";
import { useSetRecoilState } from "recoil";
import { mobileNavOpenState } from "../../atoms/dashboard-atoms";

export default function DashboardNavbar({...rest}) {
  const [notifications] = useState([]);
  const setMobileNavOpen = useSetRecoilState<boolean>(mobileNavOpenState);
  const logout = useLogout();
  return (
      <AppBar elevation={0} {...rest}>
        <Toolbar>
          <RouterLink to="/">
            <Logo/>
          </RouterLink>
          <Box sx={{flexGrow: 1}}/>
          <Hidden lgDown>
            <IconButton color="inherit">
              <Badge
                  badgeContent={notifications.length}
                  color="primary"
                  variant="dot"
              >
                <NotificationsIcon/>
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={logout}>
              <InputIcon/>
            </IconButton>
          </Hidden>
          <Hidden lgUp>
            <IconButton color="inherit" onClick={() => setMobileNavOpen(true)}>
              <MenuIcon/>
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>
  );
};

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func,
};

