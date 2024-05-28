import { useContext } from "react";
import styles from "./User.module.css";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";

function User() {
  const navigate = useNavigate();
  const { user } = useUser();

  const { logout } = useContext(AuthenticationContext);

  function HandleClick() {
    logout();
    navigate("/");
  }
  return (
    <div className={styles.user}>
      {user ? (
        <>
          <img src="/8881290.jpg" alt="hello" />
          <span>Welcome , {user.name}</span>
          <button onClick={HandleClick}>Logout</button>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default User;
