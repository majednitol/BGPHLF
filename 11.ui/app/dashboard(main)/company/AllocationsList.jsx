'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getAllocationsByMember, resetState } from '../../features/company/companySlice';
import toast from 'react-hot-toast';

const decodedUser = {
  org: 'Org1MSP',
  memberID: 'brac00',
};

const AllocationsList = () => {
  const dispatch = useAppDispatch();
  const { companyData, loading, error } = useAppSelector((state) => state.company);

  useEffect(() => {
    dispatch(getAllocationsByMember({ org: decodedUser.org, memberID: decodedUser.memberID }));
    return () => dispatch(resetState());
  }, [dispatch]);
console.log("companyData",companyData)
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📦 Allocations for Member ID: {decodedUser.memberID}</h2>

      {loading && <p style={styles.loadingText}>Loading allocations...</p>}
      {error && <p style={styles.errorText}>Error: {error}</p>}

      {!loading && Array.isArray(companyData) && companyData.length === 0 && (
        <p style={styles.noDataText}>No allocations found.</p>
      )}

      {!loading && Array.isArray(companyData) && companyData.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>ASN</th>
              <th style={styles.th}>Prefix</th>
              <th style={styles.th}>Expiry</th>
              <th style={styles.th}>Issued By</th>
              <th style={styles.th}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {companyData?.map((item, idx) => (
  <tr key={idx}>
    <td style={styles.td}>{item.id || '-'}</td>
    <td style={styles.td}>{item.asn || '-'}</td>
    <td style={styles.td}>{item.prefix?.prefix || '-'}</td>
    <td style={styles.td}>{item.expiry || '-'}</td>
    <td style={styles.td}>{item.issuedBy || '-'}</td>
    <td style={styles.td}>
      {item.timestamp && !isNaN(Date.parse(item.timestamp))
        ? new Date(item.timestamp).toLocaleString()
        : item.timestamp || '-'}
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

export default AllocationsList;
