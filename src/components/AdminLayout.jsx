import {
  NavLink,
  Outlet,
  useNavigate
} from "react-router-dom";
import {
  signOut
} from "firebase/auth";
import {
  auth
} from "../lib/firebase";

const links = [
  ["/admin", "ภาพรวม"],
  ["/admin/system", "ตั้งค่าระบบ"],
  ["/admin/users", "ผู้ใช้งาน"],
  ["/admin/subjects", "รายวิชา"],
  ["/admin/classrooms", "ห้องเรียน"],
  ["/admin/worksheets", "ใบงาน"]
];

export default function AdminLayout() {
  const navigate = useNavigate();

  async function logout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <>
      <header className="topbar">
        <strong>
          DOC-FULL-NR Smart Worksheet
        </strong>

        <button
          className="btn secondary"
          onClick={logout}
        >
          ออกจากระบบ
        </button>
      </header>

      <div className="layout">
        <aside className="card sidebar">
          {
            links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin"}
                className={
                  ({ isActive }) =>
                    "nav"
                    + (
                      isActive
                        ? " active"
                        : ""
                    )
                }
              >
                {label}
              </NavLink>
            ))
          }
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
