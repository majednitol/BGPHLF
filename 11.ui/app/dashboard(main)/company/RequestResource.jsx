'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { requestResource, resetState } from '../../features/company/companySlice';
import toast from 'react-hot-toast';


const RequestResource = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    resType: '',
    value: '',
    prefixMaxLength: '',
    date: '',
    country: '',
    rir: '',
    timestamp: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    dispatch(resetState());
    return () => dispatch(resetState());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    try {
      console.log("🚀 Submitting payload:", payload);
      await dispatch(requestResource(payload)).unwrap();
      toast.success('✅ Resource request submitted successfully!');
      setFormData({
        resType: '',
        value: '',
        prefixMaxLength: '',
        date: '',
        country: '',
        rir: '',
        timestamp: new Date().toISOString().slice(0, 16),
      });
    } catch (error) {
      toast.error(`❌ Error: ${error.message || error}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📩 Request Resource</h2>

      <form onSubmit={handleSubmit} style={styles.form}>

        <select
          name="resType"
          value={formData.resType}
          onChange={handleChange}
          style={styles.select}
          required
        >
          <option value="">Select Resource Type</option>
          <option value="ipv4">IPv4</option>
          <option value="ipv6">IPv6</option>
          <option value="asn">ASN</option>
        </select>

        <input
          name="value"
          placeholder="Number of Prefixes / ASN (e.g., 240, 4800)"
          value={formData.value}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="prefixMaxLength"
          type="number"
          placeholder="Prefix Max Length"
          value={formData.prefixMaxLength}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="country"
          placeholder="Country (e.g., BD, US)"
          value={formData.country}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <select
          name="rir"
          value={formData.rir}
          onChange={handleChange}
          style={styles.select}
          required
        >
          <option value="">Select RIR</option>
          {['AfrinicMSP', 'ApnicMSP', 'ArinMSP', 'LacnicMSP', 'RipenccMSP'].map((rir) => (
            <option key={rir} value={rir}>{rir}</option>
          ))}
        </select>

        <button type="submit" style={styles.button}>Submit Request</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f9f9fc',
    borderRadius: '12px',
    fontFamily: 'Segoe UI, sans-serif',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px 14px',
    fontSize: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border 0.2s ease-in-out',
  },
  select: {
    padding: '10px 14px',
    fontSize: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    outline: 'none',
    cursor: 'pointer',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s ease-in-out',
  },
};

export default RequestResource;
