import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-lg">Places to Visit</h2>
      <div>
        {trip.tripData?.itinerary &&
          Object.keys(trip.tripData.itinerary)
            .sort()
            .map((dayKey, index) => {
              const dayDetails = trip.tripData.itinerary[dayKey];
              console.log(dayDetails);

              const formattedDayKey = `Day ${dayKey.replace("day", "")}`;
              return (
                <div key={index}>
                  <h2 className="font-semibold">{formattedDayKey}</h2>
                  <div className="my-3 grid grid-cols-2 gap-3">
                    {dayDetails.map((place, idx) => (
                      <div key={idx}>
                        <h2 className="font-medium text-sm text-orange-600">
                          {place.time}
                        </h2>
                        <PlaceCardItem place={place} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default PlacesToVisit;
