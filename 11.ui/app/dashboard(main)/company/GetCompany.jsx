// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useAppDispatch } from '../../redux/hooks';
// import { getCompany } from '../../features/company/companySlice';



// const GetCompany = () => {
//   const dispatch = useAppDispatch();
//   const [companyData, setCompanyData] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchCompany = async () => {
//       try {
//         const result = await dispatch(
//           getCompany({ comapanyID: decodedUser.comapanyID, org: decodedUser.org })
//         ).unwrap();
//         setCompanyData(result);
//       } catch (err) {
//         setError(`Error: ${err}`);
//       }
//     };

//     fetchCompany();
//   }, [dispatch]);

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>📄 Company Information</h2>

//       <div style={styles.meta}>
//         <span><strong>Organization:</strong> {decodedUser.org}</span>
//         <span><strong>Company ID:</strong> {decodedUser.comapanyID}</span>
//       </div>

//       {error && <p style={styles.error}>{error}</p>}

//       {companyData && (
//         <div style={styles.card}>
//           {Object.entries(companyData).map(([key, value]) => (
//             <div key={key} style={styles.row}>
//               <span style={styles.key}>{formatLabel(key)}</span>
//               <span style={styles.value}>{String(value)}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // Helper to format snake_case keys into nice labels
// const formatLabel = (label) =>
//   label
//     .replace(/_/g, ' ')
//     .replace(/\b\w/g, (char) => char.toUpperCase());

// const styles = {
//   container: {
//     maxWidth: '700px',
//     margin: '40px auto',
//     padding: '30px',
//     backgroundColor: '#f8f9fa',
//     borderRadius: '12px',
//     fontFamily: 'Segoe UI, sans-serif',
//     boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
//   },
//   title: {
//     textAlign: 'center',
//     fontSize: '24px',
//     color: '#2c3e50',
//     marginBottom: '20px',
//   },
//   meta: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     backgroundColor: '#eef5ff',
//     padding: '10px 15px',
//     borderRadius: '8px',
//     marginBottom: '20px',
//     fontSize: '15px',
//     color: '#333',
//   },
//   error: {
//     color: 'red',
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     padding: '20px',
//     borderRadius: '10px',
//     border: '1px solid #e0e0e0',
//     boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
//   },
//   row: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     padding: '8px 0',
//     borderBottom: '1px solid #f0f0f0',
//   },
//   key: {
//     fontWeight: '500',
//     color: '#555',
//     width: '45%',
//   },
//   value: {
//     color: '#222',
//     width: '55%',
//     textAlign: 'right',
//   },
// };

// export default GetCompany;
