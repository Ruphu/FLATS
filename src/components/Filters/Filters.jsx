import Checkbox from "@shared/Checkbox";
import styles from "./Filters.module.scss";
import RangeInput from "@shared/RangeInput";
import Container from "@shared/Container";

const Filters = () => {
  return (
    <Container>
      <section className={styles.catalog}>
        <div className={styles.filters}>
          <h2 className={styles.filters_title}>Фильтрация</h2>
          <div className={styles.filters_flatType_container}>
            <h3 className={styles.filters_flatType_title}>Тип квартиры</h3>
            <Checkbox name="flatType" value="new" label="Новостройка" />
            <Checkbox name="flatType" value="secondary" label="Вторичка" />
          </div>
          <div className={styles.filters_flatArea_container}>
            <RangeInput
              title="Площадь, м²"
              nameMin="areaMin"
              nameMax="areaMax"
            />
          </div>
        </div>
        <div className={styles.cards}></div>
      </section>
    </Container>
  );
};

export default Filters;
