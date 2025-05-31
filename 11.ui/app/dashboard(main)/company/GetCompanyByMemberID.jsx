'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getCompanyByMemberID } from '../features/company/companySlice';
import toast from 'react-hot-toast';
import './styles/formStyles.css';

const GetCompanyByMemberID = () => {
  const dispatch = useAppDispatch();
  const { companyData, loading, error } = useAppSelector(state => state.company);

  const [memberID, setMemberID] = useState('');
const [org, setOrg] = useState('Org1');
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!memberID.trim()) {
      toast.error('Please enter a valid Member ID.');
      return;
    }

    try {
      await dispatch(getCompanyByMemberID({org, memberID })).unwrap();
      toast.success('Company data fetched successfully!');
    } catch (err) {
      toast.error(`Failed to fetch company: ${err}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Get Company By Member ID</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Member ID"
          value={memberID}
          onChange={(e) => setMemberID(e.target.value)}
          required
              />
              <select style={styles.select} value={org} onChange={(e) => setOrg(e.target.value)}>
        {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Company'}
        </button>
      </form>

      {error && <p className="error-text">Error: {error}</p>}

      {companyData && (
        <div className="company-info">
          <h3>Company Details</h3>
          <pre>{JSON.stringify(companyData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GetCompanyByMember;
