export const GoogleSignIn = () => {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  url.searchParams.set(
    "scope",
    "https://www.googleapis.com/auth/userinfo.profile",
  );
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("response_type", "token");
  url.searchParams.set("state", "state_parameter_passthrough_value");
  url.searchParams.set(
    "redirect_uri",
    "http://localhost:5173/auth/google/callback",
  );
  url.searchParams.set(
    "client_id",
    "995716039701-h12pantc995tlan188mld4t1e8t3ui8b.apps.googleusercontent.com",
  );

  return <a href={url.toString()}>Continue with Google</a>;
};
