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
const AdminOwnerSingleView = lazy(() =>
  import("../panels/admin/owners/OwnerSingleView")
);
const AdminClinics = lazy(() => import("../panels/admin/clinics/Index"));
const AdminDoctors = lazy(() => import("../panels/admin/doctors/Index"));
const AdminSales = lazy(() => import("../panels/admin/Sales-team/Index"));
const AdminSalesOwners = lazy(() =>
  import("../panels/admin/Sales-team/owners/Index")
);
const AdminSubscriptionPlans = lazy(() =>
  import("../panels/admin/subscription-plans/Index")
);
const AdminSupportUser = lazy(() =>
  import("../panels/admin/supportUser/Index")
);

// <--------------> admin panel imports ends here <-------------->

// <--------------> owner panel imports starts here<-------------->
const OwnerIndex = lazy(() => import("../panels/owner/Index"));
const OwnerClinics = lazy(() => import("../panels/owner/clinics/Index"));
const OwnerChat = lazy(() => import("../panels/owner/chats/Index"));
const OwnerBooking = lazy(() => import("../panels/owner/bookings/index"));
const OwnerProfile = lazy(() =>
  import("../panels/owner/profile/OwnerProfile")
);
const OwnerDoctorAppointments = lazy(() =>
  import("../panels/owner/bookings/DoctorAppoinments")
);
// <--------------> owner panel imports ends here <-------------->

// <--------------> clinic panel imports starts here<-------------->
const ClinicIndex = lazy(() => import("../panels/clinic/Index"));
const ClinicDoctors = lazy(() => import("../panels/clinic/doctors/Index"));
const ClinicLeaves = lazy(() => import("../panels/clinic/leaves/Index"));
const ClinicProfile = lazy(() =>
  import("../panels/clinic/profile/ClinicProfile")
);
const RequestToDoctor = lazy(() =>
  import("../panels/clinic/requestToDoctor/RequestToDoctor")
);
const ClinicBookings = lazy(() => import("../panels/clinic/bookings/Index"));
const ClinicPatientDetails = lazy(() =>
  import("../panels/clinic/bookings/PatientDetails")
);
const ClinicSelectDoctor = lazy(() =>
  import("../panels/clinic/bookings/SelectDoctor")
);
const ClinicSelectDateAndTime = lazy(() =>
  import("../panels/clinic/bookings/SelectDateAndTime")
);

// <--------------> clinic panel imports ends here <-------------->

// <--------------> doctor panel imports starts here<-------------->
const DoctorProfile = lazy(() => import("../panels/doctor/profile/Index"));
const DoctorLeaves = lazy(() => import("../panels/doctor/leaves/Index"));
const DoctorRequests = lazy(() => import("../panels/doctor/requests/Requests"));
const DoctorAppointments = lazy(() =>
  import("../panels/doctor/appointments/Index")
);
const DoctorAppointmentsDetails = lazy(() =>
  import("../panels/doctor/appointments/PatientDetails")
);

// <--------------> doctor panel imports ends here <-------------->

// <--------------> sales panel imports starts here<-------------->
const SalesIndex = lazy(() => import("../panels/sales/Index"));
const SalesOwners = lazy(() => import("../panels/sales/owners/Owners"));
// <--------------> sales panel imports ends here <-------------->

// <--------------> supportUser panel imports starts here<-------------->
const SupportUserIndex = lazy(() => import("../panels/supportUser/Index"));
const SupportUserChats = lazy(() =>
  import("../panels/supportUser/chats/Index")
);

const SupportUserComplaints = lazy(() =>
  import("../panels/supportUser/complaints/Index")
);

const SupportUserDoctors = lazy(() =>
  import("../panels/supportUser/doctors/Index")
);

// <--------------> supportUser panel imports ends here <-------------->

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
    path: "/supportUser/complaints",
    element: <SupportUserComplaints />,
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
    path: "/admin/sales/owners",
    element: <AdminSalesOwners />,
    layout: "default",
  },

  // subscription-plans
  {
    path: "/admin/subscription-plans",
    element: <AdminSubscriptionPlans />,
    layout: "default",
  },

  // support user
  {
    path: "/admin/supportuser",
    element: <AdminSupportUser />,
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
    path: "/owner/chat",
    element: <OwnerChat />,
    layout: "default",
  },
  // owner add booking
  {
    path: "/owner/add-booking",
    element: <OwnerBooking />,
    layout: "default",
  },
  
  // ownerprofile
  {
    path: "/owner/profile",
    element: <OwnerProfile />,
    layout: "default",
  },

 // OwnerDoctorAppointments
 {
  path: "/owner/bookings/:clinicId",
  element: <OwnerDoctorAppointments />,
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

  // clinicprofile
  {
    path: "/clinic/profile",
    element: <ClinicProfile />,
    layout: "default",
  },

  // RequestToDoctor
  {
    path: "/clinic/requestToDoctor",
    element: <RequestToDoctor />,
    layout: "default",
  },

  //ClinicPatientDetails
  {
    path: "/clinic/bookings/patient-details",
    element: <ClinicPatientDetails />,
    layout: "default",
  },

  //ClinicSelectDoctor
  {
    path: "/clinic/bookings/select-doctor",
    element: <ClinicSelectDoctor />,
    layout: "default",
  },

  //ClinicSelectDateAndTime
  {
    path: "/clinic/bookings/select-time",
    element: <ClinicSelectDateAndTime />,
    layout: "default",
  },
  // <--------------> clinic panel ends here <-------------->

  // <--------------> doctor panel starts here <-------------->

  // doctor Profile
  {
    path: "/doctor/profile",
    element: <DoctorProfile />,
    layout: "default",
  },
  {
    path: "/doctor/leaves",
    element: <DoctorLeaves />,
    layout: "default",
  },

  // doctorrequest
  {
    path: "/doctor/requests",
    element: <DoctorRequests />,
    layout: "default",
  },

  // DoctorAppointments
  {
    path: "/doctor/appointments",
    element: <DoctorAppointments />,
    layout: "default",
  },

  // DoctorAppointmentsDetails
  {
    path: "/patient-details/:bookingId",
    element: <DoctorAppointmentsDetails />,
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

  // <--------------> support-user panel starts here <-------------->

  // dashboard
  {
    path: "/supportuser/dashboard",
    element: <SupportUserIndex />,
    layout: "default",
  },

  // chats
  {
    path: "/supportuser/chats",
    element: <SupportUserChats />,
    layout: "default",
  },

  //doctors
  {
    path: "/supportuser/doctors",
    element: <SupportUserDoctors />,
    layout: "default",
  },
  // <--------------> support-user sales panel ends here <-------------->

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

  {
    path: "/doctors/:doctorId",
    element: <DoctorSingleView />,
    layout: "default",
  },
  // <--------------> doctor single-view ends here <-------------->
];

export { routes };
