'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getPrefixAssignment } from '../features/ipPrefix/ipPrefixSlice';
import toast from 'react-hot-toast';

const GetPrefixAssignment = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.ipPrefix);

  const [form, setForm] = useState({
    org: 'Org1MSP',
    companyID: '',
    prefix: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(getPrefixAssignment(form)).unwrap();
      toast.success('Prefix assignment fetched successfully');
    } catch (err) {
      toast.error(`Fetch failed: ${err}`);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Get Prefix Assignment</h2>

        <label style={styles.label}>Organization</label>
        <select name="org" value={form.org} onChange={handleChange} style={styles.input}>
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

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Loading...' : 'Get Assignment'}
        </button>
      </form>

      {error && <p style={styles.error}>Error: {error}</p>}

      {data && (
        <div style={styles.result}>
          <h4>Assignment Result</h4>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: 'auto',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  button: {
    padding: 12,
    fontSize: 16,
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  result: {
    marginTop: 20,
    backgroundColor: '#e8f0fe',
    padding: 10,
    borderRadius: 6,
  },
};

export default GetPrefixAssignment;
