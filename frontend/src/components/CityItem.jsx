import { useCities } from "../contexts/CitiesContext";
import styles from "./CityItem.module.css";

import { Link } from "react-router-dom";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, date, _id, position } = city;

  function handleDelete(e) {
    e.preventDefault();
    deleteCity(_id);
  }
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          _id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${_id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.name}>{cityName}</span>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;{" "}
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
