import { lazy } from "react";

const NotFound = lazy(() => import("../pages/NotFound/Error404"));
const Login = lazy(() => import("../pages/Authentication/Login"));
const ForgotPassword = lazy(() =>
  import("../pages/Authentication/ForgotPassword")
);
const ConfirmPassword = lazy(() =>
  import("../pages/Authentication/ConfirmPassword")
);
const Profile = lazy(() => import("../pages/Profile/Profile"));

// <--------------> admin panel imports starts here<-------------->
const AdminIndex = lazy(() => import("../panels/admin/Index"));
const AdminOwners = lazy(() => import("../panels/admin/owners/Index"));
const AdminClinics = lazy(() => import("../panels/admin/clinics/Index"));
const AdminDoctors = lazy(() => import("../panels/admin/doctors/Index"));
const AdminReports = lazy(() => import("../panels/admin/Reports/Index"));
const AdminSales = lazy(() => import("../panels/admin/Sales-team/Index"));
// <--------------> admin panel imports ends here <-------------->

// <--------------> owner panel imports starts here<-------------->
const OwnerIndex = lazy(() => import("../panels/owner/Index"));
// <--------------> owner panel imports ends here <-------------->

// <--------------> clinic panel imports starts here<-------------->
const ClinicIndex = lazy(() => import("../panels/clinic/Index"));
// <--------------> clinic panel imports ends here <-------------->

// <--------------> doctor panel imports starts here<-------------->
const DoctorIndex = lazy(() => import("../panels/doctor/Index"));
// <--------------> doctor panel imports ends here <-------------->

// <--------------> sales panel imports starts here<-------------->
const SalesIndex = lazy(() => import("../panels/sales/Index"));
// <--------------> sales panel imports ends here <-------------->

const routes = [
  // not found
  {
    path: "*",
    element: <NotFound />,
    layout: "blank",
  },
  // login
  {
    path: "/",
    element: <Login />,
    layout: "blank",
  },
  // forgot password
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    layout: "blank",
  },
  // confirm password
  {
    path: "/confirm-password",
    element: <ConfirmPassword />,
    layout: "blank",
  },
  // profile
  {
    path: "/profile",
    element: <Profile />,
  },

  // <--------------> admin panel starts here <-------------->

  // dashboard
  {
    path: "/admin/dashboard",
    element: <AdminIndex />,
    layout: "default",
  },

  // owners
  {
    path: "/admin/owners",
    element: <AdminOwners />,
    layout: "default",
  },

  // clinic
  {
    path: "/admin/owners/clinic",
    element: <AdminClinics />,
    layout: "default",
  },

  // doctor
  {
    path: "/admin/owners/clinics/doctor",
    element: <AdminDoctors />,
    layout: "default",
  },

  // reports
  {
    path: "/admin/reports",
    element: <AdminReports />,
    layout: "default",
  },

  // sales-team
  {
    path: "/admin/sales",
    element: <AdminSales />,
    layout: "default",
  },

  // <--------------> admin panel ends here <-------------->

  // <--------------> owner panel starts here <-------------->

  // dashboard
  {
    path: "/owner/dashboard",
    element: <OwnerIndex />,
    layout: "default",
  },

  // <--------------> owner panel ends here <-------------->

  // <--------------> clinic panel starts here <-------------->

  // dashboard
  {
    path: "/clinic/dashboard",
    element: <ClinicIndex />,
    layout: "default",
  },

  // <--------------> clinic panel ends here <-------------->

  // <--------------> doctor panel starts here <-------------->

  // dashboard
  {
    path: "/doctor/dashboard",
    element: <DoctorIndex />,
    layout: "default",
  },

  // <--------------> doctor panel ends here <-------------->

  // <--------------> sales panel starts here <-------------->

  // dashboard
  {
    path: "/sales/dashboard",
    element: <SalesIndex />,
    layout: "default",
  },

  // <--------------> sales panel ends here <-------------->
];

export { routes };
