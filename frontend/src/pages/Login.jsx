import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { useContext, useState } from "react";
import Spinner from "../components/Spinner";
import { AuthenticationContext } from "../contexts/AuthContext";
import Alert from "../components/Alert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, success, loading } = useContext(AuthenticationContext);

  async function handleSubmit(e) {
    e.preventDefault();
    login(email, password);
  }

  return (
    <main className={styles.login}>
      <PageNav />
      {loading ? (
        <Spinner />
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <Alert message={error} type="danger" />}
          {success && <Alert message={success} type="success" />}
          <div className={styles.row}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <div>
            <Button type="primary">Login</Button>
          </div>
        </form>
      )}
    </main>
  );
}
