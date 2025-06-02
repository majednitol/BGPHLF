'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { listApprovedRequests, resetState } from '../../features/ipPrefix/ipPrefixSlice';
import toast from 'react-hot-toast';

// ✅ Replace this with actual decoded user logic
const decodedUser = {
  org: 'Org1MSP',
  userID: '222',
};

const ListApprovedRequests = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.ipPrefix);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(listApprovedRequests(decodedUser)).unwrap();
      } catch (err) {
        toast.error('Failed to fetch approved requests');
      }
    };

    fetchData();

    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Approved Prefix Requests</h2>

      {loading && <p style={styles.loadingText}>Loading...</p>}
      {error && <p style={styles.errorText}>Error: {error}</p>}

      {Array.isArray(data) && data.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request ID</th>
              <th style={styles.th}>Company ID</th>
              <th style={styles.th}>Prefix</th>
              <th style={styles.th}>ASN</th>
              <th style={styles.th}>Requester</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{item.id || 'N/A'}</td>
                <td style={styles.td}>{item.companyID || 'N/A'}</td>
                <td style={styles.td}>{item.prefix || 'N/A'}</td>
                <td style={styles.td}>{item.asn || 'N/A'}</td>
                <td style={styles.td}>{item.requester || 'N/A'}</td>
                <td style={styles.td}>{item.status || 'approved'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p style={styles.noDataText}>No approved requests found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#eaf4ff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 128, 255, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0077cc',
  },
  loadingText: {
    textAlign: 'center',
    color: '#444',
    marginBottom: '10px',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
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

export default ListApprovedRequests;
