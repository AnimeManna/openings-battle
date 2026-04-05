import { createBrowserRouter } from "react-router";
import { AddOpeningPage } from "@/pages/admin/add-opening/add-opening";
import { LoginPage } from "@/pages/login/login";
import { ProtectedRoute } from "@/app/protected-route/protecteed-route";
import { AddUserPage } from "@/pages/admin/add-user/add-user";
import { AdminPage } from "@/pages/admin/admin-hub/admin-hub";
import { Layout } from "@/app/layout/layout";
import { HomeComponent } from "@/pages/home/home";
import { Openings } from "@/pages/openings/openings";
import { RateOpening } from "@/pages/rate-opening/rate-opening";
import { NotFoundPage } from "@/pages/not-found/not-found";
import { StatisticsPage } from "@/pages/statistics/statistics";
import { CalibrationPage } from "@/pages/calibration/calibration";
import { StageControlsPage } from "@/pages/admin/stage-controls/stage-controls";
import { StagesPage } from "@/pages/stages/stages";
import { AdminOpeningStats } from "@/pages/admin/openings-stats/openings-stats";
import { TierList } from "@/pages/tier-list/tier-list";
import { StageDetails } from "@/pages/stage-details/stage-details";
import { RoundPage } from "@/pages/round/round";

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
          { path: "statistics", element: <StatisticsPage /> },
          { path: "calibration", element: <CalibrationPage /> },
          {
            path: "openings",
            children: [
              { index: true, element: <Openings /> },
              { path: ":id", element: <RateOpening /> },
            ],
          },
          {
            path: "stages",
            children: [
              { index: true, element: <StagesPage /> },
              {
                path: ":stageId",
                element: <StageDetails />,
              },
            ],
          },
          {
            path: "round",
            children: [
              {
                path: ":roundId",
                element: <RoundPage />,
              },
            ],
          },
          {
            path: "tier-list",
            element: <TierList />,
          },
          {
            path: "admin",
            children: [
              { index: true, element: <AdminPage /> },
              { path: "add-opening", element: <AddOpeningPage /> },
              { path: "add-user", element: <AddUserPage /> },
              { path: "openings-stats", element: <AdminOpeningStats /> },
              { path: "stage-controls", element: <StageControlsPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
