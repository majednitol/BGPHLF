'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getResourceRequestsByMember, resetState } from '../../features/company/companySlice';
import toast from 'react-hot-toast';

const decodedUser = {
  org: 'Org1MSP',
  memberID: 'brac001',
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
      <h2 style={styles.title}>📨 Resource Requests for Member ID: {decodedUser.memberID}</h2>
      {loading && <p style={styles.info}>Loading resource requests...</p>}

      {!loading && companyData && companyData.length === 0 && (
        <p style={styles.info}>No resource requests found.</p>
      )}

      {!loading && companyData && companyData.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Resource Type</th>
              <th>Value</th>
              <th>Date</th>
              <th>Country</th>
              <th>RIR</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {companyData.map((request) => (
              <tr key={request.reqID}>
                <td>{request.reqID}</td>
                <td>{request.resType}</td>
                <td>{request.value}</td>
                <td>{new Date(request.date).toLocaleDateString()}</td>
                <td>{request.country}</td>
                <td>{request.rir}</td>
                <td>{new Date(request.timestamp).toLocaleString()}</td>
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
    maxWidth: '900px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  },
  title: {
    marginBottom: '25px',
    color: '#2d3748',
    fontSize: '26px',
    textAlign: 'center',
  },
  info: {
    textAlign: 'center',
    color: '#718096',
    fontSize: '18px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '16px',
  },
  'table th, table td': {
    border: '1px solid #e2e8f0',
    padding: '10px',
    textAlign: 'left',
  },
  'table th': {
    backgroundColor: '#e2e8f0',
    color: '#1a202c',
  },
  'table tr:nth-child(even)': {
    backgroundColor: '#edf2f7',
  },
};

export default ResourceRequestsList;
