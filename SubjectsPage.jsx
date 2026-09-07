import {
  useEffect,
  useState
} from "react";
import {
  auth
} from "../lib/firebase";
import {
  createSubject,
  deleteSubject,
  listCollection,
  seedDefaultSubjects
} from "../lib/db";

function showValue(value) {
  return value === null || value === undefined
    ? "-"
    : value;
}

export default function SubjectsPage() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    subjectCode: "",
    subjectName: "",
    description: "",
    academicYear: "2569",
    semester: 1
  });

  async function load() {
    const rows = await listCollection("subjects");

    rows.sort(
      (a, b) =>
        String(a.subjectCode || "")
          .localeCompare(
            String(b.subjectCode || ""),
            "th"
          )
    );

    setItems(rows);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function installDefaults() {
    try {
      const count = await seedDefaultSubjects(
        auth.currentUser.uid
      );

      setMessage(
        `✅ ติดตั้ง/อัปเดตรายวิชา ${count} รายการเรียบร้อย`
      );

      await load();
    } catch (error) {
      setMessage(
        "❌ " + error.message
      );
    }
  }

  async function submit(event) {
    event.preventDefault();

    try {
      await createSubject(
        auth.currentUser.uid,
        form
      );

      setForm({
        ...form,
        subjectCode: "",
        subjectName: "",
        description: ""
      });

      setMessage(
        "✅ เพิ่มรายวิชาแล้ว"
      );

      await load();
    } catch (error) {
      setMessage(
        "❌ " + error.message
      );
    }
  }

  async function remove(id) {
    if (!confirm("ลบรายวิชานี้หรือไม่?")) {
      return;
    }

    await deleteSubject(id);
    await load();
  }

  return (
    <section>
      <h2>
        จัดการรายวิชา
      </h2>

      <div className="actions">
        <button
          className="btn"
          onClick={installDefaults}
        >
          ติดตั้งรายวิชาจากตารางสอน 1/2569
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

      <form
        className="card panel form-grid"
        onSubmit={submit}
      >
        <div>
          <label className="label">
            รหัสวิชา
          </label>

          <input
            className="input"
            required
            value={form.subjectCode}
            onChange={
              (event) =>
                setForm({
                  ...form,
                  subjectCode:
                    event.target.value
                })
            }
          />
        </div>

        <div>
          <label className="label">
            ชื่อรายวิชา
          </label>

          <input
            className="input"
            required
            value={form.subjectName}
            onChange={
              (event) =>
                setForm({
                  ...form,
                  subjectName:
                    event.target.value
                })
            }
          />
        </div>

        <div className="full">
          <label className="label">
            รายละเอียด
          </label>

          <textarea
            className="textarea"
            value={form.description}
            onChange={
              (event) =>
                setForm({
                  ...form,
                  description:
                    event.target.value
                })
            }
          />
        </div>

        <div>
          <label className="label">
            ปีการศึกษา
          </label>

          <input
            className="input"
            value={form.academicYear}
            onChange={
              (event) =>
                setForm({
                  ...form,
                  academicYear:
                    event.target.value
                })
            }
          />
        </div>

        <div>
          <label className="label">
            ภาคเรียน
          </label>

          <select
            className="select"
            value={form.semester}
            onChange={
              (event) =>
                setForm({
                  ...form,
                  semester:
                    Number(
                      event.target.value
                    )
                })
            }
          >
            <option value="1">
              1
            </option>

            <option value="2">
              2
            </option>
          </select>
        </div>

        <div className="full">
          <button className="btn">
            เพิ่มรายวิชาเอง
          </button>
        </div>
      </form>

      <div className="card panel">
        <table className="table">
          <thead>
            <tr>
              <th>รหัสวิชา</th>
              <th>ชื่อรายวิชา</th>
              <th>ท.</th>
              <th>ป.</th>
              <th>น.</th>
              <th>ช.</th>
              <th>ปี/เทอม</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              items.map(
                (item) => (
                  <tr key={item.id}>
                    <td>
                      {item.subjectCode}
                    </td>
                    <td>
                      {item.subjectName}
                    </td>
                    <td>{showValue(item.t)}</td>
                    <td>{showValue(item.p)}</td>
                    <td>{showValue(item.n)}</td>
                    <td>{showValue(item.ch)}</td>
                    <td>
                      {item.academicYear || "-"}
                      /
                      {item.semester || "-"}
                    </td>
                    <td>
                      <button
                        className="btn danger"
                        onClick={
                          () =>
                            remove(item.id)
                        }
                      >
                        ลบ
                      </button>
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
              ยังไม่มีรายวิชา
            </p>
          )
        }
      </div>
    </section>
  );
}
