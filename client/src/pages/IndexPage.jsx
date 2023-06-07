import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((response) => {
      console.log(response.data);
      setPlaces([...response.data]);
    });
  }, []);
  return (
    <div className=" mt-8 grid grid-cols-2 gap-6 gap-x-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {/* <Header /> */}
      {places.length > 0 &&
        places.map((place) => (
          <Link to={"/place/" + place._id}>
            <div className="flex bg-gray-500 rounded-2xl">
              {place.photos?.[0] && (
                <img
                  key={place?._id}
                  className=" rounded-2xl object-cover aspect-square"
                  src={"http://localhost:1337/" + place.photos?.[0]}
                  alt=""
                />
              )}
            </div>
            <h2 className="font-bold truncate">{place.address}</h2>
            <h2 className="text-sm truncate text-gray-700">{place.title}</h2>
            <div className="mt-1">
              <span className=" font-bold">${place.price}</span> night
            </div>
          </Link>
        ))}
    </div>
  );
}
