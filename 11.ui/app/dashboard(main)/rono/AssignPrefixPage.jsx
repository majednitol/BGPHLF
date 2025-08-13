'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { assignPrefix, resetState } from '../../features/ipPrefix/ipPrefixSlice';
import toast from 'react-hot-toast';

const orgOptions = [
  { label: 'AFRINIC', value: 'AfrinicMSP' },
  { label: 'APNIC', value: 'ApnicMSP' },
  { label: 'ARIN', value: 'ArinMSP' },
  { label: 'RIPE NCC', value: 'RipenccMSP' },
  { label: 'LACNIC', value: 'LacnicMSP' },
  { label: 'RONO', value: 'RonoMSP' },
];

const AssignPrefixPage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.ipPrefix);

  const [form, setForm] = useState({
    prefix: '',
    assignedTo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      prefix: [form.prefix],
      assignedTo: form.assignedTo,
      timestamp: new Date().toISOString(),
    };

    try {
      await dispatch(assignPrefix(payload)).unwrap();
      toast.success('Prefix assigned successfully');
      setForm({ prefix: '', assignedTo: '' });
    } catch (err) {
      console.log("msg", err);
      toast.error(`Error: ${err}`);
    } finally {
      dispatch(resetState());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Assign IP Prefix</h2>

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
      <select
        name="assignedTo"
        value={form.assignedTo}
        onChange={handleChange}
        required
        style={styles.select}
      >
        <option value="">Select Organization</option>
        {orgOptions.map((org) => (
          <option key={org.value} value={org.value}>
            {org.label}
          </option>
        ))}
      </select>

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
  select: {
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: '1px solid #ccc',
    backgroundColor: '#fff',
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
