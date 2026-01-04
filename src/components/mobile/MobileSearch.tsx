import React, { useState, useEffect } from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MobileSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterToggle: () => void;
  activeFilters?: number;
  className?: string;
}

const MobileSearch: React.FC<MobileSearchProps> = ({
  searchQuery,
  onSearchChange,
  onFilterToggle,
  activeFilters = 0,
  className
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localQuery);
  };

  const clearSearch = () => {
    setLocalQuery('');
    onSearchChange('');
  };

  return (
    <div className={cn("bg-white border-b border-gray-200 p-4", className)}>
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <Input
              type="text"
              placeholder="Search spices, masalas..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "pl-10 pr-10 py-3 rounded-full border-gray-300",
                "focus:border-orange-500 focus:ring-orange-500",
                isSearchFocused && "shadow-md"
              )}
            />
            {localQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onFilterToggle}
          className={cn(
            "relative p-3 rounded-full border-gray-300",
            activeFilters > 0 && "border-orange-500 text-orange-500"
          )}
        >
          <SlidersHorizontal size={18} />
          {activeFilters > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {activeFilters}
            </Badge>
          )}
        </Button>
      </form>

      {/* Quick Filter Tags */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2">
        <span className="text-sm text-gray-500 whitespace-nowrap">Quick:</span>
        {['Pure Spices', 'Garam Masala', 'Turmeric', 'Red Chili', 'Combo Packs'].map((tag) => (
          <button
            key={tag}
            onClick={() => onSearchChange(tag)}
            className="whitespace-nowrap px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-orange-100 hover:text-orange-700 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileSearch;