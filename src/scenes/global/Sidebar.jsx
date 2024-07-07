import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { DeviceHub, RequestPageOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import image from "../../data/image";
import { ReportProblemOutlined } from "@mui/icons-material";
import { CheckCircleOutline } from "@mui/icons-material";
import { Report } from "@mui/icons-material";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    // Get user role and department from local storage
    const userRole = localStorage.getItem("role");
    const userDepartment = localStorage.getItem("department");
    
    setRole(userRole);
    setDepartment(userDepartment);
  }, []);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  GCLA-IIRS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="gcla admin"
                  width="100px"
                  height="100px"
                  src={image.gcla}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Government Chemist Laboratory Authority
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {role === "ADMIN" || (role === "MANAGER" && department === "IT") ? (
              <>
                <Item
                  title="DASHBOARD"
                  to="/dashboard"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="DEVICES"
                  to="/device"
                  icon={<DeviceHub />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="USERS"
                  to="/user"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="ISW"
                  to="/isw"
                  icon={<CheckCircleOutline />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="ALL INCIDENTS"
                  to="/incident"
                  icon={<ReportProblemOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="ALL REQUESTS"
                  to="/allRequest"
                  icon={<Report />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="REQUISITION FORM"
                  to="/request"
                  icon={<RequestPageOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            ) : (
              <>
                <Item
                  title="DASHBOARD"
                  to="/dashboard"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="REQUISITION FORM"
                  to="/request"
                  icon={<RequestPageOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="REPORT INCIDENT"
                  to="/report"
                  icon={<Report />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="REQUESTS"
                  to="/viewRequest"
                  icon={<ReportProblemOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="INCIDENTS"
                  to="/incidents"
                  icon={<Report />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
