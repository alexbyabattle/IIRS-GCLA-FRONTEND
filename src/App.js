import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Home from "./scenes/Home/Home";
import DeviceTable from "./scenes/device/DeviceTable";
import UserTable from "./scenes/User/UserTable";
import IswTable from "./scenes/isw/IswTable";
import Register from "./scenes/Authentication/register";
import Login from "./scenes/Authentication/Login";
import DeviceDetails from "./scenes/device/DeviceDetails";
import UserDetails from "./scenes/User/UserDetails";
import IncidentTable from "./scenes/incident/IncidentTable";
import Request from "./scenes/Requests/request";
import ReportIncident from "./scenes/Reportpage/ReportIncident";
import RequestPage from "./scenes/Reportpage/ReporrtRequest";
import IncidentDetails from "./scenes/incident/IncidentDetails";
import RequestDetails from "./scenes/incident/RequestDetails";
import Incidents from "./scenes/Requests/Incidents";
import AdminRequest from "./scenes/incident/RequestTable";
import ReportForm from "./scenes/Reportpage/IncidentForm";
import RequestForm from "./scenes/Reportpage/RequestForm";
import LandingPage from "./scenes/LandingPages/LandingPage";
import NotFoundPage from "./scenes/NotFoundPage/NotFoundPage";
import ProtectedRoute from "./scenes/NotFoundPage/ProtectedRoutes";
import EachUserDetails from "./scenes/User/EachUserDeatails";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  // Function to determine whether to display Sidebar
  const displaySidebar = () => {
    return !['/home', '/login', '/', '/register', '/reportForm',  '/incidentForm/:id' ].includes(location.pathname) && 
           !location.pathname.startsWith('/incidentForm/') && 
           !location.pathname.startsWith('/requestForm/'); 
  };

  // Function to determine whether to display toolbar
  const displayToolbar = () => {
    return !['/home', '/', '/register', '/login', '/incidentDetails/:id'].includes(location.pathname);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {displaySidebar() && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {displayToolbar() && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />

              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={['ADMIN', 'USER', 'MANAGER']} />} />
              <Route path="/team" element={<Team />} />
              <Route path="/deviceDetails/:id" element={<ProtectedRoute element={<DeviceDetails />} allowedRoles={['ADMIN' , 'MANAGER']} />} />
              <Route path="/userDetails/:id" element={<ProtectedRoute element={<UserDetails />} allowedRoles={['ADMIN', 'USER', 'MANAGER']} />} />
              <Route path="/eachUserDetails/:id" element={<ProtectedRoute element={<EachUserDetails />} allowedRoles={['ADMIN', 'MANAGER']} />} />
              <Route path="/incidentForm/:id" element={<ProtectedRoute element={<ReportForm />} allowedRoles={['ADMIN', 'USER', 'MANAGER']} />} />
              <Route path="/requestForm/:id" element={<ProtectedRoute element={<RequestForm />} allowedRoles={['ADMIN', 'USER', 'MANAGER']} />} />
              <Route path="/device" element={<ProtectedRoute element={<DeviceTable />} allowedRoles={['ADMIN' , 'MANAGER']} />} />
              <Route path="/user" element={<ProtectedRoute element={<UserTable />} allowedRoles={['ADMIN', 'MANAGER']} />} />
              <Route path="/isw" element={<ProtectedRoute element={<IswTable />} allowedRoles={['ADMIN', 'MANAGER']} />} />
              <Route path="/incidents" element={<ProtectedRoute element={<Incidents />} allowedRoles={['ADMIN', 'USER', 'MANAGER']} />}/>
              <Route path="/incidentDetails/:id" element={<ProtectedRoute element={<IncidentDetails />} allowedRoles={['ADMIN', 'MANAGER']} />} />
              <Route path="/requestDetails/:id" element={<ProtectedRoute element={<RequestDetails />} allowedRoles={['ADMIN', 'MANAGER']} />} />
              <Route path="/report" element={<ProtectedRoute element={<ReportIncident />} allowedRoles={[ 'USER', 'MANAGER']} />} />
        
              <Route path="/request" element={<ProtectedRoute element={<RequestPage />} allowedRoles={['ADMIN', 'USER', 'MANAGER']} />} />
              <Route path="/viewRequest" element={<ProtectedRoute element={<Request />} allowedRoles={['ADMIN', 'USER', 'MANAGER']} />} />
              <Route path="/allRequest" element={<ProtectedRoute element={<AdminRequest />} allowedRoles={['ADMIN', 'USER', 'MANAGER']} />} />
              <Route path="/incident" element={<ProtectedRoute element={<IncidentTable />} allowedRoles={['ADMIN', 'USER', 'MANAGER']} />} />
              <Route path="/notFound"  element={<NotFoundPage />} />

              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/form" element={<Form />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />

              {/* Default Route */}
              <Route path="*" element={<Navigate to="/notFound" />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
