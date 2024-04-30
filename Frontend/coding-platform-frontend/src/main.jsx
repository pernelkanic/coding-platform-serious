import { ClerkProvider } from "@clerk/clerk-react";
import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx';
import AboutContainer from './Components/AboutComponents/AboutContainer.jsx';
import ProblemContainer from './Components/ProblemComponents/ProblemContainer.jsx';
import ProblemPage from "./Components/ProblemComponents/ProblemPage.jsx";
import SignInContainer from "./Components/SignInContainer.jsx";
import './index.css';


const publishableKey = "pk_test_cmVzdGVkLWd1cHB5LTIuY2xlcmsuYWNjb3VudHMuZGV2JA";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <AboutContainer/>,
  },
  {
    path: "/problems",
    element: <ProblemContainer/>,
  },
  { path: "/login", element: <SignInContainer/>},
  { path: "/problems/:id", element: <ProblemPage/>}
]);
ReactDOM.createRoot(document.getElementById('root')).render(
 
      <ClerkProvider publishableKey={publishableKey}>
       <RouterProvider router={router} />
       </ClerkProvider>
  
)
