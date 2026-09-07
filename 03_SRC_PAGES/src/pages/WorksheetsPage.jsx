import {
  useEffect,
  useState
} from "react";
import {
  auth
} from "../lib/firebase";
import {
  createWorksheet,
  deleteWorksheet,
  listCollection,
  setWorksheetStatus
} from "../lib/db";

export default function WorksheetsPage() {
  const [items, setItems] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    subjectId: "",
    classroomId: "",
    totalScore: 10
  });

  async function load() {
    const [
      worksheetRows,
      subjectRows,
      classroomRows
    ] = await Promise.all([
      listCollection("worksheets"),
      listCollection("subjects"),
      listCollection("classrooms")
    ]);

    setItems(worksheetRows);
    setSubjects(subjectRows);
    setClassrooms(classroomRows);

    setForm(
      (current) => ({
        ...current,
        subjectId:
          current.subjectId
          || subjectRows[0]?.subjectId
          || "",
        classroomId:
          current.classroomId
          || classroomRows[0]?.classroomId
          || ""
      })
    );
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function submit(event) {
    event.preventDefault();

    await createWorksheet(
      auth.currentUser.uid,
      form
    );

    setForm({
      ...form,
      title: "",
      description: ""
    });

    await load();
  }

  async function updateStatus(id, status) {
    await setWorksheetStatus(
      id,
      status,
      auth.currentUser.uid
    );

    await load();
  }

  async function remove(id) {
    if (!confirm("ลบใบงานนี้หรือไม่?")) {
      return;
    }

    await deleteWorksheet(id);
    await load();
  }

  return (
    <section>
      <h2>
        จัดการใบงาน
      </h2>

      <form
        className="card panel form-grid"
        onSubmit={submit}
      >
        <div>
          <label className="label">
            ชื่อใบงาน
          </label>

          <input
            className="input"
            required
            value={form.title}
            onChange={
              (event) =>
                setForm({
                  ...form,
                  title:
                    event.target.value
                })
            }
          />
        </div>

        <div>
          <label className="label">
            คะแนนเต็ม
          </label>

          <input
            className="input"
            type="number"
            min="1"
            value={form.totalScore}
            onChange={
              (event) =>
                setForm({
                  ...form,
                  totalScore:
                    event.target.value
                })
            }
          />
        </div>

        <div>
          <label className="label">
            รายวิชา
          </label>

          <select
            className="select"
            required
            value={form.subjectId}
            onChange={
              (event) =>
                setForm({
                  ...form,
                  subjectId:
                    event.target.value
                })
            }
          >
            <option value="">
              เลือกรายวิชา
            </option>

            {
              subjects.map(
                (subject) => (
                  <option
                    key={subject.id}
                    value={subject.subjectId}
                  >
                    {subject.subjectCode}
                    {" "}
                    {subject.subjectName}
                  </option>
                )
              )
            }
          </select>
        </div>

        <div>
          <label className="label">
            ห้องเรียน
          </label>

          <select
            className="select"
            value={form.classroomId}
            onChange={
              (event) =>
                setForm({
                  ...form,
                  classroomId:
                    event.target.value
                })
            }
          >
            <option value="">
              ยังไม่ระบุห้อง
            </option>

            {
              classrooms.map(
                (classroom) => (
                  <option
                    key={classroom.id}
                    value={classroom.classroomId}
                  >
                    {classroom.classLevel}
                    {" / "}
                    {classroom.room}
                  </option>
                )
              )
            }
          </select>
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

        <div className="full">
          <button
            className="btn"
            disabled={!form.subjectId}
          >
            สร้างใบงาน Draft
          </button>
        </div>
      </form>

      <div className="card panel">
        <table className="table">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>สถานะ</th>
              <th>คะแนน</th>
              <th>จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {
              items.map(
                (item) => (
                  <tr key={item.id}>
                    <td>
                      {item.title}
                    </td>

                    <td>
                      <span className="badge">
                        {item.publishedStatus}
                      </span>
                    </td>

                    <td>
                      {item.totalScore}
                    </td>

                    <td>
                      <div className="actions">
                        {
                          item.publishedStatus
                            !== "published"
                          && (
                            <button
                              className="btn"
                              onClick={
                                () =>
                                  updateStatus(
                                    item.id,
                                    "published"
                                  )
                              }
                            >
                              Publish
                            </button>
                          )
                        }

                        {
                          item.publishedStatus
                            === "published"
                          && (
                            <button
                              className="btn secondary"
                              onClick={
                                () =>
                                  updateStatus(
                                    item.id,
                                    "closed"
                                  )
                              }
                            >
                              Close
                            </button>
                          )
                        }

                        <button
                          className="btn danger"
                          onClick={
                            () =>
                              remove(item.id)
                          }
                        >
                          ลบ
                        </button>
                      </div>
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
              ยังไม่มีใบงาน
            </p>
          )
        }
      </div>
    </section>
  );
}
