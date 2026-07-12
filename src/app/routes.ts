import { createBrowserRouter } from "react-router"
import { lazy } from "react"

const Home = lazy(() => import("./pages/Home"))
const AdminLogin = lazy(() => import("./pages/AdminLogin"))
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"))
const ProductDetail = lazy(() => import("./pages/ProductDetail"))

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/loja/:id",
    Component: ProductDetail,
  },
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
])
