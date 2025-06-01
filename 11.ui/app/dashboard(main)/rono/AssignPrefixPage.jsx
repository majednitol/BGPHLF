'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { assignPrefix, resetState } from '../../features/ipPrefix/ipPrefixSlice';
import toast from 'react-hot-toast';

const AssignPrefixPage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.ipPrefix);

  const [form, setForm] = useState({
    org: 'Org1MSP',
    companyID: '',
    prefix: '',
    assignedTo: '',
    timestamp: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(assignPrefix(form)).unwrap();
      toast.success('Prefix assigned successfully');
      setForm({
        org: 'Org1MSP',
        companyID: '',
        prefix: '',
        assignedTo: '',
        timestamp: '',
      });
    } catch (err) {
      toast.error(`Error: ${err}`);
    } finally {
      dispatch(resetState());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Assign IP Prefix</h2>

      <label style={styles.label}>Organization</label>
      <select
        name="org"
        value={form.org}
        onChange={handleChange}
        style={styles.input}
      >
        {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((org) => (
          <option key={org} value={org}>
            {org}
          </option>
        ))}
      </select>

      <label style={styles.label}>Company ID</label>
      <input
        name="companyID"
        value={form.companyID}
        onChange={handleChange}
        placeholder="Company ID"
        required
        style={styles.input}
      />

      <label style={styles.label}>Prefix</label>
      <input
        name="prefix"
        value={form.prefix}
        onChange={handleChange}
        placeholder="e.g., 203.0.113.0/24"
        required
        style={styles.input}
      />

      <label style={styles.label}>Assigned To</label>
      <input
        name="assignedTo"
        value={form.assignedTo}
        onChange={handleChange}
        placeholder="Assigned To"
        required
        style={styles.input}
      />

      <label style={styles.label}>Timestamp</label>
      <input
        name="timestamp"
        value={form.timestamp}
        onChange={handleChange}
        placeholder="e.g., 2025-05-31T10:30:00Z"
        required
        style={styles.input}
      />

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Assigning...' : 'Assign Prefix'}
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: 500,
    margin: 'auto',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    padding: 12,
    fontSize: 16,
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
  },
};

export default AssignPrefixPage;
