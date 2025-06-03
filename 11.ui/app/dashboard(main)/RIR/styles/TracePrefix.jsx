'use client';

import React, { useState } from 'react';
import { tracePrefix } from '../../../features/ipPrefix/ipPrefixSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import toast from 'react-hot-toast';

const TracePrefix = () => {
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
      await dispatch(tracePrefix(form)).unwrap();
      toast.success('Prefix traced successfully');
      // Optionally reset form except org
      setForm((prev) => ({ ...prev, companyID: '', prefix: '' }));
    } catch (err) {
      toast.error(`Trace failed: ${err}`);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Trace Prefix</h2>

        <label style={styles.label}>Organization</label>
        <select name="org" value={form.org} onChange={handleChange} style={styles.input}>
          {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <label style={styles.label}>Company ID</label>
        <input
          type="text"
          name="companyID"
          value={form.companyID}
          onChange={handleChange}
          placeholder="Company ID"
          required
          style={styles.input}
        />

        <label style={styles.label}>Prefix</label>
        <input
          type="text"
          name="prefix"
          value={form.prefix}
          onChange={handleChange}
          placeholder="e.g., 203.0.113.0/24"
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Tracing...' : 'Trace Prefix'}
        </button>
      </form>

      {error && <p style={styles.error}>Error: {error}</p>}

      {data && (
        <div style={styles.result}>
          <h4>Trace Result</h4>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: '20px auto',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  button: {
    marginTop: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  error: {
    marginTop: 15,
    color: 'red',
  },
  result: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eef6ff',
    borderRadius: 6,
    whiteSpace: 'pre-wrap',
  },
};

export default TracePrefix;
