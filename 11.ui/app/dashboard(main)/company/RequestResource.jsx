'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { requestResource, resetState } from '../../features/company/companySlice';
import toast from 'react-hot-toast';

const decodedUser = {
  org: 'Org1MSP',
  memberID: 'brac00',
};

const RequestResource = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    reqID: '',
    resType: '',
    value: '',
    date: '',
    country: '',
    rir: '',
    timestamp: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    dispatch(resetState());
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      memberID: decodedUser.memberID,
      org: decodedUser.org,
    };

    try {
      console.log("payload",payload)
      await dispatch(requestResource(payload)).unwrap();
      toast.success('Resource request submitted successfully!');
      setFormData({
        reqID: '',
        resType: '',
        value: '',
        date: '',
        country: '',
        rir: '', prefixMaxLength: '',
        timestamp: new Date().toISOString().slice(0, 16),
      });
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📩 Request Resource</h2>

      <div style={styles.meta}>
        <span><strong>Organization:</strong> {decodedUser.org}</span>
        <span><strong>Member ID:</strong> {decodedUser.memberID}</span>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="reqID"
          placeholder="Request ID"
          value={formData.reqID}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <select name="resType" value={formData.resType} onChange={handleChange} style={styles.input} required>
          <option value="">Select Resource Type</option>
          <option value="ipv4">IPv4</option>
          <option value="ipv6">IPv6</option>
          <option value="asn">ASN</option>
        </select>
        <input
          name="value"
          placeholder="number of preixs (e.g., 240, 4800)"
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
          placeholder="Country"
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
  <option value="">Select RIR</option> {/* <-- Add this */}
  {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((o) => (
    <option key={o} value={o}>
      {o}
    </option>
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
  },  select: {
    padding: '10px 14px',
    fontSize: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: '#fff',
    appearance: 'none',        
    // WebkitAppearance: 'none',
    MozAppearance: 'none',
    cursor: 'pointer',
    transition: 'border 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#eef5ff',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '15px',
    color: '#333',
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
