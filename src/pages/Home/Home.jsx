import styles from "./Home.module.scss";
import Header from "@components/Header";
import Sort from "@components/Sort";
import Filters from "@components/Filters";
import CardsList from "@components/CardsList";
import Container from "@shared/Container";

const Home = () => {
  return (
    <div className={styles.home}>
      <Header />
      <Sort />
      <Container className={`${styles.contentWrapper}`}>
        <Filters />
        <CardsList />
      </Container>
    </div>
  );
};

export default Home;
