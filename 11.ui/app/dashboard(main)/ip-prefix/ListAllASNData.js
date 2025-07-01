'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getAllASData, resetState } from '../../features/ipPrefix/ipPrefixSlice';
import toast from 'react-hot-toast';

const ListAllASNData = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.ipPrefix);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllASData()).unwrap();
      } catch {
        toast.error('Failed to fetch ASN data');
      }
    };

    fetchData();

    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All ASN and Prefix Allocations</h2>

      {loading && <p style={styles.loadingText}>Loading...</p>}
      {error && <p style={styles.errorText}>Error: {error}</p>}

      {Array.isArray(data) && data.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ASN</th>
              <th style={styles.th}>Prefixes</th>
              <th style={styles.th}>Assigned To</th>
              <th style={styles.th}>Assigned By</th>
              <th style={styles.th}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data
              .sort((a, b) => Number(a.asn) - Number(b.asn))
              .map((item, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{item.asn}</td>
                  <td style={styles.td}>
                    <ul style={styles.prefixList}>
                      {item.prefix.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </td>
                  <td style={styles.td}>{item.assignedTo}</td>
                  <td style={styles.td}>{item.assignedBy}</td>
                  <td style={styles.td}>{formatDate(item.timestamp)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        !loading && <p style={styles.noDataText}>No ASN data found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
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
    verticalAlign: 'top',
    textAlign: 'center',
  },
  prefixList: {
    listStyleType: 'disc',
    margin: 0,
    paddingLeft: '20px',
    textAlign: 'left',
  },
};

export default ListAllASNData;
