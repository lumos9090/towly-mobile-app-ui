import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./screens/Home";
import { AddTowel } from "./screens/AddTowel";
import { TowelDetail } from "./screens/TowelDetail";
import { Insights } from "./screens/Insights";
import { Care } from "./screens/Care";
import { Settings } from "./screens/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "add-towel", Component: AddTowel },
      { path: "towel/:id", Component: TowelDetail },
      { path: "insights", Component: Insights },
      { path: "care", Component: Care },
      { path: "settings", Component: Settings },
    ],
  },
]);
