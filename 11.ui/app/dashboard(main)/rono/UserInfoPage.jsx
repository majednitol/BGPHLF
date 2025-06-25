'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getOrgUser } from '../../features/user/userSlice';
import toast from 'react-hot-toast';

const GetOrgUser = () => {
  const dispatch = useAppDispatch();
  const { userData, loading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(getOrgUser()).unwrap();
        toast.success('Org user fetched successfully');
      } catch (err) {
        toast.error(`Error: ${err}`);
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <div style={styles.container}>
      <h2>Organization User Details</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}

      {userData && (
        <table style={styles.table}>
          <tbody>
            <tr>
              <th style={styles.th}>User ID</th>
              <td style={styles.td}>{userData.id}</td>
            </tr>
            <tr>
              <th style={styles.th}>Name</th>
              <td style={styles.td}>{userData.name}</td>
            </tr>
            <tr>
              <th style={styles.th}>Email</th>
              <td style={styles.td}>{userData.email}</td>
            </tr>
            <tr>
              <th style={styles.th}>Organization</th>
              <td style={styles.td}>{userData.orgMSP}</td>
            </tr>
            <tr>
              <th style={styles.th}>Role</th>
              <td style={styles.td}>{userData.role}</td>
            </tr>
            <tr>
              <th style={styles.th}>Created At</th>
              <td style={styles.td}>{new Date(userData.createdAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: 'auto',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  table: {
    width: '100%',
    marginTop: 20,
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
  },
  th: {
    textAlign: 'left',
    padding: 12,
    backgroundColor: '#007bff',
    color: '#fff',
    border: '1px solid #ddd',
  },
  td: {
    padding: 12,
    border: '1px solid #ddd',
  },
};

export default GetOrgUser;


