import { API_PATHS } from "@constants/api_paths";
import { apiClient } from "@shared/api/apiClient";
import { BACKEND_BASE_URL } from "@constants/config";

const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const extractImageUrl = (url) => {
  if (!url) {
    return null;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${BACKEND_BASE_URL}/${url}`;
};

const buildApartmentTitle = (apartment) => {
  if (apartment?.title) {
    return apartment.title;
  }

  const roomsCount = apartment?.roomsCount ?? apartment?.rooms;
  const area = apartment?.area;
  const roomLabel =
    roomsCount === 0 ? "Студия" : `${roomsCount}-комн. квартира`;

  return area ? `${roomLabel}, ${area} м²` : roomLabel;
};

export const normalizeApartment = (apartment) => {
  if (!isRecord(apartment)) {
    return null;
  }

  const imageItems = Array.isArray(apartment.images) ? apartment.images : [];
  const normalizedImages = imageItems
    .map((image) => extractImageUrl(typeof image === "string" ? image : image.url))
    .filter(Boolean);
  const primaryImage = normalizedImages[0] ?? null;

  return {
    ...apartment,
    title: buildApartmentTitle(apartment),
    images: normalizedImages,
    image: primaryImage,
    roomsCount: apartment.roomsCount ?? apartment.rooms ?? null,
  };
};

const extractApartments = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (!isRecord(response)) {
    return [];
  }

  return (
    response.items ??
    response.results ??
    response.data ??
    response.apartments ??
    response.rows ??
    []
  );
};

const extractApartment = (response) => {
  if (!isRecord(response)) {
    return response;
  }

  return response.item ?? response.data ?? response.apartment ?? response;
};

const recommendationPayload = (options = {}) => ({
  weights: options.weights,
  onlyMatching: Boolean(options.onlyMatching),
});

export const getApartmentsRequest = async () => {
  const response = await apiClient(API_PATHS.APARTMENTS.list);
  return extractApartments(response).map(normalizeApartment).filter(Boolean);
};

export const getRecommendedApartmentsRequest = async (options = {}) => {
  const response = await apiClient(API_PATHS.APARTMENTS.recommendations, {
    method: "POST",
    body: recommendationPayload(options),
  });

  return extractApartments(response)
    .map((item) => {
      const apartment = normalizeApartment(item.apartment ?? item);
      if (!apartment) {
        return null;
      }

      return {
        ...apartment,
        rank: item.rank,
        score: item.score,
        criteriaScores: item.criteriaScores,
        weights: item.weights,
      };
    })
    .filter(Boolean);
};

export const getRecommendationCriteriaRequest = () =>
  apiClient(API_PATHS.APARTMENTS.recommendationCriteria);

export const compareApartmentsRequest = async (ids) => {
  const query = new URLSearchParams();
  ids.forEach((id) => query.append("ids", id));
  const response = await apiClient(`${API_PATHS.APARTMENTS.compare}?${query}`);
  return extractApartments(response).map(normalizeApartment).filter(Boolean);
};

export const getApartmentRequest = async (apartmentId) => {
  if (!apartmentId) {
    throw new Error("Apartment id is required");
  }

  const response = await apiClient(API_PATHS.APARTMENTS.details(apartmentId));
  return normalizeApartment(extractApartment(response));
};
