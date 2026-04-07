import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import logo from "@assets/images/logo.png";
import Container from "@shared/Container";

const Header = () => {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.logo_wrapper}>
            <img src={logo} alt="logo" className={styles.logo} />
          </div>
          <nav className={styles.nav}>
            <Link to="/registration" className={styles.link}>
              Вход
            </Link>
            <Link to="/profile" className={styles.link}>
              Избранное
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;
