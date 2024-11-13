import { Grid, List } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../app/store'
import FilterSidebar from '../../components/HomePage/FilterSideBar'
import HotelList from '../../components/HomePage/HotelList'
import SearchCard from '../../components/HomePage/SearchCard'
import Spinner from '../../components/Spinner'
import { fetchHotels, setFilters, setSearchValue, setSortBy } from '../../features/home/hotels'


const Search: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { filteredHotels ,sortBy , isLoading, error, search ,filters ,hotels} = useSelector((state: RootState) => state.hotel)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [states, setStates] = useState<string[]>([])

  useEffect(() => {
    if (filters.checkInDate) {
      dispatch(fetchHotels({ checkInDate: filters.checkInDate }));
    }  }, [dispatch, filters.checkInDate])

  useEffect(() => {
    if (hotels.length > 0) {
      const uniqueStates = Array.from(new Set(hotels.map(hotel => hotel.address.state))).filter(
        (state): state is string => state !== undefined
      )
      setStates(uniqueStates)
    }
  }, [hotels])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(setSearchValue(search))
  }

const handleSortChange = (method: typeof sortBy) => {
  dispatch(setSortBy(method))
}

  if (isLoading) return <Spinner/>
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchCard states={states}/>
      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <FilterSidebar 
          handleSearch={handleSearch} 
          search={search} 
          setSearchValue={(value: string)=> dispatch(setSearchValue(value))} 
          setFilters={(filters)=> dispatch(setFilters(filters))} 
          // states = {filters} 
          />
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold mb-4 sm:mb-0">
            {filteredHotels ? `${filteredHotels.length} properties found` : 'No properties found'}
            </h1>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                className="p-2 border rounded"
              >
                <option value="recommended">Our top picks</option>
                <option value="price-low">Price (low to high)</option>
                <option value="price-high">Price (high to low)</option>
                {/* <option value="rating">Rating</option> */}
              </select>
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'text-blue-600' : ''}`}>
                <List />
              </button>
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'text-blue-600' : ''}`}>
                <Grid />
              </button>
            </div>
          </div>
          <HotelList hotels={filteredHotels} viewMode={viewMode} />
        </div>
      </div>
    </div>
  )
}

export default Search