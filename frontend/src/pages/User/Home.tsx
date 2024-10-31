import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import HeroSection from "../../components/HomePage/Hero";
import MostPicked from "../../components/HomePage/MostPicked";
import PopularChoice from "../../components/HomePage/PopularChoice";
import SearchCard from "../../components/HomePage/SearchCard";

const Home = () => {
  const [states, setStates] = useState<string[]>([])
  const { hotels } = useSelector((state: RootState) => state.hotel)

  useEffect(() => {
    if (hotels.length > 0) {
      const uniqueStates = Array.from(new Set(hotels.map(hotel => hotel.address.state))).filter(
        (state): state is string => state !== undefined
      )
      setStates(uniqueStates)
    }
  }, [hotels])

  return (
    <>
      <div className="container mx-auto px-4 py-5">
        <HeroSection />
        <br />
        <SearchCard states={states} />
        <h2 className="text-2xl font-bold mb-6 mx-6">Most Picked</h2>
        <MostPicked />
        <h2 className="text-2xl font-bold mb-4 mx-8 my-8">Popular Choice</h2>
        <PopularChoice />
      </div>
    </>
  );
};

export default Home;
