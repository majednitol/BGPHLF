'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  listAllMembers,
  resetState,
} from '../../features/ipPrefix/ipPrefixSlice';
import { approveMember } from '../../features/company/companySlice';
import toast from 'react-hot-toast';

// Simulated token decode — replace with real logic


const ListAllMembers = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.ipPrefix);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        await dispatch(listAllMembers()).unwrap();
      } catch {
        toast.error('Failed to fetch company list');
      }
    };

    fetchMembers();

    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const handleApprove = async (memberID) => {
    try {
      await dispatch(approveMember()).unwrap();
      toast.success(`Member ${memberID} approved successfully!`);

      // Refresh member list
      await dispatch(listAllMembers()).unwrap();
    } catch (err) {
      toast.error(`Approval failed: ${err}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>List All Registered Companies</h2>

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
                <td style={styles.td}>
                  {item.approved ? (
                    'Yes'
                  ) : (
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleApprove(item.id)}
                    >
                      Approve
                    </button>
                  )}
                </td>
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
    maxWidth: '900px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f4f9ff',
    borderRadius: '12px',
    boxShadow: '0 0 15px rgba(0, 128, 255, 0.1)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0077cc',
    fontSize: '24px',
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
  approveBtn: {
    padding: '6px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default ListAllMembers;
