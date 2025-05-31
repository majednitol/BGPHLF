// import { useContext } from "react";
// import styles from "./dashboard.module.css";
// import { HealthContext } from "@/context/Health";
// import Link from "next/link";

// function DashboardLayout({ children }) {
//   const { account, ConnectedAccountUser } = useContext(HealthContext);
//   return (
//     <>
//       <div className="dashboard">
//         <div id="mySidenav" className={styles.mySidenav}>
//           <nav className={styles.dashboardNav}>
//             <div className={styles.sidebarMenu}>
//               <ul className={styles.sidebarMenu__list}>
//                 <li className={styles.sidebarMenu__list__item}>
//                   <Link
//                     href="/dashboard"
//                     className={styles.sidebarMenu__list__item__link}
//                   >
//                     <p>Dashboard</p>
//                   </Link>

//                   {/* doctor routes */}
//                   {ConnectedAccountUser == 1 && (
//                     <>
//                       <Link
//                         href="/dashboard/doctor-personal-data"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Doctor personal info</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/patient-list"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Doctor's patient list</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/doctor-file-upload"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>File Upload</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/display-doctor-file"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>patient shared File</p>
//                       </Link>

//                       <Link
//                         href="/dashboard/shared-data-doctor"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Pathologist Shared Data</p>
//                       </Link>
//                     </>
//                   )}

//                   {/* Pathologist routes */}
//                   {ConnectedAccountUser == 2 && (
//                     <>
//                       <Link
//                         href="/dashboard/pathologist/PathologistPersonalData"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Pathologist Data</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/pathologist/PatientPrescriptionSentByDoctor"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Patient Prescription</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/pathologist/TestReportToDoctor"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Test Report</p>
//                       </Link>
//                     </>
//                   )}

//                   {/* Medical Research Lab */}
//                   {ConnectedAccountUser == 3 && (
//                     <>
//                       <Link
//                         href="/dashboard/medical-research-lab/MediResearchLabPersonalData"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Personal Data</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/medical-research-lab/ResearchLabReport"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Add Research Lab Report</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/medical-research-lab/PrescriptionOrLabReport"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>View Prescription Or Lab Report</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/medical-research-lab/MedicalResearchLabSharedData"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Lab Shared Data</p>
//                       </Link>
//                     </>
//                   )}

//                   {/* Parmacy Company */}
//                   {ConnectedAccountUser == 4 && (
//                     <>
//                       <Link
//                         href="/dashboard/pharmacy-company/PharmacyCompanyPersonalData"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Personal Data</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/pharmacy-company/AddingTopMedichine"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Adding Top Medichine</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/pharmacy-company/ViewTopMedicine"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>View Top Medicine</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/pharmacy-company/PatientToPharmacyCompanySharedData"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Patient Data</p>
//                       </Link>
//                     </>
//                   )}

//                   {/* Patient */}
//                   {ConnectedAccountUser == 5 && (
//                     <>
//                       <Link
//                         href="/dashboard/patient-personal-details"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Patient Details</p>
//                       </Link>

//                       <Link
//                         href="/dashboard/patient-file-upload"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>File Upload</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/Patient/AddPersonalHealthData"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Add Health Data</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/Patient/ViewPatientHealthData"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>View Health Data</p>
//                       </Link>
//                       <Link
//                         href="/dashboard/Patient/PatientPersonalDoctorList"
//                         className={styles.sidebarMenu__list__item__link}
//                       >
//                         <p>Patient Personal Doctor</p>
//                       </Link>
//                     </>
//                   )}
//                 </li>
//               </ul>
//             </div>
//           </nav>
//         </div>
//         <div className={styles.content} id="dashboard-container__main">
//           {children}
//         </div>
//       </div>
//     </>
//   );
// }

// export default DashboardLayout;
