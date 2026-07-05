import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function GoogleAuthButton() {
  const { googleAuth } = useAuth();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) return null; // Not configured yet — hide instead of erroring

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    try {
      await googleAuth(response.credential).unwrap();
      toast.success("Signed in with Google!");
      navigate("/");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in failed. Please try again.")}
        useOneTap={false}
        width="320"
      />
    </div>
  );
}
