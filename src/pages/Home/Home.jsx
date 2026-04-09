import styles from "./Home.module.scss";
import Header from "@components/Header";
import Sort from "@components/Sort";
import Filters from "@components/Filters";
import Cards from '@components/Cards'

const Home = () => {
  return (
    <div className={styles.home}>
      <Header />
      <Sort />
      <div className={`${styles.content_wrapper} container`}>
        <Filters />
        <Cards></Cards>
      </div>
    </div>
  );
};

export default Home;
