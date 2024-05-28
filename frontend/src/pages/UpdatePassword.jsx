import React, { useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import Button from "../components/Button";

import { useUser } from "../contexts/UserContext";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

const User = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const { updatePassword, error, success, loading } = useUser();

  function handleSubmit(e) {
    e.preventDefault();
    updatePassword(currentPassword, newPassword, newPasswordConfirm);
  }

  return (
    <main className={styles.login}>
      <PageNav />

      <main className={styles.login}>
        {loading ? (
          <Spinner />
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <Alert message={error} type="danger" />}
            {success && <Alert message={success} type="success" />}
            <div className={styles.row}>
              <label htmlFor="password">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
              />
            </div>
            <div className={styles.row}>
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="newPassword"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>
            <div className={styles.row}>
              <label htmlFor="password">New Password Confirm</label>
              <input
                type="password"
                id="newPasswordConfirm"
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                value={newPasswordConfirm}
              />
            </div>
            <div>
              <Button type="primary">Update Password</Button>
            </div>
          </form>
        )}
      </main>
    </main>
  );
};

export default User;
