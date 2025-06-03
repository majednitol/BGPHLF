'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getCompanyByMemberID, resetState } from '../../features/company/companySlice';

const decodedUser = {
  org: 'Org1MSP',
  memberID: 'member001',
};

const GetCompanyByMemberID = () => {
  const dispatch = useAppDispatch();
  const { companyData, loading, error } = useAppSelector((state) => state.company);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      dispatch(resetState()); // reset previous state
      try {
        await dispatch(getCompanyByMemberID({ org: decodedUser.org, memberID: decodedUser.memberID })).unwrap();
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchCompany();

    return () => {
      dispatch(resetState()); // reset state on component unmount
    };
  }, [dispatch]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏢 Company By Member ID</h2>

      <div style={styles.meta}>
        <span><strong>Organization:</strong> {decodedUser.org}</span>
        <span><strong>Member ID:</strong> {decodedUser.memberID}</span>
      </div>

      {loading || fetching ? (
        <p style={styles.loading}>Loading company data...</p>
      ) : error ? (
        <p style={styles.error}>Error: {error}</p>
      ) : companyData ? (
        <div style={styles.card}>
          {Object.entries(companyData).map(([key, value]) => (
            <div key={key} style={styles.row}>
              <span style={styles.key}>{formatLabel(key)}</span>
              <span style={styles.value}>{String(value)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noData}>No company data found.</p>
      )}
    </div>
  );
};

const formatLabel = (label) =>
  label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const styles = {
  container: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    fontFamily: 'Segoe UI, sans-serif',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#eef5ff',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '15px',
    color: '#333',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: '16px',
    marginTop: '10px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
  },
  noData: {
    textAlign: 'center',
    color: '#777',
    marginTop: '10px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  key: {
    fontWeight: '500',
    color: '#555',
    width: '45%',
  },
  value: {
    color: '#222',
    width: '55%',
    textAlign: 'right',
  },
};

export default GetCompanyByMemberID;
