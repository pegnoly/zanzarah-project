import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { ColorSchemeScript, MantineProvider } from "@mantine/core"; 
import WizformsMain from "./components/wizforms";
import Home from "./home";
import WizformFocused from "./components/wizforms/focused";
import WizformsMapMain from "./components/map";
import MapLocationsMain from "./components/map/locations";
import LocationFocused from "./components/map/locationFocused";

const router = createBrowserRouter([
  {
    element: (
      <MantineProvider>
        <ColorSchemeScript/>
        {/* <AppShell padding="md"> */}
          <Outlet />
        {/* </AppShell> */}
      </MantineProvider>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'wizforms/:id',
        element: <WizformsMain />,
        children: [
          {
            path: 'focused/:focusedId',
            element: (
              <WizformFocused />
            ),
          },
        ],
      },
      {
        path: 'map/:bookId',
        element: <WizformsMapMain />
      },
      {
        path: 'map/:bookId/locations/:sectionId',
        element: <MapLocationsMain/>,
        children: [
          {
            path: 'focused/:locationId',
            element: <LocationFocused />
          }
        ]
      },
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ],
  },
]);

export default router;