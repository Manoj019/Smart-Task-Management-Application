import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate,useNavigate } from "react-router-dom";
import "./index.css";
import NewTask from "./Components/Pages/NewTask";
import Signup from "./Components/Auth/SignUp";
import Login from "./Components/Auth/Login";
import MainPage from "./Components/Pages/MainPage";
import Dashboard from "./Components/Pages/Dashboard";
import PrivateLayout from "./Components/Layout/PrivateLayout";
import TasksPage from "./Components/Pages/TaskPage";
import AnalyticsPage from "./Components/Pages/AnalyticsPage";
import CreateUserForm from "./Components/Pages/CreateUserForm";
import UserList from "./Components/Pages/UsersList";

// You can add other pages: Tasks, Analytics, etc.

const root = document.getElementById("root");

const isAuthenticated = () => !!localStorage.getItem("token");

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function NewTaskWrapper() {
  const navigate = useNavigate();

  return (
    <NewTask
      onTaskCreated={() => {
        navigate("/tasks");
      }}
    />
  );
}

if (root) {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Layout Route with Sidebar */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="NewTask" element={<NewTaskWrapper />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route
            path="createaccounts"
            element={
              <CreateUserForm
                onSubmit={(formData) => {
                  // handle form submission, e.g., send to API or log
                  console.log("User created:", formData);
                }}
              />
              
            }
          />
          <Route path="userslist" element={<UserList refreshFlag={false} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
} else {
  throw new Error("Root element not found");
}
