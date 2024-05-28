// src/components/Sidebar.jsx

import React from "react";
import styles from "./Sidebar.module.css";
import classNames from "classnames";
import Logo from "./Logo";
import AppNav from "./AppNav";
import { Outlet } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import Alert from "./Alert";
import { useSidebar } from "../contexts/SidebarContext";

function Sidebar() {
  const { error, success } = useCities();
  const { toggleSidebar, isOpen } = useSidebar();
  return (
    <>
      <button className={classNames(styles.closeBtn)} onClick={toggleSidebar}>
        {isOpen ? "Show Map" : "Show Cities"}
      </button>
      <div className={classNames(styles.sidebar, { [styles.open]: isOpen })}>
        <Logo />
        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}
        <AppNav />
        <div>
          <Outlet />
        </div>
        <footer className={styles.footer}>
          <p className={styles.copyright}>
            &copy; Copyright {new Date().getFullYear()} by WanderWave Inc.
          </p>
        </footer>
      </div>
    </>
  );
}

export default Sidebar;
