import Container from '@shared/Container';
import styles from './Sort.module.scss';

const Sort = () => {
  return (
    <Container>
      <section className={styles.greetings}>
        <h1 className={styles.greetings_title}>Все квартиры</h1>
        <div className={styles.greetings_btn_wrapper}>
          <button className={styles.greetings_btn}>
            Сортировка по рейтингу
          </button>
        </div>
      </section>
    </Container>
  );
};

export default Sort;
