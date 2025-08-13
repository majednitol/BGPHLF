'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { reviewRequest } from '../../features/company/companySlice';
import toast from 'react-hot-toast';

const ReviewRequest = ({ reqID, memberID, onClose }) => {
  console.log("data",reqID, memberID)
  const dispatch = useAppDispatch();
  const org = 'Org1MSP';
  const reviewerID = 'sys001';

  const [formData, setFormData] = useState({
    reqID: '',
    memberID: '',
    decision: '',
  });

  useEffect(() => {
    setFormData({
      reqID: reqID || '',
      memberID: memberID || '',
      decision: '',
    });
  }, [reqID, memberID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

const decision = formData.decision;
if (!['approved', 'rejected'].includes(decision)) {
  toast.error('Decision must be either "approve" or "reject".');
  return;
}

    try {
      console.log("decision",decision)
      await dispatch(
        reviewRequest({
          ...formData,
          decision,
          reviewedBy: reviewerID,
          org,
        })
      ).unwrap();

      toast.success('Request reviewed successfully!');
      onClose();
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <div style={styles.modalCard}>
      <h2 style={styles.title}>Review Request</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Request ID</label>
          <input
            name="reqID"
            value={formData.reqID}
            disabled
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Member ID</label>
          <input
            name="memberID"
            value={formData.memberID}
            disabled
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Decision</label>
          <select
            name="decision"
            value={formData.decision}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Select Decision</option>
           <option value="approved">Approve</option>
          <option value="rejected">Reject</option>
          </select>
        </div>
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitBtn}>Submit</button>
          <button type="button" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  modalCard: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    width: '400px',
    maxWidth: '95vw',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    marginBottom: '20px',
    fontSize: '22px',
    color: '#0077cc',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '6px',
    fontSize: '14px',
    color: '#333',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundColor: '#f9f9f9',
  },
  select: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundColor: '#fff',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '10px',
  },
  submitBtn: {
    padding: '10px 18px',
    backgroundColor: '#0077cc',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    flex: 1,
  },
  cancelBtn: {
    padding: '10px 18px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    flex: 1,
  },
};

export default ReviewRequest;
