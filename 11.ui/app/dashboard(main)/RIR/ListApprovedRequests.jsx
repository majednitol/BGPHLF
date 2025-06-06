'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { listApprovedRequests, resetState } from '../../features/ipPrefix/ipPrefixSlice';
import { assignResource } from '../../features/company/companySlice';
import { getAllOwnedPrefixes } from '../../features/ipPrefix/ipPrefixSlice';
import toast from 'react-hot-toast';
import { calculateSubnets } from '../../utils/ipUtils';

const decodedUser = {
  org: 'Org1MSP',
  userID: 'sys002',
};

const ListApprovedRequests = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error, prefix } = useAppSelector((state) => state.ipPrefix);

  const [showModal, setShowModal] = useState(false);
  const [selectedMemberID, setSelectedMemberID] = useState('');
  const [formData, setFormData] = useState({
    allocationID: '',
    memberID: '',
    parentPrefix: '',
    subPrefix: '',
    expiry: '',
    org: decodedUser.org,
  });

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        await dispatch(listApprovedRequests(decodedUser)).unwrap();
      } catch {
        toast.error('Failed to fetch approved requests');
      }
    };

    fetchApprovedRequests();
    return () => dispatch(resetState());
  }, [dispatch]);

  const fetchOwnedPrefixes = async () => {
    try {
      await dispatch(getAllOwnedPrefixes(decodedUser)).unwrap();
    } catch (err) {
      toast.error('Failed to fetch owned prefixes');
    }
  };

  const handleAssignClick = (memberID) => {
    fetchOwnedPrefixes();
    setSelectedMemberID(memberID);
    setFormData({
      allocationID: '',
      memberID,
      parentPrefix: '',
      subPrefix: '',
      expiry: '',
      org: decodedUser.org,
    });
    setShowModal(true);
  };

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'parentPrefix') {
    try {
      const selectedRequest = data.find((req) => req.memberId === selectedMemberID);
      const requiredIPs = Number(selectedRequest?.value || 0);
      const subnets = calculateSubnets(parentPrefix, requiredIPs );
      const firstSubnet = subnets || '';
      setFormData((prev) => ({
        ...prev,
        parentPrefix: value,
        subPrefix: firstSubnet,
      }));
    } catch (err) {
      toast.error(`Subnet calc failed: ${err.message}`);
    }
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      timestamp: new Date().toISOString(),
    };

    try {
      await dispatch(assignResource(payload)).unwrap();
      toast.success('Resource assigned successfully!');
      setShowModal(false);
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Approved Prefix Requests</h2>

      {loading && <p style={styles.loadingText}>Loading...</p>}
      {error && <p style={styles.errorText}>Error: {error}</p>}

      {Array.isArray(data) && data.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} style={styles.th}>{key}</th>
              ))}
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                {Object.values(item).map((val, i) => (
  <td key={i} style={styles.td}>
    {typeof val === 'object' && val !== null
      ? JSON.stringify(val)
      : String(val)}
  </td>
))}

                <td style={styles.td}>
                  <button style={styles.assignBtn} onClick={() => handleAssignClick(item.memberId)}>
                    Assign Resource
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : !loading && <p style={styles.noDataText}>No approved requests found.</p>}

      {showModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Assign Resource to Member</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                name="allocationID"
                placeholder="Allocation ID"
                style={styles.input}
                onChange={handleChange}
                required
              />
              <input
                value={selectedMemberID}
                readOnly
                style={styles.input}
              />

              {/* UPDATED PARENT PREFIX FIELD AS SELECT */}
              <select
                name="parentPrefix"
                value={formData.parentPrefix}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Parent Prefix</option>
                              {
                                  prefix?.map((item, idx) => (
                                      <option key={idx} value={item.prefix}>
                                        {item.prefix}
                                      </option>
                                  ))
               }
              </select>

              <input
  name="subPrefix"
  value={formData.subPrefix} 
  placeholder="Sub Prefix"
  style={styles.input}
  onChange={handleChange}
  required
/>
              
              <input
                name="expiry"
                type="date"
                style={styles.input}
                onChange={handleChange}
                required
              />
              <select
                name="org"
                value={formData.org}
                onChange={handleChange}
                style={styles.input}
              >
                {['Org1MSP', 'Org2MSP', 'Org3MSP', 'Org4MSP'].map((org) => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <button type="submit" style={styles.button}>Assign</button>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#eaf4ff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 128, 255, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0077cc',
  },
  loadingText: {
    textAlign: 'center',
    color: '#444',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  noDataText: {
    textAlign: 'center',
    color: '#777',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    backgroundColor: '#0077cc',
    color: 'white',
    padding: '10px',
    border: '1px solid #ccc',
  },
  td: {
    padding: '10px',
    border: '1px solid #ccc',
    textAlign: 'center',
  },
  assignBtn: {
    padding: '6px 12px',
    backgroundColor: '#00cc66',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    background: 'white',
    padding: '30px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 0 15px rgba(0,0,0,0.2)',
  },
  modalTitle: {
    marginBottom: '15px',
    textAlign: 'center',
    color: '#0077cc',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    border: '2px solid #0077cc',
    borderRadius: '6px',
    fontSize: '16px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#0077cc',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: 1,
  },
  cancelButton: {
    padding: '12px',
    backgroundColor: '#ccc',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: 1,
  },
};

export default ListApprovedRequests;
