import { Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import Loading from './components/Loading';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const Catalog = React.lazy(() => import("./pages/Catalog"));
const Custom = React.lazy(() => import("./pages/Custom"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const MemberDashboard = React.lazy(() => import("./pages/member/MemberDashboard"));
const Inventory = React.lazy(() => import("./pages/Inventory"));

function App() {

  return (
    <Suspense fallback={<Loading />}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/custom" element={<Custom />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/inventory" element={<Inventory />} />
      </Route>

      <Route element={<AuthLayout/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/forgot" element={<Forgot/>} />
        </Route>

      <Route element={<MemberLayout />}>
        <Route path="/member" element={<MemberDashboard />} />
      </Route>

    </Routes>
    </Suspense>
  )
}
export default App