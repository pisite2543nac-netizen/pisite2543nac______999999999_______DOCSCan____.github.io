import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import {
  useAuth
} from "./lib/useAuth";

import SetupPage
  from "./pages/SetupPage";
import LoginPage
  from "./pages/LoginPage";
import DashboardPage
  from "./pages/DashboardPage";
import SystemPage
  from "./pages/SystemPage";
import UsersPage
  from "./pages/UsersPage";
import SubjectsPage
  from "./pages/SubjectsPage";
import ClassroomsPage
  from "./pages/ClassroomsPage";
import WorksheetsPage
  from "./pages/WorksheetsPage";
import AdminLayout
  from "./components/AdminLayout";

function Protected({
  children
}) {
  const {
    user,
    loading
  } = useAuth();

  if (loading) {
    return (
      <div className="page-center">
        กำลังตรวจสอบบัญชี...
      </div>
    );
  }

  return user
    ? children
    : (
      <Navigate
        to="/login"
        replace
      />
    );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/setup"
        element={<SetupPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/admin"
        element={
          <Protected>
            <AdminLayout />
          </Protected>
        }
      >
        <Route
          index
          element={<DashboardPage />}
        />

        <Route
          path="system"
          element={<SystemPage />}
        />

        <Route
          path="users"
          element={<UsersPage />}
        />

        <Route
          path="subjects"
          element={<SubjectsPage />}
        />

        <Route
          path="classrooms"
          element={<ClassroomsPage />}
        />

        <Route
          path="worksheets"
          element={<WorksheetsPage />}
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/setup"
            replace
          />
        }
      />
    </Routes>
  );
}
