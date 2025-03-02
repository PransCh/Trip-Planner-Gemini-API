import { Button } from "@/components/ui/button";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState("https://placehold.co/200x120");

  useEffect(() => {
    if (place) {
      GetPlacePhoto();
    }
  }, [place]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place.placeName,
    };
    try {
      const resp = await GetPlaceDetails(data);
      if (resp.data.places && resp.data.places[0]?.photos?.length > 0) {
        const photoName = resp.data.places[0].photos[0].name;
        const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
        setPhotoUrl(PhotoUrl);
      } else {
        console.warn("No photos found for this place.");
        setPhotoUrl("https://placehold.co/200x120");
      }
    } catch (error) {
      console.error("Failed to fetch place details:", error);
      setPhotoUrl("https://placehold.co/200x120");
    }
  };

  if (!place) {
    return <div>No place data available.</div>;
  }

  return (
    <div className="border rounded-xl p-3 my-2 flex gap-5">
      <img
        src={photoUrl}
        alt={place.placeName}
        className="w-[200px] h-[120px] rounded-lg hover:scale-105 transition-all hover:shadow-md cursor-pointer"
      />
      <div>
        <h2 className="font-bold text-md">{place.placeName}</h2>
        <p className="text-sm text-gray-400">{place?.placeDetails}</p>
        <div className="flex gap-2 my-1">
          <h2 className="text-sm text-gray-800">⭐{place?.rating}</h2>
          <h2 className="text-sm text-gray-800">💰{place?.ticketPricing}</h2>
        </div>
        <Button
          size="sm"
          aria-label="Open location in Google Maps"
          onClick={() =>
            window.open(
              "https://www.google.com/maps/search/?api=1&query=" + place?.placeName,
              "_blank"
            )
          }
        >
          <FaMapLocationDot />
        </Button>
      </div>
    </div>
  );
}

export default PlaceCardItem;