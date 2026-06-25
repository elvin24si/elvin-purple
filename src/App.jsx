import { Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

import Loading from './components/Loading';

const Landing = React.lazy(() => import("./pages/Landing"));
const GuestCatalog = React.lazy(() => import("./pages/GuestCatalog"));
const Catalog = React.lazy(() => import("./pages/member/Catalog"));
const Custom = React.lazy(() => import("./pages/member/Custom"));
const Settings = React.lazy(() => import("./pages/member/Settings"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const Dashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const MemberDashboard = React.lazy(() => import("./pages/member/MemberDashboard"));
const Inventory = React.lazy(() => import("./pages/admin/Inventory"));
const MemberList = React.lazy(() => import("./pages/admin/MemberList"));

function App() {

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Guest Landing Page without Sidebar Layout */}
        <Route path="/" element={<Landing />} />
        <Route path="/guestCatalog" element={<GuestCatalog />} />

        {/* Main Admin Pages with Sidebar Layout */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/memberlist" element={<MemberList />} />
        </Route>


        {/* Main Member Pages with Sidebar Layout */}
        <Route element={<MainLayout />}>
          <Route path="/member" element={<MemberDashboard />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Auth Layout */}
        <Route element={<AuthLayout/>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgot" element={<Forgot/>} />
        </Route>
      </Routes>
    </Suspense>
  )
}
export default App;