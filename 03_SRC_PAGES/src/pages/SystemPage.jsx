import {
  useState
} from "react";
import {
  auth
} from "../lib/firebase";
import {
  ensureSystemSettings,
  seedDefaultSubjects
} from "../lib/db";

export default function SystemPage() {
  const [message, setMessage] = useState("");

  async function setupSystem() {
    setMessage("กำลังตั้งค่า...");

    try {
      await ensureSystemSettings(
        auth.currentUser.uid
      );

      setMessage(
        "✅ systemSettings พร้อมใช้งาน"
      );
    } catch (error) {
      setMessage(
        "❌ " + error.message
      );
    }
  }

  async function installSubjects() {
    setMessage("กำลังติดตั้งรายวิชา...");

    try {
      const count = await seedDefaultSubjects(
        auth.currentUser.uid
      );

      setMessage(
        `✅ ติดตั้ง/อัปเดตรายวิชา ${count} รายการเรียบร้อย`
      );
    } catch (error) {
      setMessage(
        "❌ " + error.message
      );
    }
  }

  return (
    <section>
      <h2>
        ตั้งค่าระบบ
      </h2>

      <div className="card panel">
        <h3>ฐานข้อมูลระบบ</h3>

        <p className="muted">
          สร้างหรืออัปเดต systemSettings/general
          และ systemSettings/security
        </p>

        <div className="actions">
          <button
            className="btn"
            onClick={setupSystem}
          >
            ตั้งค่าฐานข้อมูลอัตโนมัติ
          </button>

          <button
            className="btn secondary"
            onClick={installSubjects}
          >
            ติดตั้งรายวิชาภาคเรียน 1/2569
          </button>
        </div>

        {
          message && (
            <div
              className={
                message.startsWith("✅")
                  ? "success"
                  : "error"
              }
            >
              {message}
            </div>
          )
        }
      </div>

      <div className="notice">
        รายวิชาจากตารางสอนจะถูกสร้างแบบใช้รหัสวิชาเป็น Document ID
        จึงกดติดตั้งซ้ำได้โดยไม่สร้างรายการซ้ำ
      </div>
    </section>
  );
}
