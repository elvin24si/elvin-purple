import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
    return (
        <div className="flex min-h-screen w-full bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col p-4">
        <main className="mt-4">
          <Outlet />
        </main>
      </div>
    </div>
    );
}