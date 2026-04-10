import styles from "./Home.module.scss";
import Header from "@components/Header";
import Sort from "@components/Sort";
import Filters from "@components/Filters";
import CardsList from "@components/CardsList";
import Container from "@shared/Container";

const Home = () => {
  const handleApplyFilters = (filters) => {
    console.log("Applied filters:", filters);
    // добавить логику для применения фильтров к данным
  };

  return (
    <div className={styles.home}>
      <Header />
      <Sort />
      <Container className={`${styles.contentWrapper}`}>
        <Filters onApply={handleApplyFilters} />
        <CardsList />
      </Container>
    </div>
  );
};

export default Home;
