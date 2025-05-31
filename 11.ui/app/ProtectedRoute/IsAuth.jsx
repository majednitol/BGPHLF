'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function IsAuth(Component) {
  return function AuthWrapper(props) {
    const router = useRouter();
    const [isAllowed, setIsAllowed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const user = localStorage.getItem("ConnectedAccountUser");

      if (!user || user === "no user") {
        router.replace("/login");
      } else {
        setIsAllowed(true);
      }

      setLoading(false);
    }, [router]);

    if (loading || !isAllowed) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}

export default IsAuth;
