'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { tracePrefix } from '../../features/ipPrefix/ipPrefixSlice';
import toast from 'react-hot-toast';

const TracePrefix = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ prefix: '', asn: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await dispatch(tracePrefix(formData)).unwrap();
      setResult(res);
      toast.success('✅ Trace successful');
    } catch (error) {
      toast.error(`❌ ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔍 Trace IP Prefix</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
              <input
          type="text"
          name="asn"
          placeholder="Enter ASN (e.g., 65001)"
          value={formData.asn}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="prefix"
          placeholder="Enter Prefix (e.g., 203.0.113.0/24)"
          value={formData.prefix}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Validating...' : 'Validate'}
        </button>
      </form>

      {result && (
        <div style={styles.result}>
          <pre style={styles.codeBlock}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#f0f8ff',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#0070f3',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #0070f3',
  },
  button: {
    padding: '12px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  result: {
    marginTop: '30px',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  codeBlock: {
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
};

export default TracePrefix;
