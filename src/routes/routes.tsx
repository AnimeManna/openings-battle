import { createBrowserRouter } from "react-router";
import { AddOpeningPage } from "@/pages/admin/add-opening/add-opening";
import { LoginPage } from "@/pages/login/login";
import { ProtectedRoute } from "@/app/protected-route/protecteed-route";
import { AddUserPage } from "@/pages/admin/add-user/add-user";
import { AdminPage } from "@/pages/admin/admin-hub/admin";
import { Layout } from "@/app/layout/layout";
import { HomeComponent } from "@/pages/home/home";
import { Openings } from "@/pages/openings/openings";
import { RateOpening } from "@/pages/rate-opening/rate-opening";
import { NotFoundPage } from "@/pages/not-found/not-found";
import { OpeningsStats } from "@/pages/admin/openings-stats/openings-stats";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { path: "*", element: <NotFoundPage /> },
          { index: true, element: <HomeComponent /> },
          {
            path: "openings",
            children: [
              { index: true, element: <Openings /> },
              { path: ":id", element: <RateOpening /> },
            ],
          },
          {
            path: "admin",
            children: [
              { index: true, element: <AdminPage /> },
              { path: "add-opening", element: <AddOpeningPage /> },
              { path: "add-user", element: <AddUserPage /> },
              { path: "openings-stats", element: <OpeningsStats /> },
            ],
          },
        ],
      },
    ],
  },
]);
