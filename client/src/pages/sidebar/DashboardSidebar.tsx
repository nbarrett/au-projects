import { Box, Divider, Drawer, List, } from "@mui/material";
import { useRecoilState } from "recoil";
import { mobileNavOpenState } from "../../atoms/dashboard-atoms";
import { lgDownHidden, lgUpHidden } from "../../display/display";
import NavItem from "../../admin/components/NavItem";
import * as React from "react";
import { SidebarAvatar } from "./SidebarAvatar";
import useMenuOptions from "../../hooks/use-menu-options";

export default function DashboardSidebar() {
    const [mobileNavOpen, setMobileNavOpen] = useRecoilState<boolean>(mobileNavOpenState);
    const menuOptions = useMenuOptions();
    const content = (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }}><SidebarAvatar/>
            <Divider/>
            <Box sx={{p: 2}}>
                <List>{menuOptions.navItems.map((item) => <NavItem key={item.href} menuItem={item}/>)}
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
