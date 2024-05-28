import styles from "./Homepage.module.css";
import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
import { useUser } from "../contexts/UserContext";

export default function Homepage() {
  const { user } = useUser();
  return (
    <main className={styles.homepage}>
      <PageNav />

      <section>
        <h1>
          Welcome to WanderWave,
          <br />
          Your Gateway to Global Adventures.
        </h1>
        <h2>
          Discover the world, share your adventures, and connect with fellow
          travelers. Capture memories, explore hidden gems, and access essential
          guides. Your journey starts here.
        </h2>
        {user ? (
          ""
        ) : (
          <Link to="/Login" className="cta">
            Start Discovering...
          </Link>
        )}
      </section>
    </main>
  );
}
