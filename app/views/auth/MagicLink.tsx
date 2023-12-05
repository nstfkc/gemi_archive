import { useNavigate } from "@/lib/client/router";
import { useEffect } from "react";

const Redirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/app/dashboard");
  }, [navigate]);
  return null;
};

const MagicLink = ({ data }: { data: { success: boolean } }) => {
  const { success } = data;
  if (success) {
    return <Redirect />;
  }
  return <div>Failed</div>;
};

export default MagicLink;
