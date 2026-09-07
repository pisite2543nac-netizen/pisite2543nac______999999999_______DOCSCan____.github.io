import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";
import {
  ADMIN_EMAIL,
  ADMIN_LOGIN_ID
} from "./constants";
import {
  DEFAULT_SUBJECTS,
  DEFAULT_ACADEMIC_YEAR,
  DEFAULT_SEMESTER,
  DEFAULT_DEPARTMENT,
  DEFAULT_INSTITUTION
} from "./defaultSubjects";

export async function ensureAdminProfile(user) {
  if ((user.email || "").toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error("อีเมลนี้ไม่ใช่ Admin ของระบบ");
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      loginId: ADMIN_LOGIN_ID,
      displayName: "ผู้ดูแลระบบ",
      email: ADMIN_EMAIL,
      role: "admin",
      profileImageURL: "",
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  const verified = await getDoc(ref);
  const profile = verified.data();

  if (!profile) {
    throw new Error("ไม่พบ Firestore Admin profile");
  }

  if (profile.role !== "admin") {
    throw new Error("บัญชีนี้ไม่ได้รับสิทธิ์ Admin");
  }

  if (profile.isActive !== true) {
    throw new Error("บัญชี Admin ถูกปิดใช้งาน");
  }

  return profile;
}

export async function ensureSystemSettings(uid) {
  await setDoc(
    doc(db, "systemSettings", "general"),
    {
      systemName: "DOC-FULL-NR Smart Worksheet System",
      institutionName: DEFAULT_INSTITUTION,
      department: DEFAULT_DEPARTMENT,
      defaultLanguage: "th",
      academicYear: DEFAULT_ACADEMIC_YEAR,
      semester: DEFAULT_SEMESTER,
      gradeVisibleToUser: false,
      schemaVersion: 4,
      updatedBy: uid,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  await setDoc(
    doc(db, "systemSettings", "security"),
    {
      defaultDeny: true,
      directSubmissionWriteAllowed: false,
      directGradeWriteAllowed: false,
      gradeVisibleToUser: false,
      adminEmail: ADMIN_EMAIL,
      updatedBy: uid,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function seedDefaultSubjects(uid) {
  for (const subject of DEFAULT_SUBJECTS) {
    await setDoc(
      doc(db, "subjects", subject.subjectId),
      {
        ...subject,
        description: "",
        academicYear: DEFAULT_ACADEMIC_YEAR,
        semester: DEFAULT_SEMESTER,
        department: DEFAULT_DEPARTMENT,
        institutionName: DEFAULT_INSTITUTION,
        source: "ตารางสอนภาคเรียน 1/2569",
        isActive: true,
        createdBy: uid,
        updatedBy: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  }

  return DEFAULT_SUBJECTS.length;
}

export async function listCollection(name) {
  const snapshot = await getDocs(collection(db, name));

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  }));
}

export async function createSubject(uid, values) {
  const id = `subject-${Date.now()}`;

  await setDoc(
    doc(db, "subjects", id),
    {
      subjectId: id,
      subjectCode: values.subjectCode.trim(),
      subjectName: values.subjectName.trim(),
      description: values.description?.trim() || "",
      academicYear: values.academicYear || "2569",
      semester: Number(values.semester || 1),
      isActive: true,
      createdBy: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  );
}

export async function deleteSubject(id) {
  await deleteDoc(doc(db, "subjects", id));
}

export async function createClassroom(values) {
  const id = `classroom-${Date.now()}`;

  await setDoc(
    doc(db, "classrooms", id),
    {
      classroomId: id,
      classLevel: values.classLevel.trim(),
      room: values.room.trim(),
      academicYear: values.academicYear || "2569",
      studentIds: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  );
}

export async function deleteClassroom(id) {
  await deleteDoc(doc(db, "classrooms", id));
}

export async function createWorksheet(uid, values) {
  const id = `worksheet-${Date.now()}`;

  await setDoc(
    doc(db, "worksheets", id),
    {
      worksheetId: id,
      subjectId: values.subjectId,
      title: values.title.trim(),
      description: values.description?.trim() || "",
      type: "digital",
      targetClassroomIds: values.classroomId
        ? [values.classroomId]
        : [],
      targetUserIds: [],
      assignedUserIds: [],
      startDate: new Date(),
      deadline: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
      allowLateSubmission: false,
      allowResubmission: false,
      maxResubmissionCount: 0,
      totalScore: Number(values.totalScore || 10),
      attachmentFiles: [],
      formQuestions: [],
      barcodeID: "",
      qrData: "",
      publishedStatus: "draft",
      createdBy: uid,
      createdAt: serverTimestamp(),
      updatedBy: uid,
      updatedAt: serverTimestamp()
    }
  );
}

export async function setWorksheetStatus(id, status, uid) {
  await updateDoc(
    doc(db, "worksheets", id),
    {
      publishedStatus: status,
      updatedBy: uid,
      updatedAt: serverTimestamp()
    }
  );
}

export async function deleteWorksheet(id) {
  await deleteDoc(doc(db, "worksheets", id));
}
