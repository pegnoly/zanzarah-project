import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { ColorSchemeScript, MantineProvider } from "@mantine/core"; 
import WizformsMain from "./components/wizforms";
import Home from "./home";
import WizformFocused from "./components/wizforms/focused";

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
            // This ensures the modal is rendered without unmounting parent
          },
        ],
      },
      // Optional: Redirect unknown routes
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ],
  },
]);

export default router;