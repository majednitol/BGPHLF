'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getAllocationsByMember, resetState } from '../../features/company/companySlice';
import toast from 'react-hot-toast';

const decodedUser = {
  org: 'Org1MSP',
  memberID: 'brac001',
};

const AllocationsList = () => {
  const dispatch = useAppDispatch();
  const { companyData, loading, error } = useAppSelector((state) => state.company);

  useEffect(() => {
    dispatch(getAllocationsByMember({ org: decodedUser.org, memberID: decodedUser.memberID }));

    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Allocations for Member ID: {decodedUser.memberID}</h2>
      {loading && <p style={styles.info}>Loading allocations...</p>}

      {!loading && companyData && companyData.length === 0 && (
        <p style={styles.info}>No allocations found.</p>
      )}

      {!loading && companyData && companyData.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Allocation ID</th>
              <th>Resource Type</th>
              <th>Parent Prefix</th>
              <th>Sub Prefix</th>
              <th>Expiry</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {companyData.map((allocation) => (
              <tr key={allocation.allocationID}>
                <td>{allocation.allocationID}</td>
                <td>{allocation.resType || 'N/A'}</td>
                <td>{allocation.parentPrefix}</td>
                <td>{allocation.subPrefix}</td>
                <td>{new Date(allocation.expiry).toLocaleDateString()}</td>
                <td>{new Date(allocation.timestamp).toLocaleString()}</td>
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
    backgroundColor: '#f4f6fc',
    borderRadius: '12px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '25px',
    color: '#2a4365',
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
    border: '1px solid #cbd5e0',
    padding: '10px',
    textAlign: 'left',
  },
  'table th': {
    backgroundColor: '#e2e8f0',
    color: '#2d3748',
  },
  'table tr:nth-child(even)': {
    backgroundColor: '#edf2f7',
  },
};

export default AllocationsList;
