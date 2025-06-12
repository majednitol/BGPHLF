'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getResourceRequestsByMember, resetState } from '../../features/company/companySlice';
import toast from 'react-hot-toast';

const decodedUser = {
  org: 'Org1MSP',
  memberID: 'brac00',
};

const ResourceRequestsList = () => {
  const dispatch = useAppDispatch();
  const { companyData, loading, error } = useAppSelector((state) => state.company);

  useEffect(() => {
    dispatch(getResourceRequestsByMember({ org: decodedUser.org, memberID: decodedUser.memberID }));

    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📨 Resource Requests for Member ID: {decodedUser.memberID}</h2>

      {loading && <p style={styles.loadingText}>Loading resource requests...</p>}

      {error && <p style={styles.errorText}>Error: {error}</p>}

      {!loading && Array.isArray(companyData) && companyData.length === 0 && (
        <p style={styles.noDataText}>No resource requests found.</p>
      )}

      {!loading && Array.isArray(companyData) && companyData.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request ID</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Value</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Country</th>
              <th style={styles.th}>RIR</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Reviewed By</th>
              <th style={styles.th}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {companyData.map((req, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{req.requestId || '-'}</td>
                <td style={styles.td}>{req.type || '-'}</td>
                <td style={styles.td}>{req.value || '-'}</td>
                <td style={styles.td}>
                  {req.date ? new Date(req.date).toLocaleDateString() : '-'}
                </td>
                <td style={styles.td}>{req.country || '-'}</td>
                <td style={styles.td}>{req.rir || '-'}</td>
                <td style={styles.td}>{req.status || '-'}</td>
                <td style={styles.td}>{req.reviewedBy || '-'}</td>
                <td style={styles.td}>
                  {req.timestamp }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
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
    backgroundColor: '#fff',
  },
};

export default ResourceRequestsList;
