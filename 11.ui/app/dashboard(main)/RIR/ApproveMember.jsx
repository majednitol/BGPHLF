'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';

import toast from 'react-hot-toast';
import './styles/formStyles.css';
import { approveMember } from '../../features/company/companySlice';

const ApproveMember = () => {
  const dispatch = useAppDispatch();
  const [memberID, setMemberID] = useState('');
const [org, setOrg] = useState('Org1');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(approveMember({ org, memberID })).unwrap();
      toast.success('Member approved successfully!');
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Approve Member</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="memberID"
          placeholder="Member ID"
          value={memberID}
          onChange={(e) => setMemberID(e.target.value)}
          required
              />
       <select value={org} onChange={(e) => setOrg(e.target.value)}>
  {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((o) => (
    <option key={o} value={o}>{o}</option>
  ))}
</select>

        <button type="submit">Approve</button>
      </form>
    </div>
  );
};

export default ApproveMember;
