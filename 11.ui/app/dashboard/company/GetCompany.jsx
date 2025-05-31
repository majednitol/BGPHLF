'use client';

import React, { useState } from 'react'

import { useAppDispatch } from '../../redux/hooks';
import { getCompany } from '../../features/company/companySlice';
import toast from 'react-hot-toast';
import './styles/formStyles.css';

const GetCompanyForm = () => {
  const dispatch = useAppDispatch();
  const [comapanyID, setCompanyID] = useState('');
const [org, setOrg] = useState('Org1');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(getCompany({ comapanyID,org })).unwrap();
      toast.success(`Company Data: ${JSON.stringify(result)}`);
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Get Company</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="comapanyID"
          placeholder="Company ID"
          value={comapanyID}
          onChange={(e) => setCompanyID(e.target.value)}
          required
              />
              <select style={styles.select} value={org} onChange={(e) => setOrg(e.target.value)}>
        {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
        <button type="submit">Fetch Company</button>
      </form>
    </div>
  );
};
const styles = {container: {
    maxWidth: '400px',
    margin: '30px auto',
    padding: '20px',
    border: '2px solid #ddd',
    borderRadius: '12px',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    color: '#2c3e50',
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  userCard: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#ecf0f1',
    borderRadius: '6px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
};

export default GetCompanyForm;
