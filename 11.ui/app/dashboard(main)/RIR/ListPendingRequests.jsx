// components/ListPendingRequests.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { listPendingRequests, resetState } from '../../features/ipPrefix/ipPrefixSlice';
import toast from 'react-hot-toast';
import ReviewRequest from './ReviewRequest';



const ListPendingRequests = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.ipPrefix);
console.log("data",data)
  const [showModal, setShowModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState({ reqID: '', memberID: '' });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        await dispatch(listPendingRequests()).unwrap();
      } catch {
        toast.error('Failed to fetch pending requests');
      }
    };

    fetchRequests();
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const handleReviewClick = (reqID, memberID) => {
    setSelectedReq({ reqID, memberID });
    setShowModal(true);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>List Pending Requests</h2>

      {loading && <p style={styles.loadingText}>Loading...</p>}
      {error && <p style={styles.errorText}>Error: {error}</p>}

      {Array.isArray(data) && data.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} style={styles.th}>{key}</th>
              ))}
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                {Object.values(item).map((val, i) => (
                  <td key={i} style={styles.td}>{String(val)}</td>
                ))}
                <td style={styles.td}>
                  <button
                    onClick={() => handleReviewClick(item.requestId, item.memberId)}
                    style={styles.button}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : !loading && <p style={styles.noDataText}>No pending requests found.</p>}

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <ReviewRequest
              reqID={selectedReq.reqID}
              memberID={selectedReq.memberID}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f4f9ff',
    borderRadius: '12px',
    boxShadow: '0 0 15px rgba(0, 128, 255, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0077cc',
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
  button: {
    padding: '6px 12px',
    backgroundColor: '#0077cc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    minWidth: '400px',
  },
};

export default ListPendingRequests;
