import { RouterProvider, createBrowserRouter } from "react-router-dom";

//   User Routes
import Main from "./components/user/Main";
import Dashboard from "./components/user/Dashboard";
import Settings from "./components/user/Settings";
import Connect from "./components/user/Connect";
import Profile from "./components/user/Profile";
import Invite from "./components/user/Invite";
import Signin from "./components/user/Signin";
import Signup from "./components/user/Signup";

//  Admin routes

import Logochange from "./components/admin/Logochange";
import Accounts from "./components/admin/account/Accounts";
import TieUpConfiguration from "./components/admin/tieUp/TieUpConfiguration";
import Advertisement from "./components/admin/Advertisement";
import GeneralQueries from "./components/admin/generalQueries/GeneralQueries";
import Testimonials from "./components/admin/Testimonials";
import AdminDashboard from "./components/admin/AdminDashboard";
import TieUpConfigForm from "./components/admin/tieUp/TieUpConfigForm";
import TieUpConfigDetails from "./components/admin/tieUp/TieUpConfigDetails";
import TieUpConfigEdit from "./components/admin/tieUp/TieUpConfigEdit";
import AccountAddForm from "./components/admin/account/AccountAddForm";
import AccountDetails from "./components/admin/account/AccountDetails";
import AccountEdit from "./components/admin/account/AccountEdit";
import GeneralQueryDetails from './components/admin/generalQueries/GeneralQueryDetails';

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/invitations",
          element: <Invite />,
        },
        {
          path: "/Connectpage",
          element: <Connect />,
        },
        {
          path: "/testimonials",
          element: <Testimonials />,
        },
      ],
    },
    {
      path: "/signin",
      element: <Signin />,
    },
    {
      path: "/ConnectPage",
      element: <Connect />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },

    {
      path: "/invite",
      element: <Invite />,
    },

    {
      path: "/admin",
      element: <AdminDashboard />,
      children: [
        {
          path: "/admin",
          element: <TieUpConfiguration />,
        },
        {
          path: "/admin/tieup",
          element: <TieUpConfigForm />,
        },
        {
          path: "/admin/tieup/:id",
          element: <TieUpConfigDetails />,
        },
        {
          path: "/admin/tieup/:id/edit",
          element: <TieUpConfigEdit />,
        },
        {
          path: "/admin/advertisement",
          element: <Advertisement />,
        },
        {
          path: "/admin/logochange",
          element: <Logochange />,
        },
        {
          path: "/admin/accounts",
          element: <Accounts />,
        },
        {
          path: "/admin/accounts/add",
          element: <AccountAddForm />,
        },
        {
          path: "/admin/account/:id",
          element: <AccountDetails />,
        },
        {
          path: "/admin/account/:id/edit",
          element: <AccountEdit />,
        },
        {
          path: "/admin/gencomquery",
          element: <Testimonials />,
        },
        {
          path: "/admin/generalqueries",
          element: <GeneralQueries />,
        },
        {
          path: "/admin/generalqueries/:id",
          element: <GeneralQueryDetails />,
        },
      ],
    },
  ]);
  return (
    <div className="">
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
