import { Calendar, MapPin, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { setFilters, setSearchValue } from "../../features/home/hotels";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface SearchCardProps {
  states: string[];
}

const SearchCard: React.FC<SearchCardProps> = ({ states }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { hotel, filters } = useSelector((state: RootState) => state.hotel)
  const [selectedState, setSelectedState] = useState(filters.state);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(filters.guestCount);
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (checkInDate) {
      const nextDay = new Date(checkInDate)
      nextDay.setDate(nextDay.getDate() + 1)
      setCheckOutDate(nextDay.toISOString().split('T')[0])
    }
  }, [checkInDate])

  const onSubmit = () => {
    dispatch(setSearchValue(selectedState))
    dispatch(setFilters({ state: selectedState, guestCount: guests , checkInDate , checkOutDate}))
    navigate('/search')
  }

  return (
    <div className="bg-white max-w-4xl mx-auto p-5 shadow-lg rounded-lg">
      <div className="flex flex-nowrap items-center justify-between space-x-4">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-gray-600" />
          <select
            className="border rounded px-2 py-1"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value=" ">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <Calendar className="w-10 h-5 mr-2 text-gray-600" />
          <Input
            type="date"
            placeholder="Check in"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            min={checkInDate}
            className="mr-2 w-full sm:w-auto"
          />
          <Input
            type="date"
            placeholder="Check out"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            min={checkOutDate}
            className="w-full sm:w-auto"
          />
        </div>

        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-gray-600" />
          <select
            className="border rounded px-2 py-1"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'Persons'}</option>
            ))}
          </select>
        </div>

        {/* <div className="flex items-center">
          <Search className="w-5 h-5 mr-2 text-gray-600" />
          <Input
            type="text"
            placeholder="Search hotels..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div> */}

        <Button className="primary hover:bg-blue-700 text-white h-10 px-4" onClick={onSubmit}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchCard;
