import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { HealthContext } from "@/context/Health";

function IsAuth(Component) {
  const AuthWrapper = (props) => {
    const { loading, ConnectedAccountUser } = useContext(HealthContext);
    const router = useRouter();

    if (loading) {
      return <div>Loading...</div>;
    }

    useEffect(() => {
      if (ConnectedAccountUser === 0) {
        router.push("/");
      }
    }, [ConnectedAccountUser, router]);

    return <Component {...props} />;
  };

  return AuthWrapper;
}

export default IsAuth;
