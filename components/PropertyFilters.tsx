
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, DollarSign, Home, Bed } from "lucide-react";

interface FilterState {
  location: string
  minPrice: string
  maxPrice: string
  propertyType: string
  status: string
  sale_status: string
  area: string
  developer: string
}

interface PropertyFiltersProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  onFilterSubmit: (filters?: FilterState) => void
  onClearFilters: () => void
  isLoading?: boolean
}

export function PropertyFilters({ filters, setFilters, onFilterSubmit, onClearFilters, isLoading }: PropertyFiltersProps) {

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      status: "",
      sale_status: "",
      area: "",
      developer: "",
    });
    onFilterSubmit({});
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/90 backdrop-blur-sm border-border shadow-elegant">
      <CardContent className="p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">

          {/* Location */}
          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-xs font-medium flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-luxury" /> Location
            </Label>
            <Select
              value={filters.location}
              onValueChange={(value) => {
                setFilters({ ...filters, location: value });
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dubai">Dubai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min Price */}
          <div className="space-y-1.5">
            <Label htmlFor="minPrice" className="text-xs font-medium flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-luxury" /> Min Price (AED)
            </Label>
            <Input
              id="minPrice"
              placeholder="Min price"
              type="number"
              className="h-9"
              value={filters.minPrice}
              onChange={(e) => {
                setFilters({ ...filters, minPrice: e.target.value });
              }}
            />
          </div>

          {/* Max Price */}
          <div className="space-y-1.5">
            <Label htmlFor="maxPrice" className="text-xs font-medium">Max Price (AED)</Label>
            <Input
              id="maxPrice"
              placeholder="Max price"
              type="number"
              className="h-9"
              value={filters.maxPrice}
              onChange={(e) => {
                setFilters({ ...filters, maxPrice: e.target.value });
              }}
            />
          </div>

          {/* Developer */}
          <div className="space-y-1.5">
            <Label htmlFor="propertyType" className="text-xs font-medium flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-luxury" /> Developer
            </Label>
            <Select
              value={filters.developer}
              onValueChange={(value) => {
                setFilters({ ...filters, developer: value });
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select developer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAMAC">DAMAC</SelectItem>
                <SelectItem value="Emaar">Emaar</SelectItem>
                <SelectItem value="Meraas">Meraas</SelectItem>
                <SelectItem value="Binghatti">Binghatti</SelectItem>
                <SelectItem value="Nakheel">Nakheel</SelectItem>
                <SelectItem value="Sobha">Sobha</SelectItem>
                <SelectItem value="Taraf Holding">Taraf Holding</SelectItem>
                <SelectItem value="Danube">Danube</SelectItem>
                <SelectItem value="Majid Al Futtaim">Majid Al Futtaim</SelectItem>
                <SelectItem value="Ellington">Ellington</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-xs font-medium flex items-center gap-1.5">
              <Bed className="h-3.5 w-3.5 text-luxury" /> Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => {
                setFilters({ ...filters, status: value });
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Under construction">Under construction</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Presale">Presale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sale Status */}
          <div className="space-y-1.5">
            <Label htmlFor="sale_status" className="text-xs font-medium flex items-center gap-1.5">
              <Bed className="h-3.5 w-3.5 text-luxury" /> Sale Status
            </Label>
            <Select
              value={filters.sale_status}
              onValueChange={(value) => {
                setFilters({ ...filters, sale_status: value });
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select sale status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Out of stock">Out of stock</SelectItem>
                <SelectItem value="On sale">On sale</SelectItem>
                <SelectItem value="Presale(EOI)">Presale(EOI)</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <Button
            className="flex-1 bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury font-semibold h-9 text-sm"
            onClick={() => onFilterSubmit(filters)}
          >
            <Search className="h-3.5 w-3.5 mr-1.5" /> Search
          </Button>

          <Button
            variant="outline"
            className="flex-1 border-luxury text-luxury hover:bg-luxury hover:text-white h-9 text-sm"
            onClick={handleClearFilters}
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}