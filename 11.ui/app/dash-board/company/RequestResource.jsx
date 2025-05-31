'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { requestResource } from '../features/company/companySlice';
import toast from 'react-hot-toast';
import './styles/formStyles.css';

const RequestResource = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    reqID: '',
    memberID: '',
    resType: '',
    value: '',
    date: '',
    country: '',
    rir: '',
    timestamp: '',   org: 'Org1MSP',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(requestResource(formData)).unwrap();
      toast.success('Resource request submitted successfully!');
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Request Resource</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="reqID"
          placeholder="Request ID"
          value={formData.reqID}
          onChange={handleChange}
          required
        />
        <input
          name="memberID"
          placeholder="Member ID"
          value={formData.memberID}
          onChange={handleChange}
          required
        />
        <select name="resType" value={formData.resType} onChange={handleChange} required>
          <option value="">Select Resource Type</option>
          <option value="ipv4">IPv4</option>
          <option value="ipv6">IPv6</option>
          <option value="asn">ASN</option>
        </select>
        <input
          name="value"
          placeholder="Value (e.g., /24, /48)"
          value={formData.value}
          onChange={handleChange}
          required
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          required
        />
        <input
          name="rir"
          placeholder="RIR (e.g., APNIC, RIPE)"
          value={formData.rir}
          onChange={handleChange}
          required
        />
        <input
          name="timestamp"
          type="datetime-local"
          value={formData.timestamp}
          onChange={handleChange}
          required
        />
          <select name="org" value={formData.org} onChange={handleChange} style={styles.select}>
          {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default RequestResource;
