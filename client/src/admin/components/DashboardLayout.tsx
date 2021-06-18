import { Outlet } from "react-router-dom";
import { experimentalStyled } from "@material-ui/core";
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavBar from "./DashboardNavBar";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { ToolbarButton } from "../../models/toolbar-models";
import { toolbarButtonState } from "../../atoms/navbar-atoms";

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
  flex: "1 1 auto ",
  height: "100%",
  overflow: "auto",
});

export default function DashboardLayout() {

  const setToolbarButtons = useSetRecoilState<ToolbarButton[]>(toolbarButtonState);
  useEffect(() => {
    setToolbarButtons([])
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
