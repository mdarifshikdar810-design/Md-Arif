
import React, { useEffect, useState } from 'react';
import { LandListing, BuildType } from '../types';
import { fetchListings } from '../services/listingService';

interface MarketProps {
  onBuy: (productNo: string, amount: number) => void;
}

// Fixed the component definition to correctly use React.FC with MarketProps generic and destructure props
export const Market: React.FC<MarketProps> = ({ onBuy }) => {
  const [listings, setListings] = useState<LandListing[]>([]);
  const [filter, setFilter] = useState<BuildType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchListings();
      setListings(data);
    } catch (error) {
      console.error("Error loading listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredListings = listings
    .filter(item => {
      const matchesFilter = filter === 'All' || item.buildType === filter;
      const matchesSearch = item.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getIcon = (type: BuildType) => {
    switch (type) {
      case 'Home': return 'fa-house text-blue-400';
      case 'Farm': return 'fa-wheat-awn text-green-400';
      case 'Build': return 'fa-hammer text-yellow-400';
      default: return 'fa-cube';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Header Section */}
      <div className="flex flex-col gap-4 bg-white/2 p-5 rounded-2xl border border-white/5 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e2136e]/10 flex items-center justify-center border border-[#e2136e]/20">
              <i className="fas fa-search text-[#e2136e] text-xs"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Search Marketplace</h3>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Find listings by code</p>
            </div>
          </div>
          {!loading && searchQuery && (
            <div className="bg-white/5 px-2 py-1 rounded text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">
              {filteredListings.length} results found
            </div>
          )}
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#e2136e] transition-colors">
            <i className="fas fa-hashtag"></i>
          </div>
          <input 
            type="text"
            placeholder="Search by Code (e.g. #A1B2C3)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#e2136e]/30 focus:border-[#e2136e]/50 transition-all placeholder:text-gray-600 font-mono text-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <i className="fas fa-times-circle"></i>
            </button>
          )}
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
            {(['All', 'Home', 'Farm', 'Build'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  filter === cat 
                    ? 'bg-[#e2136e] border-[#e2136e] text-white shadow-lg shadow-[#e2136e]/20' 
                    : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            onClick={loadData}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 shrink-0"
            title="Refresh Market"
          >
            <i className={`fas fa-rotate-right text-xs ${loading ? 'fa-spin text-[#e2136e]' : ''}`}></i>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-white/5 border border-white/10 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-white/2 p-16 rounded-3xl border border-dashed border-white/5 flex flex-col items-center justify-center text-center gap-6 animate-in fade-in duration-700">
          <div className="relative">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-600 text-3xl">
              <i className="fas fa-box-open"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#e2136e] rounded-full flex items-center justify-center border-4 border-[#0a0a0a]">
              <i className="fas fa-times text-white text-[8px]"></i>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              {searchQuery ? `No matches for "${searchQuery}"` : `No ${filter !== 'All' ? filter : ''} Listings Found`}
            </h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
              {searchQuery 
                ? 'Check the listing code or try clearing your search filters to find what you need.' 
                : 'The marketplace is currently empty. Be the first one to list your land and start earning!'}
            </p>
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[#e2136e] text-xs font-bold uppercase tracking-widest hover:underline"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in duration-500">
          {filteredListings.map((item) => (
            <div 
              key={item.id} 
              className="bg-white/5 border border-white/10 rounded-2xl hover:border-[#e2136e]/50 transition-all group flex flex-col shadow-xl backdrop-blur-sm relative overflow-hidden cursor-pointer"
              onClick={() => onBuy(item.code, item.price)}
            >
              <div className="relative h-44 w-full overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="Property" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                    <i className={`fas ${getIcon(item.buildType)} text-4xl opacity-20`}></i>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 flex items-center gap-2">
                    <i className={`fas ${getIcon(item.buildType)} text-[8px]`}></i>
                    {item.buildType}
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                   <div className="bg-black/60 backdrop-blur-md text-[#e2136e] px-3 py-1 rounded-full text-xs font-black border border-white/10">
                     {item.price} BDT
                   </div>
                </div>
                {/* Buy Hover Overlay */}
                <div className="absolute inset-0 bg-[#e2136e]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                   <span className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                     Buy Now
                   </span>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-gray-500 mb-0.5 tracking-widest text-left">Coordinates</span>
                      <div className="flex items-center gap-2 text-xs">
                        <i className="fas fa-location-dot text-blue-500 text-[10px]"></i>
                        <span>X: <span className="text-white font-mono font-bold">{item.landX}</span></span>
                        <span className="text-white/20">|</span>
                        <span>Y: <span className="text-white font-mono font-bold">{item.landY}</span></span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-[#e2136e] mb-0.5 tracking-widest text-left">Seller Payment</span>
                      <div className="flex items-center gap-2 text-xs">
                        <i className="fas fa-mobile-screen-button text-[#e2136e] text-[10px]"></i>
                        <span className="text-white font-mono font-bold">{item.sellerBkash}</span>
                        <span className="bg-[#e2136e]/10 text-[#e2136e] text-[8px] px-1 rounded font-bold">bKash</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono text-right">
                    <div className="text-gray-600 uppercase font-bold mb-0.5">Listed On</div>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex flex-col items-center gap-1 group-hover:border-[#e2136e]/30 transition-colors relative">
                  <span className="text-[9px] uppercase text-gray-500 font-bold tracking-widest">Listing Code</span>
                  <span className="text-xl font-mono font-bold text-[#e2136e] tracking-[0.2em]">{item.code}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
