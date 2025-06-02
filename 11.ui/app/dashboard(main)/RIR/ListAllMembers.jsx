'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { listAllMembers, resetState } from '../../features/ipPrefix/ipPrefixSlice';
import toast from 'react-hot-toast';

// Simulated token decode — replace with real logic
const decodedUser = {
  org: 'Org1MSP',
  userID: '222',
};

const ListAllMembers = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.ipPrefix);
console.log(data)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        await dispatch(listAllMembers(decodedUser)).unwrap();
      } catch {
        toast.error('Failed to fetch company list');
      }
    };

    fetchMembers();

    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>List All Registered  Companies</h2>

      {loading && <p style={styles.loadingText}>Loading...</p>}
      {error && <p style={styles.errorText}>Error: {error}</p>}

      {Array.isArray(data) && data.length > 0 ? (
  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.th}>Member ID</th>
        <th style={styles.th}>Company ID</th>
        <th style={styles.th}>Company Name</th>
        <th style={styles.th}>Country</th>
        <th style={styles.th}>Email</th>
        <th style={styles.th}>Approved</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, idx) => (
        <tr key={idx}>
          <td style={styles.td}>{item.id}</td>
          <td style={styles.td}>{item.company?.id || 'N/A'}</td>
          <td style={styles.td}>{item.company?.legal_entity_name || 'N/A'}</td>
          <td style={styles.td}>{item.country || 'N/A'}</td>
          <td style={styles.td}>{item.email}</td>
          <td style={styles.td}>{item.approved ? 'Yes' : 'No'}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  !loading && <p style={styles.noDataText}>No companies found.</p>
)}

    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f4f9ff',
    borderRadius: '12px',
    boxShadow: '0 0 15px rgba(0, 128, 255, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0077cc',
  },
  loadingText: {
    textAlign: 'center',
    color: '#555',
    marginBottom: '10px',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px',
  },
  noDataText: {
    textAlign: 'center',
    color: '#777',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    backgroundColor: '#0077cc',
    color: 'white',
    padding: '10px',
    border: '1px solid #ccc',
  },
  td: {
    padding: '10px',
    border: '1px solid #ccc',
    textAlign: 'center',
  },
};

export default ListAllMembers;
