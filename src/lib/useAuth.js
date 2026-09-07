import {
  onAuthStateChanged
} from "firebase/auth";
import {
  useEffect,
  useState
} from "react";
import {
  auth
} from "./firebase";

export function useAuth() {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      }
    );
  }, []);

  return {
    user,
    loading
  };
}
