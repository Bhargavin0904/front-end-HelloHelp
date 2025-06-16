/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import logo from "assets/images/app_logo_horrizontal.png";

import CallDetails from "layouts/billing/components/CallDetails";
import AgentDetails from "layouts/tables/data/AgentDetails";
import CustomerDetails from "layouts/tables/data/CustomerDetails";
import ProtectedRoute from "layouts/components/ProtectedRoute";
// import AdminNotificationPage from "layouts/notifications/AdminNotification";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const publicRoutes = ["/authentication/sign-in", "/authentication/sign-up"];
  const [miniSidenav, setMiniSidenav] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.flatMap((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        const isPublic = publicRoutes.includes(route.route);
        return [
          <Route
            exact
            path={route.route}
            element={
              isPublic ? route.component : <ProtectedRoute>{route.component}</ProtectedRoute>
            }
            key={route.key || route.route}
          />,
        ];
      }

      return [];
    });

  const configsButton = (
    <MDBox
    // display="flex"
    // justifyContent="center"
    // alignItems="center"
    // width="3.25rem"
    // height="3.25rem"
    // // bgColor="white"
    // shadow="sm"
    // borderRadius="50%"
    // position="fixed"
    // right="2rem"
    // bottom="2rem"
    // zIndex={99}
    // color="dark"
    // sx={{ cursor: "pointer" }}
    // onClick={handleConfiguratorOpen}
    >
      {/* <Icon fontSize="small" color="inherit">
        settings
      </Icon> */}
    </MDBox>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color="#000E29"
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : logo}
              // brandName="Hello Help"
              // routes={routes}
              // onMouseEnter={handleOnMouseEnter}
              // onMouseLeave={handleOnMouseLeave}
              open={mobileOpen}
              onClose={() => setMobileOpen(true)}
            />
            {/* <Configurator />
            {configsButton} */}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route path="/agent/:id" element={<AgentDetails />} />
          <Route path="/customer/:id" element={<CustomerDetails />} />
          <Route path="/CallDetails/:id" element={<CallDetails />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color="#000E29"
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : logo}
            // brandName="Hello Help"
            routes={routes}
            // onMouseEnter={handleOnMouseEnter}
            // onMouseLeave={handleOnMouseLeave}
            // open={mobileOpen}
            // onClose={() => setMobileOpen(true)}
          />
          {/* <Configurator />
          {configsButton} */}
        </>
      )}
      {/* {layout === "vr" && <Configurator />} */}

      <Routes>
        {getRoutes(routes)}
        <Route
          path="/agent/:id"
          element={
            <ProtectedRoute>
              <AgentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/:id"
          element={
            <ProtectedRoute>
              <CustomerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CallDetails/:id"
          element={
            <ProtectedRoute>
              <CallDetails />
            </ProtectedRoute>
          }
        />

        {/* Add admin notification route here, wrapped with ProtectedRoute if needed */}
        {/* <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute>
              <AdminNotificationPage />
            </ProtectedRoute>
          }
        /> */}

        {/* Wildcard route MUST be last */}
        <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
      </Routes>
    </ThemeProvider>
  );
}
