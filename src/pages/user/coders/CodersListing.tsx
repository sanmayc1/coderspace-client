import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import CustomPagination from '@/components/common/Pagination';
import SelectTag from '@/components/common/Select';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { getAllCoders } from '@/api/user/user.coders';
import type { IGetAllCodersResponse } from '@/types/response.types';
import { toast } from 'react-toastify';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import LoadingSpin from '@/components/common/LoadingSpin';





const CodersListing: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [badgeFilter, setBadgeFilter] = useState('');
  const navigate = useNavigate();
  const [coders,setCoders] = useState<IGetAllCodersResponse[]>([])
  const [loading ,setLoading] = useState(true)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };


  useEffect(()=>{
 
   async function fetchCoders(){
    try {
      const response = await getAllCoders()
      setCoders(response)
      setLoading(false)
    } catch (error) {
      toast.error("Something went wrong",toastifyOptionsCenter)
      setLoading(false)
    }
    
  }
      fetchCoders()
  },[search,sort,badgeFilter])


  return (
    <div className="container mx-auto px-4 py-40 max-w-7xl font-['anybody-regular'] ">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-12">coders</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
        <div className="relative w-full md:w-2/3 lg:w-3/4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Coders"
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="w-1/2 md:w-32">
            <SelectTag
              name="sort"
              label="Sort By"
              placeholder="Sort By"
              value={sort}
              handleChange={(val) => setSort(val)}
              options={[
                { label: 'Name', value: 'name' },
                { label: 'Rank', value: 'rank' },
              ]}
            />
          </div>
          <div className="w-1/2 md:w-36">
            <SelectTag
              name="badge"
              label="All Badge"
              placeholder="All Badge"
              value={badgeFilter}
              handleChange={(val) => setBadgeFilter(val)}
              options={[
                { label: 'All Badge', value: ' ' },
                { label: 'Gold', value: 'gold' },
                { label: 'Silver', value: 'silver' },
                { label: 'Platinum', value: 'platinum' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 ">
        

        {loading ? (
          <div className="flex justify-center items-center h-[50vh] w-full col-span-3">
            <LoadingSpin size={30}/>
          </div>
        ) : coders.map((coder) => (
          <div
            key={coder.userId}
            className="border border-gray-300 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow bg-white"
            onClick={() => navigate(`/coders/${coder.userId}`)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-red-100 flex-shrink-0">
                {/* Placeholder Avatar if image fails */}
                <img
                  src={coder.profileUrl || "/defaultProfile.jpg"}
                  alt={coder.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://ui-avatars.com/api/?name=Bill+Gates&background=ff0000&color=fff';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">{coder.name}</span>
                <span className="text-sm text-gray-500">{coder.username}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <img
                  src={`/${coder.badge}.png`}
                  alt={coder.badge}
                  className="w-6 h-7 object-contain"
                />
                <span className="text-[10px] font-bold mt-0.5 capitalize">{coder.badge}</span>
              </div>

              <Button
                variant={coder.isFollowing ? 'outline' : 'default'}
                size="sm"
                className={`min-w-[90px] h-9 rounded-md text-sm font-medium transition-colors ${
                  coder.isFollowing
                    ? 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {coder.isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <CustomPagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          className="w-auto"
        />
      </div>
    </div>
  );
};

export default CodersListing;
