import { Outlet } from "react-router-dom";
import { experimentalStyled } from "@material-ui/core";
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavBar from './DashboardNavBar';
import { useSetRecoilState } from 'recoil';
import { toolbarButtonState } from '../../atoms/dashboard-atoms';
import { useEffect } from 'react';

const DashboardLayoutRoot = experimentalStyled("div")(({theme}) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

const DashboardLayoutWrapper = experimentalStyled("div")(({theme}) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 256,
  },
}));

const DashboardLayoutContainer = experimentalStyled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
});

const DashboardLayoutContent = experimentalStyled("div")({
  flex: "1 1 auto",
  height: "100%",
  overflow: "auto",
});

export default function DashboardLayout() {

  const setButtonCaptions = useSetRecoilState<string[]>(toolbarButtonState);
  useEffect(() => {
    setButtonCaptions([])
  }, [])

  return (
      <DashboardLayoutRoot>
        <DashboardNavBar/>
        <DashboardSidebar/>
        <DashboardLayoutWrapper>
          <DashboardLayoutContainer>
            <DashboardLayoutContent>
              <Outlet/>
            </DashboardLayoutContent>
          </DashboardLayoutContainer>
        </DashboardLayoutWrapper>
      </DashboardLayoutRoot>);
}
