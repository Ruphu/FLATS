import styles from "./Home.module.scss";
import Header from "@components/Header";
import Sort from "@components/Sort";
import Filters from "@components/Filters";

const Home = () => {
  return (
    <div className={styles.home}>
      <Header />
      <Sort />
      <Filters />
    </div>
  );
};

export default Home;
