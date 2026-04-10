import styles from "./CardsList.module.scss";
import Card from "@components/Card";
import { apartments } from "@constants/apartments";

const CardsList = () => {
  return (
    <section className={styles.cards}>
      <div className={styles.grid}>
        {apartments.map((apartment) => (
          <Card
            key={apartment.id}
            id={apartment.id}
            image={apartment.image}
            title={apartment.title}
            address={apartment.address}
            price={apartment.price}
            area={apartment.area}
            rooms={apartment.rooms}
            // onDetailsClick={handleDetailsClick}
          />
        ))}
      </div>
      <div className={styles.pagination}></div>
    </section>
  );
};

export default CardsList;
