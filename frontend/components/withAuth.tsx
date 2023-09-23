// withAuth.tsx

import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

const withAuth = (Component: any) => {
  return (props: any) => {
    const router = useRouter();


    return <Component {...props} />;
  };
};

export default withAuth;
