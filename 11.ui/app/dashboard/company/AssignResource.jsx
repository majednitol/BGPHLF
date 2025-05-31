'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { assignResource } from '../../features/company/companySlice';
import toast from 'react-hot-toast';
import './styles/formStyles.css';

const AssignResourceForm = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    allocationID: '',
    memberID: '',
    parentPrefix: '',
    subPrefix: '',
    expiry: '',
    timestamp: '',
    org: 'Org1MSP',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(assignResource(formData)).unwrap();
      toast.success('Resource assigned successfully!');
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Assign Resource</h2>
      <form onSubmit={handleSubmit}>
        <input name="allocationID" placeholder="Allocation ID" onChange={handleChange} required />
        <input name="memberID" placeholder="Member ID" onChange={handleChange} required />
        <input name="parentPrefix" placeholder="Parent Prefix" onChange={handleChange} required />
        <input name="subPrefix" placeholder="Sub Prefix" onChange={handleChange} required />
        <input name="expiry" placeholder="Expiry Date" type="date" onChange={handleChange} required />
        <input name="timestamp" placeholder="Timestamp" type="datetime-local" onChange={handleChange} required />
        <select name="org" value={formData.org} onChange={handleChange} style={styles.select}>
          {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button type="submit">Assign</button>
      </form>
    </div>
  );
};
const styles = {
  formContainer: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f4f9ff',
    borderRadius: '12px',
    boxShadow: '0 0 15px rgba(0, 128, 255, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0077cc',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    border: '2px solid #0077cc',
    borderRadius: '8px',
    fontSize: '16px',
    transition: '0.3s',
  },
  select: {
    padding: '10px',
    border: '2px solid #0077cc',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#444',
  },
  button: {
    padding: '12px',
    backgroundColor: '#00cc66',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: '0.3s',
  },
};
export default AssignResourceForm;
