'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { assignResource } from '../../features/company/companySlice';
import toast from 'react-hot-toast';

const AssignResource = () => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
   
    memberID: '',
    parentPrefix: '',
    subPrefix: '',
    expiry: '',
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

    const payload = {
      ...formData,
      timestamp: new Date().toISOString(), // auto-generate timestamp
    };

    try {
      await dispatch(assignResource(payload)).unwrap();
      toast.success('Resource assigned successfully!');
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.heading}>Assign Resource</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
       
        <input
          style={styles.input}
          name="memberID"
          placeholder="Member ID"
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          name="parentPrefix"
          placeholder="Parent Prefix"
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          name="subPrefix"
          placeholder="Sub Prefix"
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          name="expiry"
          type="date"
          placeholder="Expiry Date"
          onChange={handleChange}
          required
        />
        <select
          name="org"
          value={formData.org}
          onChange={handleChange}
          style={styles.select}
        >
          {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((org) => (
            <option key={org} value={org}>
              {org}
            </option>
          ))}
        </select>
        <button type="submit" style={styles.button}>Assign</button>
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
  },
  select: {
    padding: '10px',
    border: '2px solid #0077cc',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#fff',
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
  },
};

export default AssignResource;
