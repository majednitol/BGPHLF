'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';  
import { ClipLoader } from 'react-spinners';

function IsAuth(Component) {
  return function AuthWrapper(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("authToken");

      try {
        if (!token) {
          router.replace("/login-user");
        } else {
          const decoded = jwtDecode(token);
          const role = decoded?.role;

          if (!role) {
            localStorage.removeItem("authToken");
            router.replace("/login-user");
          }
          
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        router.replace("/login-user");
      } finally {
        setLoading(false);
      }
    }, [router]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <ClipLoader size={50} color="#123abc" />
        </div>

    return <Component {...props} />;
  };
}

export default IsAuth;
