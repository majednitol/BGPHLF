'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { registerCompanyWithMember } from '../../features/company/companySlice';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { registerUser } from '../../features/user/userSlice';

const RegisterCompanyWithMember = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    legalEntityName: '',
    industryType: '',
    addressLine1: '',
    city: '',
    state: '',
    postcode: '',
    economy: '',
    phone: '',
    orgEmail: '',
    abuseEmail: '',
    isMemberOfNIR: false,
    memberID: '',
    memberName: '',
    memberCountry: '',
    memberEmail: '',
    org: '',
    companyID: '',
    createdAt: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = uuidv4().slice(0, 8);
    const updatedForm = { ...formData, memberID: id, companyID: id };

    if (!updatedForm.org || updatedForm.org === 'Select an organization') {
      toast.error('❌ Please select a valid organization.');
      return;
    }

    
    const registerRes = await dispatch(
      registerUser({
        userId: id,
        org: "AfrinicMSP",
        affiliation: 'apnic.lir1.technical',
      })
    );

    if (registerRes.meta.requestStatus === 'fulfilled') {
    
      const createRes = await dispatch(registerCompanyWithMember(updatedForm));
      if (createRes.meta.requestStatus === 'fulfilled') {
        toast.success('✅ Company registered successfully');
      } else {
        toast.error('⚠️ Failed to create company in DB.');
      }
    } else {
      toast.error('❌ Failed to register company on blockchain.');
    }
  };

  const handleLoginRedirect = () => {
    router.push('/user/login-user');
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.heading}>Register Company with Member</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {[
          ['legalEntityName', 'Legal Entity Name'],
          ['industryType', 'Industry Type'],
          ['addressLine1', 'Address Line 1'],
          ['city', 'City'],
          ['state', 'State'],
          ['postcode', 'Postcode'],
          ['economy', 'Economy'],
          ['phone', 'Phone'],
          ['orgEmail', 'Org Email'],
          ['abuseEmail', 'Abuse Email'],
          ['memberName', 'Member Name'],
          ['memberCountry', 'Member Country'],
          ['memberEmail', 'Member Email'],
        ].map(([name, placeholder]) => (
          <input
            key={name}
            name={name}
            placeholder={placeholder}
            type={name.includes('Email') ? 'email' : 'text'}
            value={formData[name]}
            required
            onChange={handleChange}
            style={styles.input}
          />
        ))}

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="isMemberOfNIR"
            checked={formData.isMemberOfNIR}
            onChange={handleChange}
          />
          Is Member of NIR
        </label>

        <select name="org" value={formData.org} onChange={handleChange} style={styles.select}>
          {[
            'Select an organization',
            'AfrinicMSP',
            'ApnicMSP',
            'ArinMSP',
            'RipenccMSP',
            'LacnicMSP',
            'RonoMSP',
          ].map((o) => (
            <option key={o} value={o === 'Select an organization' ? '' : o}>
              {o}
            </option>
          ))}
        </select>

        <button type="submit" style={styles.button}>
          Register
        </button>

        <button
          type="button"
          onClick={handleLoginRedirect}
          style={{ ...styles.button, backgroundColor: '#28a745', marginTop: '10px' }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  formContainer: {
    maxWidth: '600px',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    border: '2px solid #0077cc',
    borderRadius: '8px',
    fontSize: '16px',
    transition: '0.3s',
  },
  select: {
    padding: '10px',
    border: '2px solid #0077cc',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#444',
  },
  button: {
    padding: '12px',
    backgroundColor: '#00cc66',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: '0.3s',
  },
};

export default RegisterCompanyWithMember;
