// App.js

import React from 'react';
import Header from './component/Header';
import Dashboard from './component/Dashboard';
import Footer from './component/Footer';
import Joblist from './component/Joblist';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

// Common Layout with Header and Footer
const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, // This means the default route "/"
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "joblist",
        element: <Joblist />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
