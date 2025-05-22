// Components/Layout/PrivateLayout.tsx

import { Outlet } from "react-router-dom";
import Sidebar from "../SideBar/SideBar";
import Header from "../Header"; // <- Make sure this path is correct

export default function PrivateLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet /> {/* This renders the matched child route */}
        </main>
      </div>
    </div>
  );
}

