import {
  useEffect,
  useState
} from "react";
import {
  listCollection
} from "../lib/db";

export default function UsersPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    listCollection("users")
      .then(setItems)
      .catch(console.error);
  }, []);

  return (
    <section>
      <h2>
        ผู้ใช้งาน
      </h2>

      <div className="card panel">
        <table className="table">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th>Login ID</th>
              <th>Role</th>
              <th>Active</th>
            </tr>
          </thead>

          <tbody>
            {
              items.map(
                (item) => (
                  <tr key={item.id}>
                    <td>
                      {item.displayName || "-"}
                    </td>
                    <td>
                      {item.email || "-"}
                    </td>
                    <td>
                      {item.loginId || "-"}
                    </td>
                    <td>
                      {item.role || "-"}
                    </td>
                    <td>
                      {
                        item.isActive === true
                          ? "true"
                          : "false"
                      }
                    </td>
                  </tr>
                )
              )
            }
          </tbody>
        </table>

        {
          items.length === 0 && (
            <p className="muted">
              ยังไม่มีผู้ใช้งาน
            </p>
          )
        }

        <div className="notice">
          การสร้างบัญชีนักเรียนพร้อม Firebase Authentication
          จะต่อผ่าน Cloud Functions ในขั้น Production
          เพื่อไม่ให้การสร้าง User จาก Browser
          ทำให้ Admin ถูก Logout
        </div>
      </div>
    </section>
  );
}
