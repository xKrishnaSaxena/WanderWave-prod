import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { useState } from "react";

import Alert from "../components/Alert";
import Spinner from "../components/Spinner";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const URL = "https://wanderwave-backend-aa9d.onrender.com";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Check if passwords match
    if (password !== passwordConfirm) {
      // Handle password mismatch error
      setError("Passwords do not match");
      return;
    }

    try {
      // Make the POST request to your backend API
      const response = await fetch(`${URL}/api/v1/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          passwordConfirm: passwordConfirm,
        }),
      });

      // Check if request was successful (status code 200-299)
      if (response.ok) {
        // Handle successful signup
        setLoading(false);
        setSuccess("Signup Successful!");
        // Optionally, you can redirect the user to another page
      } else {
        // Handle errors from the server
        setLoading(false);
        setError("Incorrect Email or Password");
        // Optionally, you can parse the response body to get more information about the error
      }
    } catch (error) {
      // Handle errors related to network issues, etc.
      setLoading(false);
      setError(error.message);
    }
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
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className={styles.row}>
            <label htmlFor="photo">Photo</label>
            <input
              type="file"
              id="photo"
              onChange={(e) => setPhoto(e.target.value)}
              value={photo}
            />
          </div>
          <div className={styles.row}>
            <label htmlFor="password">Password (Length &gt;= 8)</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className={styles.row}>
            <label htmlFor="passwordConfirm">
              Confirm Password (Length &gt;= 8)
            </label>
            <input
              type="password"
              id="passwordConfirm"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              value={passwordConfirm}
            />
          </div>

          <div>
            <Button type="primary">Signup</Button>
          </div>
        </form>
      )}
    </main>
  );
}
