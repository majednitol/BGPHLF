'use client';

import React, { useState } from 'react';
import { validatePath } from '../../features/ipPrefix/ipPrefixSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import toast from 'react-hot-toast';

const ValidatePath = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.ipPrefix);

  const [form, setForm] = useState({
    org: 'Org1MSP',
    companyID: '',
    prefix: '',
    pathJSON: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let parsedPath;

    try {
      parsedPath = JSON.parse(form.pathJSON);
    } catch (err) {
      toast.error('Invalid JSON format in Path JSON field');
      return;
    }

    try {
      await dispatch(validatePath({ ...form, pathJSON: parsedPath })).unwrap();
      toast.success('Path validated successfully');
      // Optional: reset only pathJSON or whole form except org
      setForm((prev) => ({ ...prev, pathJSON: '' }));
    } catch (err) {
      toast.error(`Validation failed: ${err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Validate Path</h2>

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
        placeholder="Prefix (e.g. 203.0.113.0/24)"
        required
        style={styles.input}
      />

      <label style={styles.label}>Path JSON</label>
      <textarea
        name="pathJSON"
        value={form.pathJSON}
        onChange={handleChange}
        placeholder='Enter path JSON here (e.g. ["AS123", "AS456"])'
        required
        rows={6}
        style={{ ...styles.input, fontFamily: 'monospace' }}
      />

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Validating...' : 'Validate Path'}
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: 600,
    margin: '20px auto',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    fontFamily: 'Arial, sans-serif',
  },
  label: {
    fontWeight: '600',
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
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
};

export default ValidatePath;
