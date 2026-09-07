import {
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
  ensureAdminProfile
} from "../lib/db";
import {
  ADMIN_EMAIL
} from "../lib/constants";

export default function LoginPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function login(event) {
    event.preventDefault();

    setBusy(true);
    setMessage("");

    try {
      const credential =
        await signInWithEmailAndPassword(
          auth,
          ADMIN_EMAIL,
          password
        );

      await ensureAdminProfile(
        credential.user
      );

      navigate("/admin");
    } catch (error) {
      setMessage(
        "❌ " + (
          error?.message
          || "เข้าสู่ระบบไม่สำเร็จ"
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
        onSubmit={login}
      >
        <h1 className="title">
          เข้าสู่ระบบผู้ดูแล
        </h1>

        <p className="muted">
          DOC-FULL-NR Smart Worksheet
        </p>

        <div className="field">
          <label className="label">
            อีเมล
          </label>

          <input
            className="input"
            value={ADMIN_EMAIL}
            readOnly
          />
        </div>

        <div className="field">
          <label className="label">
            รหัสผ่าน
          </label>

          <input
            className="input"
            type="password"
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
              ? "กำลังเข้าสู่ระบบ..."
              : "เข้าสู่ระบบ"
          }
        </button>

        {
          message && (
            <div className="error">
              {message}
            </div>
          )
        }
      </form>
    </div>
  );
}
