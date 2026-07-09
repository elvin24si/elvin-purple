// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#08090C]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}