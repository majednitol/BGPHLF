'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { reviewRequest } from '../../features/company/companySlice';
import toast from 'react-hot-toast';
import './styles/formStyles.css';

const ReviewRequest = () => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    reqID: '',
    memberID: '',
    decision: '',  // e.g., "approve" or "reject"
    reviewedBy: '',org: 'Org1MSP',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!['approve', 'reject'].includes(formData.decision.toLowerCase())) {
      toast.error('Decision must be either "approve" or "reject".');
      return;
    }

    try {
      await dispatch(reviewRequest(formData)).unwrap();
      toast.success('Request reviewed successfully!');
      setFormData({
        reqID: '',
        memberID: '',
        decision: '',
        reviewedBy: '',
      });
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Review Resource Request</h2>
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
        <select
          name="decision"
          value={formData.decision}
          onChange={handleChange}
          required
        >
          <option value="">Select Decision</option>
          <option value="approve">Approve</option>
          <option value="reject">Reject</option>
        </select>
        <input
          name="reviewedBy"
          placeholder="Reviewed By (Reviewer ID)"
          value={formData.reviewedBy}
          onChange={handleChange}
          required
        /><select
  name="org"
  value={formData.org}
  onChange={handleChange}
>
  {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP', 'Org5MSP', 'Org6MSP'].map((o) => (
    <option key={o} value={o}>
      {o}
    </option>
  ))}
</select>

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewRequest;
