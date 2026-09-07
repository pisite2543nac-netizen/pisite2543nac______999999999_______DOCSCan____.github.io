import {
  useEffect,
  useState
} from "react";
import {
  listCollection
} from "../lib/db";

const groups = [
  ["users", "ผู้ใช้งาน"],
  ["subjects", "รายวิชา"],
  ["classrooms", "ห้องเรียน"],
  ["worksheets", "ใบงาน"]
];

export default function DashboardPage() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    Promise.all(
      groups.map(
        async ([name]) => [
          name,
          (await listCollection(name)).length
        ]
      )
    )
      .then(
        (rows) =>
          setCounts(
            Object.fromEntries(rows)
          )
      )
      .catch(console.error);
  }, []);

  return (
    <section>
      <h2>
        ภาพรวมระบบ
      </h2>

      <p className="muted">
        Firebase Project: doc-full-nr
      </p>

      <div className="metrics">
        {
          groups.map(
            ([key, label]) => (
              <div
                className="card metric"
                key={key}
              >
                <span className="muted">
                  {label}
                </span>

                <strong>
                  {counts[key] ?? "..."}
                </strong>
              </div>
            )
          )
        }
      </div>

      <div className="notice">
        submissions, submissionGrades,
        submissionOverrides และ auditLogs
        ถูกล็อกไม่ให้ Browser เขียนโดยตรง
        เพื่อเตรียมต่อ Cloud Functions
        ฝั่ง Server
      </div>
    </section>
  );
}
