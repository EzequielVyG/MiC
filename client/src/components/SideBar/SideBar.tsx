import * as React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { SxProps } from "@mui/material";

const drawerWidth = 240;

type Tab = {
  label: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  hidden: boolean;
};

type SideBarProps = {
  tabs?: Tab[];
  onTabSelect: any;
  sx: SxProps;
  selectedTab?: number;
};

export default function SideBar(props: SideBarProps) {
  const drawer = (
    <div>
      <List>
        {props.tabs
          ? props.tabs.map((tab, index) => (
              <ListItem
                key={tab.label}
                sx={{ display: tab.hidden ? "none" : "block" }}
                disablePadding
              >
                <ListItemButton onClick={() => props.onTabSelect(index)}>
                  <ListItemIcon>{tab.icon}</ListItemIcon>
                  <ListItemText primary={tab.label} />
                </ListItemButton>
              </ListItem>
            ))
          : null}
      </List>
    </div>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          ...props.sx,
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            marginTop: "75px",
            position: "absolute",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
}
