import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks";
import Header from "@components/Header";
import Sort from "@components/Sort";
import Filters from "@components/Filters";
import CardsList from "@components/CardsList";
import Container from "@shared/Container";
import styles from "./Home.module.scss";

const equalWeights = {
  price: 10,
  area: 10,
  rooms: 10,
  district: 10,
  transport: 10,
  infrastructure: 10,
  condition: 10,
  house_type: 10,
  floor: 10,
  balcony_loggia: 10,
};

const priorityPresets = {
  balanced: {
    label: "Сбалансировано",
    weights: {
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
    },
  },
  neutral: {
    label: "Равные веса",
    weights: equalWeights,
  },
  budget: {
    label: "Важнее цена",
    weights: {
      price: 30,
      area: 10,
      rooms: 8,
      district: 8,
      transport: 10,
      infrastructure: 7,
      condition: 6,
      house_type: 5,
      floor: 4,
      balcony_loggia: 3,
    },
  },
  transport: {
    label: "Ближе к метро",
    weights: {
      price: 14,
      area: 9,
      rooms: 8,
      district: 13,
      transport: 30,
      infrastructure: 14,
      condition: 5,
      house_type: 4,
      floor: 3,
      balcony_loggia: 2,
    },
  },
  comfort: {
    label: "Комфорт и площадь",
    weights: {
      price: 12,
      area: 24,
      rooms: 18,
      district: 10,
      transport: 9,
      infrastructure: 12,
      condition: 12,
      house_type: 9,
      floor: 7,
      balcony_loggia: 7,
    },
  },
};

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState("all");
  const [filters, setFilters] = useState(null);
  const [onlyMatching, setOnlyMatching] = useState(false);
  const [priority, setPriority] = useState("balanced");
  const [customWeights, setCustomWeights] = useState(
    priorityPresets.balanced.weights,
  );
  const [compareIds, setCompareIds] = useState([]);
  const weights =
    priority === "custom" ? customWeights : priorityPresets[priority].weights;

  const normalizedWeights = useMemo(() => {
    const total =
      Object.values(weights).reduce((sum, value) => sum + Number(value), 0) ||
      1;
    return Object.fromEntries(
      Object.entries(weights).map(([key, value]) => [
        key,
        Number(value) / total,
      ]),
    );
  }, [weights]);

  const handleWeightChange = (criterion, value) => {
    setPriority("custom");
    setCustomWeights((current) => ({
      ...current,
      [criterion]: Number(value),
    }));
  };

  const handlePriorityChange = (nextPriority) => {
    setPriority(nextPriority);
    if (nextPriority !== "custom") {
      setCustomWeights(priorityPresets[nextPriority].weights);
    }
  };

  const handleCompareToggle = (apartmentId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

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
        priority={priority}
        priorityPresets={priorityPresets}
        weights={weights}
        compareCount={compareIds.length}
        onModeChange={(newMode) => {
          if (newMode === "recommended" && !isAuthenticated) {
            navigate("/login");
            return;
          }
          setMode(newMode);
        }}
        onOnlyMatchingChange={setOnlyMatching}
        onPriorityChange={handlePriorityChange}
        onWeightChange={handleWeightChange}
      />
      <Container className={styles.contentWrapper}>
        <Filters onApply={setFilters} />
        <CardsList
          mode={mode}
          filters={filters}
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
