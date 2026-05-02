import { useMemo, useState } from "react";
import Header from "@components/Header";
import Sort from "@components/Sort";
import Filters from "@components/Filters";
import CardsList from "@components/CardsList";
import Container from "@shared/Container";
import styles from "./Home.module.scss";

const defaultWeights = {
  price: 18,
  area: 12,
  rooms: 10,
  district: 12,
  transport: 12,
  infrastructure: 10,
  condition: 8,
  house_type: 7,
  floor: 6,
  balcony_loggia: 5,
};

const loadStoredIds = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
};

const Home = () => {
  const [mode, setMode] = useState("all");
  const [onlyMatching, setOnlyMatching] = useState(false);
  const [weights, setWeights] = useState(defaultWeights);
  const [compareIds, setCompareIds] = useState(() => loadStoredIds("compareIds"));

  const normalizedWeights = useMemo(() => {
    const total = Object.values(weights).reduce((sum, value) => sum + Number(value), 0) || 1;
    return Object.fromEntries(
      Object.entries(weights).map(([key, value]) => [key, Number(value) / total])
    );
  }, [weights]);

  const handleWeightChange = (criterion, value) => {
    setWeights((current) => ({
      ...current,
      [criterion]: Number(value),
    }));
  };

  const handleCompareToggle = (apartmentId) => {
    setCompareIds((current) => {
      const next = current.includes(apartmentId)
        ? current.filter((id) => id !== apartmentId)
        : [...current, apartmentId].slice(-4);
      localStorage.setItem("compareIds", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className={styles.home}>
      <Header />
      <Sort
        mode={mode}
        onlyMatching={onlyMatching}
        weights={weights}
        compareCount={compareIds.length}
        onModeChange={setMode}
        onOnlyMatchingChange={setOnlyMatching}
        onWeightChange={handleWeightChange}
      />
      <Container className={`${styles.contentWrapper}`}>
        <Filters />
        <CardsList
          mode={mode}
          weights={normalizedWeights}
          onlyMatching={onlyMatching}
          compareIds={compareIds}
          onCompareToggle={handleCompareToggle}
        />
      </Container>
    </div>
  );
};

export default Home;
