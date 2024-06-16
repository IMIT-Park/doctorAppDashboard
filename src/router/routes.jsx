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
const AdminOwnerSingleView = lazy(() => import("../panels/admin/owners/OwnerSingleView"));
const AdminClinics = lazy(() => import("../panels/admin/clinics/Index"));
const AdminDoctors = lazy(() => import("../panels/admin/doctors/Index"));
const AdminReports = lazy(() => import("../panels/admin/reports/Index"));
const AdminSales = lazy(() => import("../panels/admin/Sales-team/Index"));
const AdminSalesOwners = lazy(() =>
  import("../panels/admin/Sales-team/owners/Index")
);
const AdminMessages = lazy(() => import("../panels/admin/messages/Index"));
const AdminSubscriptionPlans = lazy(() =>
  import("../panels/admin/subscription-plans/Index")
);
// <--------------> admin panel imports ends here <-------------->

// <--------------> owner panel imports starts here<-------------->
const OwnerIndex = lazy(() => import("../panels/owner/Index"));
const OwnerClinics = lazy(() => import("../panels/owner/clinics/Index"));
const OwnerSubscriptionPlans = lazy(() =>
  import("../panels/owner/subscription-plans/Index")
);

// <--------------> owner panel imports ends here <-------------->

// <--------------> clinic panel imports starts here<-------------->
const ClinicIndex = lazy(() => import("../panels/clinic/Index"));
const ClinicDoctors = lazy(() => import("../panels/clinic/doctors/index"));
const ClinicLeaves = lazy(() => import("../panels/clinic/leaves/Index"));
const ClinicBookings = lazy(() => import("../panels/clinic/bookings/Index"));
const ClinicPatientSingleView = lazy(() =>
  import("../panels/clinic/bookings/Patients")
);

const ClinicPatients = lazy(() =>
  import("../panels/clinic/bookings/PatientsDetails")
);

const ClinicChats = lazy(() =>
  import("../panels/clinic/chats/Index")
);

const ClinicProfile = lazy(() =>
  import("../panels/clinic/profile/ClinicProfile")
);
// <--------------> clinic panel imports ends here <-------------->

// <--------------> doctor panel imports starts here<-------------->
const DoctorIndex = lazy(() => import("../panels/doctor/Index"));
// <--------------> doctor panel imports ends here <-------------->

// <--------------> sales panel imports starts here<-------------->
const SalesIndex = lazy(() => import("../panels/sales/Index"));
const SalesOwners = lazy(() => import("../panels/sales/owners/Owners"));
// <--------------> sales panel imports ends here <-------------->

// <--------------> clinic single-view imports starts here <-------------->
const ClinicSingleView = lazy(() => import("../pages/ClinicSingleView/Index"));
// <--------------> clinic single-view imports ends here <-------------->

// <--------------> doctor single-view imports starts here <-------------->
const DoctorSingleView = lazy(() => import("../pages/DoctorSingleView/Index"));
// <--------------> doctor single-view imports ends here <-------------->

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

  // owners -> clinics
  {
    path: "/admin/owners/:ownerId",
    element: <AdminOwnerSingleView />,
    layout: "default",
  },

  // all clinics
  {
    path: "/admin/clinics",
    element: <AdminClinics />,
    layout: "default",
  },

  // all doctors
  {
    path: "/admin/doctors",
    element: <AdminDoctors />,
    layout: "default",
  },
  // reports
  {
    path: "/admin/reports",
    element: <AdminReports />,
    layout: "default",
  },

  // messages
  {
    path: "/admin/messages",
    element: <AdminMessages />,
    layout: "default",
  },

  // sales-team
  {
    path: "/admin/sales",
    element: <AdminSales />,
    layout: "default",
  },

  // sales-team  -> owners
  {
    path: "/admin/sales/:salesId",
    element: <AdminSalesOwners />,
    layout: "default",
  },

  // subscription-plans
  {
    path: "/admin/subscription-plans",
    element: <AdminSubscriptionPlans />,
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

  // Owner Clinics
  {
    path: "/owner/clinics",
    element: <OwnerClinics />,
    layout: "default",
  },

  //owner subscription plans
  {
    path: "/owner/subscription-plans",
    element: <OwnerSubscriptionPlans />,
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

  // clinicDoctors
  {
    path: "/clinic/doctors",
    element: <ClinicDoctors />,
    layout: "default",
  },

  // clinicDoctors
  {
    path: "/clinic/leaves",
    element: <ClinicLeaves />,
    layout: "default",
  },

  // clinicBookings
  {
    path: "/clinic/bookings",
    element: <ClinicBookings />,
    layout: "default",
  },

  // clinicDoctors SingleView
  {
    path: "/clinic/bookings/:doctorId/patients/:patientId",
    element: <ClinicPatientSingleView />,
    layout: "default",
  },

  {
    path: "/clinic/bookings/:doctorId/patients",
    element: <ClinicPatients />,
    layout: "default",
  },

  {
    path: "/clinic/chats",
    element: <ClinicChats />,
    layout: "default",
  },

  // clinicprofile
  {
    path: "/clinic/profile",
    element: <ClinicProfile />,
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
  {
    path: "/sales/owners",
    element: <SalesOwners />,
    layout: "default",
  },

  // <--------------> sales panel ends here <-------------->

  // <--------------> doctor single-view starts here <-------------->
  {
    path: "/clinics/:clinicId",
    element: <ClinicSingleView />,
    layout: "default",
  },
  // <--------------> doctor single-view ends here <-------------->

  // <--------------> doctor single-view starts here <-------------->
  {
    path: "/clinics/:clinicId/:doctorId",
    element: <DoctorSingleView />,
    layout: "default",
  },
  // <--------------> doctor single-view ends here <-------------->
];

export { routes };
