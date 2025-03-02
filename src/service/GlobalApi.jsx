import axios from "axios"
const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY; // Ensure this value is set correctly
const BASE_URL = `https://places.googleapis.com/v1/places:searchText?key=${API_KEY}`;

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-FieldMask": "places.photos,places.displayName,places.id",
  },
};

export const GetPlaceDetails=(data)=>axios.post(BASE_URL,data,config)

export const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=600&key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;