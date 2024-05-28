import React, { useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import Button from "../components/Button";

import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";

const User = () => {
  const { user } = useUser();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const { updateUser, error, success, loading } = useUser();
  const [photo, setPhoto] = useState("");

  const navigate = useNavigate();

  function handlePass(e) {
    e.preventDefault();
    navigate("/userPassword");
  }
  function handleSubmit(e) {
    e.preventDefault();
    updateUser(name, email);
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
            <div>
              <Button type="primary">Update</Button>
            </div>
            <div>
              <Button type="primary" onClick={handlePass}>
                Update Password
              </Button>
            </div>
          </form>
        )}
      </main>
    </main>
  );
};

export default User;
