import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import DoctorListingApp from './components/DoctorListingApp';
import AppLayout from './components/AppLayout';
import DoctorDetails from './components/DoctorDetails';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <DoctorListingApp />
      },
      {
        path: '/doctor/:doctorId',
        element: <DoctorDetails />
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={appRouter} />
  );
}

export default App;





