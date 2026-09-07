import {
  useEffect,
  useState
} from "react";
import {
  createClassroom,
  deleteClassroom,
  listCollection
} from "../lib/db";

export default function ClassroomsPage() {
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    classLevel: "ม.1",
    room: "1",
    academicYear: "2569"
  });

  async function load() {
    setItems(
      await listCollection("classrooms")
    );
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function submit(event) {
    event.preventDefault();

    await createClassroom(form);
    await load();
  }

  async function remove(id) {
    if (!confirm("ลบห้องเรียนนี้หรือไม่?")) {
      return;
    }

    await deleteClassroom(id);
    await load();
  }

  return (
    <section>
      <h2>
        จัดการห้องเรียน
      </h2>

      <form
        className="card panel form-grid"
        onSubmit={submit}
      >
        <div>
          <label className="label">
            ระดับชั้น
          </label>

          <input
            className="input"
            required
            value={form.classLevel}
            onChange={
              (event) =>
                setForm({
                  ...form,
                  classLevel:
                    event.target.value
                })
            }
          />
        </div>

        <div>
          <label className="label">
            ห้อง
          </label>

          <input
            className="input"
            required
            value={form.room}
            onChange={
              (event) =>
                setForm({
                  ...form,
                  room:
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
          <button className="btn">
            เพิ่มห้องเรียน
          </button>
        </div>
      </form>

      <div className="card panel">
        <table className="table">
          <thead>
            <tr>
              <th>ชั้น</th>
              <th>ห้อง</th>
              <th>ปี</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              items.map(
                (item) => (
                  <tr key={item.id}>
                    <td>
                      {item.classLevel}
                    </td>
                    <td>
                      {item.room}
                    </td>
                    <td>
                      {item.academicYear}
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
              ยังไม่มีห้องเรียน
            </p>
          )
        }
      </div>
    </section>
  );
}
