'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getAllPrefixesAssignedByOrg } from '../../features/user/userSlice';
import toast from 'react-hot-toast';

const GetAllPrefixesAssignedPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error, userData } = useAppSelector((state) => state.user);

  const data = {
    userId: '222',
    org: 'Org6MSP',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllPrefixesAssignedByOrg(data)).unwrap();
        toast.success('Prefixes fetched successfully');
      } catch (err) {
        toast.error(`Error: ${err}`);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div style={styles.container}>
      <h2>Prefixes Assigned By You</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}

      {userData && Array.isArray(userData) && userData.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Prefix</th>
              <th style={styles.th}>Assigned To</th>
              <th style={styles.th}>assigned By</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((item, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{item.prefix}</td>
                <td style={styles.td}>{item.assignedTo}</td>
                <td style={styles.td}>{item.assignedBy || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No prefixes assigned.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 800,
    margin: 'auto',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  error: {
    color: 'red',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 20,
    backgroundColor: '#fff',
  },
  th: {
    border: '1px solid #ddd',
    padding: 12,
    textAlign: 'left',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  td: {
    border: '1px solid #ddd',
    padding: 10,
  },
};

export default GetAllPrefixesAssignedPage;
