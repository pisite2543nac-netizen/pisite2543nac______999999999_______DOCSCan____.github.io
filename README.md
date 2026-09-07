# DOC-FULL-NR Smart Worksheet — Complete Fresh + Subjects

ชุดเต็มพร้อมใช้งานกับ Firebase Project `doc-full-nr`

## Admin

- Email: `pisite.2543nac@gmail.com`
- Login ID: `pisit2000`
- Password: ตั้งเองใน Firebase Authentication / หน้า Setup และ **ไม่ถูกฝังใน GitHub**

## รายวิชาที่ติดตั้งอัตโนมัติ

เมื่อเปิด `/setup` และสร้าง Admin สำเร็จ ระบบจะติดตั้งรายวิชาจากตารางสอนภาคเรียน `1/2569` จำนวน 13 รายการอัตโนมัติ:

- 20001-1001 — สุขภาพความปลอดภัยและสิ่งแวดล้อม
- 20001-1004 — กฎหมายแรงงาน
- 21900-1005 — เครือข่ายคอมพิวเตอร์
- 21901-2008 — การออกแบบส่วนติดต่อผู้ใช้
- 21901-2017 — เทคโนโลยีการนำเข้าข้อมูลเข้าสู่ระบบคอมพิวเตอร์
- 21901-2020 — ปฏิบัติงานบริการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ
- 21910-2010 — การเขียนโปรแกรมภาษาคอมพิวเตอร์
- 31901-2001 — การออกแบบส่วนติดต่อผู้ใช้ขั้นสูง
- 31901-2004 — การพัฒนาซอฟต์แวร์ด้วยเทคโนโลยี Front-End
- 31901-2009 — การพัฒนาซอฟต์แวร์สำหรับอุปกรณ์เคลื่อนที่
- 31910-0004 — การเขียนโปรแกรมคอมพิวเตอร์
- Home Room — กิจกรรมโฮมรูม (ชั่วโมงพบครูที่ปรึกษา)
- PLC — ชุมชนการเรียนรู้ทางวิชาชีพ (PLC)

ระบบเก็บคอลัมน์ `ท. / ป. / น. / ช.` ตามที่ปรากฏในตารางต้นฉบับ

## วิธีติดตั้งครั้งแรก

1. แตก ZIP
2. ดับเบิลคลิก `00_INSTALL_DOC_FULL_NR.bat`
3. รอ `SETUP SUCCESS - DOC-FULL-NR`
4. เปิด `http://localhost:5174/setup`
5. ตั้งรหัสผ่าน Admin
6. กดสร้าง Admin และฐานข้อมูลเริ่มต้น

ระบบจะสร้าง:
- Firebase Authentication Admin
- `users/{UID}`
- `systemSettings/general`
- `systemSettings/security`
- `subjects/*` รายวิชาทั้งหมดด้านบน

## เปิดครั้งต่อไป

`01_RUN_DOC_FULL_NR.bat`

## Deploy Hosting

`02_DEPLOY_WEBSITE.bat`

## Deploy Rules

`03_DEPLOY_RULES.bat`

## GitHub

สร้าง Repository เปล่าบน GitHub แล้วเปิด:

`06_GITHUB_PUSH.bat`

จากนั้นวาง URL Repository เช่น:

`https://github.com/USERNAME/REPOSITORY.git`

`.gitignore` ป้องกัน `.env.local`, private key, `node_modules` และ build output ไม่ให้ขึ้น GitHub

## หมายเหตุความปลอดภัย

ไม่เก็บ Password ใน Firestore หรือ Source Code

คอลเลกชันต่อไปนี้ยังล็อก Browser write:
- submissions
- submissionGrades
- submissionOverrides
- auditLogs

เพื่อเตรียมต่อ Cloud Functions ฝั่ง Server
