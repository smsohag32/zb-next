"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductListCard } from "@/components/product/ProductListCard";
import { ProfessionalPagination } from "@/components/product/ProfessionalPagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ProductCardSkeleton, ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";
import { useGetAllProductsQuery } from "@/redux-store/apis_action/products";

import { capitalizeWords } from "@/lib/formatters";

const brands = [
   "Nike",
   "Adidas",
   "Bata",
   "Puma",
   "Reebok",
   "Apex",
   "Catwalk",
   "Yellow",
   "Woodland",
   "Paragon",
];

const sortOptions = [
   { value: "newest", label: "Newest" },
   { value: "price-asc", label: "Price: Low to High" },
   { value: "price-desc", label: "Price: High to Low" },
   { value: "rating", label: "Highest Rated" },
   { value: "popular", label: "Most Popular" },
];

export default function ProductsPage() {
   const searchParamsObj = useSearchParams();
   const router = useRouter();
   const searchParams = searchParamsObj || new URLSearchParams();
   const setSearchParams = useCallback((updater: (prev: URLSearchParams) => URLSearchParams | URLSearchParams) => {
      const current = new URLSearchParams(searchParamsObj?.toString() || "");
      const updated = typeof updater === "function" ? updater(current) : updater;
      router.push(`?${updated.toString()}`, { scroll: false });
   }, [searchParamsObj, router]);
   const isNew = searchParams.get("new") === "true";
   const isFeatured = searchParams.get("featured") === "true";
   const { categories } = useSelector((state: RootState) => state.category);
   const [inStockOnly, setInStockOnly] = useState(searchParams.get("inStock") === "true");
   // Initialize state from URL
   const { storeData } = useSelector((state: RootState) => state.store);
   const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
   const [selectedCategories, setSelectedCategories] = useState<string[]>(
      searchParams.get("category")?.split(",") || [],
   );
   const [selectedBrands, setSelectedBrands] = useState<string[]>(
      searchParams.get("brands")?.split(",") || [],
   );

   const [priceRange, setPriceRange] = useState<[number, number]>([
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || 3000,
   ]);
   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
   const sortBy = searchParams.get("sort") || "newest";
   const [filtersOpen, setFiltersOpen] = useState(false);

   useEffect(() => {
      const query = searchParams.get("search") || "";
      setSearchQuery(query);
   }, [searchParams]);

   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(12);
   useEffect(() => {
      const categoryParam = searchParams.get("category");
      setSelectedCategories(categoryParam ? categoryParam.split(",") : []);
   }, [searchParams]);

   // Scroll to top when page changes
   useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, [currentPage]);

   useEffect(() => {
      setCurrentPage(1);
   }, [selectedCategories, selectedBrands, priceRange, inStockOnly, searchQuery, itemsPerPage]);

   // Fetch products
   const { data, isLoading, isFetching, isError } = useGetAllProductsQuery({
      limit: itemsPerPage,
      page: currentPage - 1,
      search: searchQuery || undefined,
      category: selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
      minPrice: priceRange[0],
      inStockOnly,
      maxPrice: priceRange[1],
      brands: selectedBrands.length > 0 ? selectedBrands.join(",") : undefined,

      sort: sortBy,
   });

   const filteredProducts = useMemo(() => data?.data || [], [data]);

   // Update URL helper
   const updateFilterParam = (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParamsObj?.toString() || "");
      if (values.length > 0) params.set(key, values.join(","));
      else params.delete(key);
      router.push(`?${params.toString()}`, { scroll: false });
   };

   const updateInStockParam = (value: boolean) => {
      const params = new URLSearchParams(searchParamsObj?.toString() || "");
      if (value) params.set("inStock", "true");
      else params.delete("inStock");
      router.push(`?${params.toString()}`, { scroll: false });
   };

   const updatePriceParam = (range: [number, number]) => {
      const params = new URLSearchParams(searchParamsObj?.toString() || "");
      if (range[0] > 0) params.set("minPrice", range[0].toString()); else params.delete("minPrice");
      if (range[1] < 3000) params.set("maxPrice", range[1].toString()); else params.delete("maxPrice");
      router.push(`?${params.toString()}`, { scroll: false });
   };

   const updateSearchParam = (query: string) => {
      const params = new URLSearchParams(searchParamsObj?.toString() || "");
      if (query.trim()) params.set("search", query.trim()); else params.delete("search");
      router.push(`?${params.toString()}`, { scroll: false });
   };

   // Toggle filters
   const toggleCategory = (slug: string) => {
      setSelectedCategories((prev) => {
         const updated = prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug];
         updateFilterParam("category", updated);
         return updated;
      });
   };
   const toggleBrand = (brand: string) => {
      setSelectedBrands((prev) => {
         const updated = prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand];
         updateFilterParam("brands", updated);
         return updated;
      });
   };

   const handlePriceChange = (range: [number, number]) => {
      setPriceRange(range);
      updatePriceParam(range);
   };

   const handleSearchChange = (value: string) => {
      setSearchQuery(value);
      updateSearchParam(value);
   };

   const handleSortChange = (value: string) => {
      const params = new URLSearchParams(searchParamsObj?.toString() || "");
      params.set("sort", value);
      router.push(`?${params.toString()}`, { scroll: false });
   };

   const clearFilters = () => {
      setSelectedCategories([]);
      setSelectedBrands([]);
      setPriceRange([0, 3000]);
      setSearchQuery("");
      setInStockOnly(false);
      router.push("/products", { scroll: false });
   };

   const activeFilterCount =
      selectedCategories.length + selectedBrands.length + (inStockOnly ? 1 : 0);

   const seoData = useMemo(() => {
      const storeName = capitalizeWords(storeData?.name || "");
      const categoryNames = selectedCategories
         .map((slug) => categories?.find((c) => c.slug === slug)?.name)
         .filter(Boolean)
         .map((name) => capitalizeWords(name as string));

      const searchText = searchQuery ? capitalizeWords(searchQuery) : "";

      // SEARCH
      if (searchText) {
         return {
            metaTitle: `Search Results For "${searchText}" | ${storeName}`,
            metaDescription: `Find ${searchText} products at ${storeName}. Browse best prices and latest collections.`,
         };
      }

      // NEW PRODUCTS
      if (isNew) {
         return {
            metaTitle: `New Arrivals | ${storeName}`,
            metaDescription: `Discover the latest new arrivals at ${storeName}. Shop fresh styles and trending products.`,
         };
      }

      // FEATURED PRODUCTS
      if (isFeatured) {
         return {
            metaTitle: `Featured Products | ${storeName}`,
            metaDescription: `Explore featured and best-selling products at ${storeName}. Handpicked just for you.`,
         };
      }

      // SINGLE CATEGORY
      if (categoryNames.length === 1) {
         return {
            metaTitle: `${categoryNames[0]} Products | ${storeName}`,
            metaDescription: `Shop premium ${categoryNames[0]} products at ${storeName}. Best quality and affordable prices.`,
         };
      }

      // MULTIPLE CATEGORIES
      if (categoryNames.length > 1) {
         const shortTitle = categoryNames.slice(0, 2).join(", ");
         return {
            metaTitle: `${shortTitle} & More | ${storeName}`,
            metaDescription: `Browse ${categoryNames.join(
               ", ",
            )} at ${storeName}. Wide selection and great deals available.`,
         };
      }

      // DEFAULT
      return {
         metaTitle: `All Products | ${storeName}`,
         metaDescription: `Browse all products at ${storeName}. Quality items, best prices, and fast delivery.`,
      };
   }, [selectedCategories, categories, searchQuery, isNew, isFeatured, storeData?.name]);

   const FilterContent = () => (
      <div className="space-y-6">
         {/* Categories */}
         <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
               Categories <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
               {categories?.map((cat) => (
                  <label
                     key={cat.id}
                     className="flex items-center gap-3 cursor-pointer">
                     <Checkbox
                        checked={selectedCategories.includes(cat.slug)}
                        onCheckedChange={() => toggleCategory(cat.slug)}
                     />
                     <span className="text-sm">{cat.name}</span>
                  </label>
               ))}
            </CollapsibleContent>
         </Collapsible>

         {/* Price */}
         <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
               Price Range <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
               <Slider
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  max={5000}
                  step={10}
                  className="mb-2"
               />
               <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>BDT{priceRange[0]}</span>
                  <span>BDT{priceRange[1]}</span>
               </div>
            </CollapsibleContent>
         </Collapsible>

         {/* In Stock Only */}
         <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
               Availability <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
               <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                     checked={inStockOnly}
                     onCheckedChange={(checked) => {
                        setInStockOnly(Boolean(checked));
                        updateInStockParam(Boolean(checked));
                     }}
                  />
                  <span className="text-sm">In Stock Only</span>
               </label>
            </CollapsibleContent>
         </Collapsible>

         {activeFilterCount > 0 && (
            <Button
               variant="ghost"
               className="w-full"
               onClick={clearFilters}>
               Clear All Filters
            </Button>
         )}
      </div>
   );

   return (
      <div className="flex min-h-screen flex-col">
         <main className="flex-1 pb-16 lg:pb-0">
            <div className="container py-8">
               {/* Header */}
               <div className="mb-8">
                  <h1 className=" text-2xl  font-medium lg:text-3xl">
                     {isNew ? "New Arrivals" : isFeatured ? "Featured Products" : "All Products"}
                  </h1>
               </div>

               <div className="flex gap-8">
                  {/* Sidebar */}
                  <aside className="hidden w-64 shrink-0 lg:block">
                     <FilterContent />
                  </aside>

                  {/* Main */}
                  <div className="flex-1">
                     {/* Toolbar */}
                     <div className="mb-6 flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                           <Input
                              placeholder="Search products..."
                              value={searchQuery}
                              onChange={(e) => handleSearchChange(e.target.value)}
                              className="pl-10"
                           />
                        </div>

                        {/* Mobile filters */}
                        <Sheet
                           open={filtersOpen}
                           onOpenChange={setFiltersOpen}>
                           <SheetTrigger asChild>
                              <Button
                                 variant="outline"
                                 className="lg:hidden">
                                 <SlidersHorizontal className="mr-2 h-4 w-4" />
                                 Filters
                                 {activeFilterCount > 0 && (
                                    <Badge className="ml-2">{activeFilterCount}</Badge>
                                 )}
                              </Button>
                           </SheetTrigger>
                           <SheetContent
                              side="left"
                              className="w-80 flex flex-col p-0">
                              <div className="p-6 pb-2">
                                 <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                 </SheetHeader>
                              </div>
                              <ScrollArea className="flex-1 px-6 pb-6">
                                 <FilterContent />
                              </ScrollArea>
                           </SheetContent>
                        </Sheet>

                        {/* Sort */}
                        <Select
                           value={sortBy}
                           onValueChange={handleSortChange}>
                           <SelectTrigger className="w-40">
                              <SelectValue placeholder="Sort by" />
                           </SelectTrigger>
                           <SelectContent>
                              {sortOptions.map((option) => (
                                 <SelectItem
                                    key={option.value}
                                    value={option.value}>
                                    {option.label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>

                        {/* View toggle */}
                        <div className="hidden sm:flex items-center gap-1 border rounded-md p-1">
                           <Button
                              variant={viewMode === "grid" ? "secondary" : "ghost"}
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setViewMode("grid")}>
                              <Grid3X3 className="h-4 w-4" />
                           </Button>
                           <Button
                              variant={viewMode === "list" ? "secondary" : "ghost"}
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setViewMode("list")}>
                              <List className="h-4 w-4" />
                           </Button>
                        </div>
                     </div>

                     {/* Active Filters */}
                     {activeFilterCount > 0 && (
                        <div className="mb-6 flex flex-wrap items-center gap-2">
                           <span className="text-sm text-muted-foreground">Active filters:</span>
                           {selectedCategories.map((slug) => (
                              <Badge
                                 key={slug}
                                 variant="secondary"
                                 className="cursor-pointer"
                                 onClick={() => toggleCategory(slug)}>
                                 {categories.find((c) => c.slug === slug)?.name} ×
                              </Badge>
                           ))}
                           {selectedBrands.map((brand) => (
                              <Badge
                                 key={brand}
                                 variant="secondary"
                                 className="cursor-pointer"
                                 onClick={() => toggleBrand(brand)}>
                                 {brand} ×
                              </Badge>
                           ))}

                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearFilters}
                              className="text-muted-foreground">
                              Clear all
                           </Button>
                        </div>
                     )}

                     {/* Products */}
                     {isLoading || isFetching ? (
                        <ProductGridSkeleton count={itemsPerPage} />
                     ) : filteredProducts?.length === 0 ? (
                        <div className="py-16 text-center">
                           <p className="text-lg text-muted-foreground">
                              No products found matching your criteria.
                           </p>
                           <Button
                              variant="outline"
                              className="mt-4"
                              onClick={clearFilters}>
                              Clear Filters
                           </Button>
                        </div>
                     ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                           {filteredProducts.map((product: any, index: any) => (
                              <ProductCard
                                 key={product.id}
                                 product={product}
                                 index={index}
                              />
                           ))}
                        </div>
                     ) : (
                        <div className="flex flex-col gap-4">
                           {filteredProducts.map((product: any, index: any) => (
                              <ProductListCard
                                 key={product.id}
                                 product={product}
                                 index={index}
                              />
                           ))}
                        </div>
                     )}

                     {!isLoading && !isFetching && data?.pagination?.totalPages > 1 && (
                        <ProfessionalPagination
                           currentPage={currentPage}
                           totalPages={data?.pagination?.totalPages || 1}
                           totalItems={data?.pagination?.total || 0}
                           itemsPerPage={itemsPerPage}
                           onPageChange={setCurrentPage}
                           onItemsPerPageChange={setItemsPerPage}
                        />
                     )}
                  </div>

                  {/* Pagination */}
               </div>
            </div>
         </main>
      </div>
   );
}
