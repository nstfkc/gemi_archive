import { useNavigate, useRouteParams } from "@/lib/client/router";
import { useEffect } from "react";

const OAuthCallback = () => {
  const params = useRouteParams();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.hash.slice(1));
    fetch(`/api/auth/${params.oauth}/sign-in?${query.toString()}`, {})
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // TODO: get redirect form config
          navigate("/app/dashboard");
        }
      });
  }, []);

  return <div>Authenticating with {params.oauth}...</div>;
};

export default OAuthCallback;
