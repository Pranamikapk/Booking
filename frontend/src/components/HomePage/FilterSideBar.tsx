import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../app/store'
import { resetFilters } from '../../features/home/hotels'
import Card from '../ui/Card'
import CardContent from '../ui/CardContent'

interface FilterSidebarProps {
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void
  search: string
  setSearchValue: (value: string) => void
  setFilters: (filters: any) => void
  // states: string[]
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  handleSearch,
  search,
  setSearchValue,
  setFilters,
  // states
}) => {
  const { filters } = useSelector((state: RootState) => state.hotel)
  const dispatch = useDispatch<AppDispatch>()

  const amenities = ['Wi-Fi', 'Parking', 'Pool', 'Gym', 'Kitchen', 'Fridge', 'A/C', 'TV']
  const handleResetFilters = () => {
    dispatch(resetFilters())
  }
  return (
    <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Filter by:</h2>
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search hotels..."
              className="w-full p-2 border rounded mb-4"
            />
            <button type="submit" className="w-full bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700">
              Search
            </button>
          </form>

          {/* <div className="mb-4">
            <h3 className="font-semibold mb-2">State</h3>
            <select
              value={filters.state}
              onChange={(e) => dispatch(setFilters({ state: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div> */}

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Price Range</h3>
            <div className="flex items-center justify-between">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters({ priceRange: [Number(e.target.value), filters.priceRange[1]] })}
                className="w-20 p-1 border rounded"
              />
              <span>to</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                className="w-20 p-1 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Amenities</h3>
            {amenities.map(amenity => (
              <label key={amenity} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => {
                    const newAmenities = filters.amenities.includes(amenity)
                      ? filters.amenities.filter(a => a !== amenity)
                      : [...filters.amenities, amenity]
                    setFilters({ amenities: newAmenities })
                  }}
                  className="mr-2"
                />
                {amenity}
              </label>
            ))}
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Guest Count</h3>
            <input
              type="number"
              value={filters.guestCount}
              onChange={(e) => setFilters({ guestCount: Number(e.target.value) })}
              min={1}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={handleResetFilters}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Reset Filters
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

export default FilterSidebar