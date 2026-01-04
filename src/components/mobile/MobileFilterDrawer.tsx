import React from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterSection {
  title: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio';
}

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterSection[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (sectionTitle: string, optionId: string, checked: boolean) => void;
  onClearAll: () => void;
  onApply: () => void;
  className?: string;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  onApply,
  className
}) => {
  if (!isOpen) return null;

  const totalActiveFilters = Object.values(selectedFilters).reduce(
    (total, filterArray) => total + filterArray.length,
    0
  );

  const isOptionSelected = (sectionTitle: string, optionId: string) => {
    return selectedFilters[sectionTitle]?.includes(optionId) || false;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-white rounded-t-xl z-50",
        "max-h-[80vh] overflow-hidden flex flex-col",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Filters</h2>
            {totalActiveFilters > 0 && (
              <Badge className="bg-orange-500 text-white">
                {totalActiveFilters}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-gray-500"
            >
              Clear All
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {filters.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="font-medium text-gray-900 mb-3">
                {section.title}
              </h3>
              
              <div className="space-y-2">
                {section.options.map((option) => {
                  const isSelected = isOptionSelected(section.title, option.id);
                  
                  return (
                    <label
                      key={option.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 border-2 rounded flex items-center justify-center",
                          section.type === 'radio' ? 'rounded-full' : 'rounded',
                          isSelected 
                            ? 'border-orange-500 bg-orange-500' 
                            : 'border-gray-300'
                        )}>
                          {isSelected && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700">
                          {option.label}
                        </span>
                      </div>
                      
                      {option.count && (
                        <span className="text-xs text-gray-500">
                          ({option.count})
                        </span>
                      )}
                      
                      <input
                        type={section.type}
                        name={section.type === 'radio' ? section.title : undefined}
                        checked={isSelected}
                        onChange={(e) => onFilterChange(section.title, option.id, e.target.checked)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
              
              {sectionIndex < filters.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onApply}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Apply Filters
              {totalActiveFilters > 0 && (
                <Badge className="ml-2 bg-white text-orange-500">
                  {totalActiveFilters}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileFilterDrawer;