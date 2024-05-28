import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import { useContext } from "react";
import { AuthenticationContext } from "../contexts/AuthContext";

function PageNav() {
  const { user, logout } = useContext(AuthenticationContext);

  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/product" className={styles.ctaLink}>
            Product
          </NavLink>
        </li>
        {user ? (
          ""
        ) : (
          <li>
            <NavLink to="/signup" className={styles.ctaLink}>
              Signup
            </NavLink>
          </li>
        )}
        {user ? (
          <>
            <li>
              <NavLink to="/app" className={styles.ctaLink}>
                Discover
              </NavLink>
            </li>
            <li>
              <NavLink to="/user" className={styles.ctaLink}>
                User
              </NavLink>
            </li>
            <li>
              <NavLink to="#" onClick={logout} className={styles.ctaLink}>
                Logout
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className={styles.ctaLink}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default PageNav;
