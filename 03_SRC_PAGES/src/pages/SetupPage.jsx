import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import {
  useState
} from "react";
import {
  useNavigate
} from "react-router-dom";
import {
  auth
} from "../lib/firebase";
import {
  ensureAdminProfile,
  ensureSystemSettings,
  seedDefaultSubjects
} from "../lib/db";
import {
  ADMIN_EMAIL,
  ADMIN_LOGIN_ID,
  PROJECT_ID
} from "../lib/constants";

export default function SetupPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function install(event) {
    event.preventDefault();

    setBusy(true);
    setMessage("");

    try {
      let user = auth.currentUser;

      if (!user) {
        try {
          const created =
            await createUserWithEmailAndPassword(
              auth,
              ADMIN_EMAIL,
              password
            );

          user = created.user;
        } catch (error) {
          if (error?.code === "auth/email-already-in-use") {
            const signedIn =
              await signInWithEmailAndPassword(
                auth,
                ADMIN_EMAIL,
                password
              );

            user = signedIn.user;
          } else if (error?.code === "auth/operation-not-allowed") {
            throw new Error(
              "กรุณาเปิด Email/Password ใน Firebase Authentication ก่อน"
            );
          } else {
            throw error;
          }
        }
      }

      if ((user.email || "").toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        throw new Error(
          `กำลัง Login ด้วย ${user.email || "บัญชีอื่น"} กรุณา Logout ก่อนติดตั้ง`
        );
      }

      await ensureAdminProfile(user);
      await ensureSystemSettings(user.uid);
      const subjectCount = await seedDefaultSubjects(user.uid);

      setMessage(
        `✅ สร้าง Admin ฐานข้อมูล และรายวิชา ${subjectCount} รายการสำเร็จ`
      );

      navigate("/admin");
    } catch (error) {
      setMessage(
        "❌ " + (
          error?.message
          || "ติดตั้งไม่สำเร็จ"
        )
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-center">
      <form
        className="card auth-card"
        onSubmit={install}
      >
        <h1 className="title">
          ติดตั้ง Admin ครั้งแรก
        </h1>

        <p className="muted">
          Firebase Project: {PROJECT_ID}
        </p>

        <div className="field">
          <label className="label">
            Admin Email
          </label>

          <input
            className="input"
            value={ADMIN_EMAIL}
            readOnly
          />
        </div>

        <div className="field">
          <label className="label">
            Login ID
          </label>

          <input
            className="input"
            value={ADMIN_LOGIN_ID}
            readOnly
          />
        </div>

        <div className="field">
          <label className="label">
            ตั้งรหัสผ่านใหม่
          </label>

          <input
            className="input"
            type="password"
            minLength="8"
            required
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />
        </div>

        <button
          className="btn"
          style={{
            width: "100%",
            marginTop: 20
          }}
          disabled={busy}
        >
          {
            busy
              ? "กำลังติดตั้ง..."
              : "สร้าง Admin และฐานข้อมูลเริ่มต้น"
          }
        </button>

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

        <div className="notice">
          ระบบจะสร้าง Admin, systemSettings และติดตั้งรายวิชา
          จากตารางสอนภาคเรียน 1/2569 ให้อัตโนมัติ
          รหัสผ่านจะถูกเก็บโดย Firebase Authentication เท่านั้น
          และจะไม่ถูกบันทึกลง Firestore หรือ Source Code
        </div>
      </form>
    </div>
  );
}
