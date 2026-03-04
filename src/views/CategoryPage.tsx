"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductListCard } from "@/components/product/ProductListCard";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { FilterPanel } from "@/components/product/FilterPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";

import { useGetAllProductsQuery } from "@/redux-store/apis_action/products";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";

import { capitalizeWords } from "@/lib/formatters";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { ProductListCardSkeleton } from "@/components/product/ProductListCardSkeleton";
import { Seo } from "@/seo/Seo";

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

export default function CategoryPage() {
   const params = useParams();
   const slug = params?.slug as string;
   const router = useRouter();
   const searchParamsObj = useSearchParams();
   const searchParams = searchParamsObj || new URLSearchParams();
   const [currentPage, setCurrentPage] = useState(1);
   // Get categories from Redux store
   const { categories: reduxCategories } = useSelector((state: RootState) => state.category);
   const { storeData } = useSelector((state: RootState) => state.store);

   // Find the current category from Redux or fallback to mock data
   const currentCategory =
      reduxCategories?.find((cat) => cat.slug === slug) ||
      reduxCategories?.find((cat) => cat.id === slug);

   // URL Param Getters
   const searchQuery = searchParams.get("search") || "";
   // For CategoryPage, selectedCategories is just the current slug
   const selectedCategories = useMemo(() => {
      return slug ? [slug] : [];
   }, [slug]);

   const selectedBrands = useMemo(() => {
      const b = searchParams.get("brands");
      return b ? b.split(",") : [];
   }, [searchParams]);

   const priceRange = useMemo(() => {
      const min = Number(searchParams.get("minPrice") || 0);
      const max = Number(searchParams.get("maxPrice") || 5000);
      return [min, max] as [number, number];
   }, [searchParams]);

   const sortBy = searchParams.get("sort") || "relevance";

   // View mode doesn't necessarily need to be in URL, but can be
   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
   const [filtersOpen, setFiltersOpen] = useState(false);
   const inStockOnly = searchParams.get("inStockOnly") === "true";

   // Helper to update URL params
   const updateParams = (updates: Record<string, string | undefined | null>) => {
      const newParams = new URLSearchParams(searchParamsObj?.toString() || "");
      Object.entries(updates).forEach(([key, value]) => {
         if (value === undefined || value === null || value === "") newParams.delete(key);
         else newParams.set(key, value);
      });
      router.push(`?${newParams.toString()}`, { scroll: false });
   };

   // Scroll to top when page changes
   useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, [currentPage]);

   // Reset to page 1 when filters change
   useEffect(() => {
      setCurrentPage(1);
   }, [slug, selectedBrands, priceRange, searchQuery, inStockOnly]);

   const { data, isLoading, isError, isFetching } = useGetAllProductsQuery({
      limit: 20,
      page: currentPage - 1,
      search: searchQuery || undefined,
      // Always use the current slug for CategoryPage
      category: slug,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      brands: selectedBrands.length > 0 ? selectedBrands.join(",") : undefined,
      // sizes removed
      inStockOnly,
      sort: sortBy,
   });

   const filteredProducts = useMemo(() => {
      return (data?.data as unknown as import("@/types/product").Product[]) || [];
   }, [data]);

   const toggleCategory = (categorySlug: string) => {
      router.push(`/products/category/${categorySlug}`);
   };

   const toggleBrand = (brand: string) => {
      const newBrands = selectedBrands.includes(brand)
         ? selectedBrands.filter((b) => b !== brand)
         : [...selectedBrands, brand];

      updateParams({
         brands: newBrands.length > 0 ? newBrands.join(",") : undefined,
      });
   };

   const toggleSize = () => {
      // Size filter removed from CategoryPage
   };

   const setPriceRange = (range: [number, number]) => {
      updateParams({
         minPrice: range[0].toString(),
         maxPrice: range[1].toString(),
      });
   };

   const setSearchQuery = (query: string) => {
      updateParams({ search: query || undefined });
   };

   const setSortBy = (sort: string) => {
      updateParams({ sort });
   };

   const clearFilters = () => {
      router.push("/products");
   };

   const activeFilterCount =
      selectedCategories.length +
      selectedBrands.length +
      (searchParams.has("minPrice") || searchParams.has("maxPrice") ? 1 : 0);

   const seoData = useMemo(() => {
      const storeName = capitalizeWords(storeData?.name || "");
      const categoryName = currentCategory?.name ? capitalizeWords(currentCategory.name) : "";
      const searchText = searchQuery ? capitalizeWords(searchQuery) : "";

      // SEARCH
      if (searchText) {
         return {
            metaTitle: `Search Results For "${searchText}" in ${categoryName} | ${storeName}`,
            metaDescription: `Find ${searchText} in ${categoryName} at ${storeName}. Browse best prices and latest collections.`,
         };
      }

      // DEFAULT CATEGORY VIEW
      if (categoryName) {
         return {
            metaTitle: `${categoryName} Products | ${storeName}`,
            metaDescription: `Shop premium ${categoryName} products at ${storeName}. Best quality and affordable prices.`,
         };
      }

      // FALLBACK
      return {
         metaTitle: `Products | ${storeName}`,
         metaDescription: `Browse products at ${storeName}. Quality items, best prices, and fast delivery.`,
      };
   }, [currentCategory, searchQuery, storeData?.name]);

   // Breadcrumb items
   const breadcrumbItems = [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: currentCategory?.name || "Category" },
   ];

   if (!currentCategory) {
      return (
         <div className="flex min-h-screen flex-col">
            <main className="flex-1 pb-16 lg:pb-0">
               <div className="container py-8">
                  <h1 className="text-2xl font-medium lg:text-3xl">Category Not Found</h1>
                  <p className="mt-2 text-muted-foreground">
                     The category you're looking for doesn't exist.
                  </p>
               </div>
            </main>
         </div>
      );
   }

   return (
      <div className="flex min-h-screen flex-col">
         <Seo storeData={seoData} />
         <main className="flex-1 pb-16 lg:pb-0">
            <div className="container py-8">
               {/* Breadcrumb Navigation */}
               <BreadcrumbNav items={breadcrumbItems} />

               <div className="flex gap-8">
                  {/* Sidebar Filters - Desktop */}
                  <aside className="hidden w-64 shrink-0 lg:block">
                     <FilterPanel
                        categories={reduxCategories || []}
                        brands={brands}
                        sizes={[]}
                        selectedCategories={selectedCategories}
                        selectedBrands={selectedBrands}
                        selectedSizes={[]}
                        priceRange={priceRange}
                        activeFilterCount={activeFilterCount}
                        onToggleCategory={toggleCategory}
                        onToggleBrand={toggleBrand}
                        onToggleSize={toggleSize}
                        onPriceRangeChange={setPriceRange}
                        onClearFilters={clearFilters}
                        hideCategoryFilter={false}
                     />
                  </aside>

                  {/* Main Content */}
                  <div className="flex-1">
                     {/* Toolbar */}
                     <div className="mb-6 flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                           <Input
                              placeholder="Search products..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                           />
                        </div>

                        {/* Mobile Filters */}
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
                                 <FilterPanel
                                    categories={reduxCategories || []}
                                    brands={brands}
                                    sizes={[]}
                                    selectedCategories={selectedCategories}
                                    selectedBrands={selectedBrands}
                                    selectedSizes={[]}
                                    priceRange={priceRange}
                                    activeFilterCount={activeFilterCount}
                                    onToggleCategory={toggleCategory}
                                    onToggleBrand={toggleBrand}
                                    onToggleSize={toggleSize}
                                    onPriceRangeChange={setPriceRange}
                                    onClearFilters={clearFilters}
                                    hideCategoryFilter={false}
                                 />
                              </ScrollArea>
                           </SheetContent>
                        </Sheet>

                        {/* Sort */}
                        <Select
                           value={sortBy}
                           onValueChange={setSortBy}>
                           <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Sort by" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="relevance">Relevance</SelectItem>
                              <SelectItem value="price-asc">Price: Low to High</SelectItem>
                              <SelectItem value="price-desc">Price: High to Low</SelectItem>
                              <SelectItem value="newest">Newest</SelectItem>
                           </SelectContent>
                        </Select>

                        {/* View Toggle */}
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
                           {selectedCategories.map((categorySlug) => (
                              <Badge
                                 key={categorySlug}
                                 variant="secondary"
                                 className="cursor-pointer"
                                 onClick={() => toggleCategory(categorySlug)}>
                                 {reduxCategories?.find((c) => c.slug === categorySlug)?.name || categorySlug}{" "}
                                 ×
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
                           {/* Size badges removed */}
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearFilters}
                              className="text-muted-foreground">
                              Clear all
                           </Button>
                        </div>
                     )}

                     {/* Products Grid */}
                     {isLoading || isFetching ? (
                        viewMode === "grid" ? (
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                              {[...Array(8)].map((_, i) => (
                                 <ProductCardSkeleton key={i} />
                              ))}
                           </div>
                        ) : (
                           <div className="flex flex-col gap-4">
                              {[...Array(4)].map((_, i) => (
                                 <ProductListCardSkeleton key={i} />
                              ))}
                           </div>
                        )
                     ) : filteredProducts.length === 0 ? (
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
                           {filteredProducts.map((product, index) => (
                              <ProductCard
                                 key={product.id}
                                 product={product}
                                 index={index}
                              />
                           ))}
                        </div>
                     ) : (
                        <div className="flex flex-col gap-4">
                           {filteredProducts.map((product, index) => (
                              <ProductListCard
                                 key={product.id}
                                 product={product}
                                 index={index}
                              />
                           ))}
                        </div>
                     )}
                     {!isLoading && !isFetching && data?.pagination?.totalPages > 1 && (
                        <div className="mt-8">
                           <Pagination>
                              <PaginationContent>
                                 <PaginationItem>
                                    <PaginationPrevious
                                       onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                       className={
                                          currentPage === 1
                                             ? "pointer-events-none opacity-50"
                                             : "cursor-pointer"
                                       }
                                    />
                                 </PaginationItem>

                                 {/* Advanced Pagination Logic */}
                                 {(() => {
                                    const totalPages = data?.pagination?.totalPages || 0;
                                    const pages = [];
                                    const siblingCount = 3; // Show 3 pages before and after

                                    // Always show first page
                                    pages.push(
                                       <PaginationItem key={1}>
                                          <PaginationLink
                                             onClick={() => setCurrentPage(1)}
                                             isActive={currentPage === 1}
                                             className="cursor-pointer">
                                             1
                                          </PaginationLink>
                                       </PaginationItem>,
                                    );

                                    // Show ellipsis if current page is far from the start
                                    if (currentPage > siblingCount + 2) {
                                       pages.push(
                                          <PaginationItem key="ellipsis-start">
                                             <PaginationEllipsis />
                                          </PaginationItem>,
                                       );
                                    }

                                    // Show pages around the current page
                                    const start = Math.max(2, currentPage - siblingCount);
                                    const end = Math.min(
                                       totalPages - 1,
                                       currentPage + siblingCount,
                                    );

                                    for (let i = start; i <= end; i++) {
                                       pages.push(
                                          <PaginationItem key={i}>
                                             <PaginationLink
                                                onClick={() => setCurrentPage(i)}
                                                isActive={currentPage === i}
                                                className="cursor-pointer">
                                                {i}
                                             </PaginationLink>
                                          </PaginationItem>,
                                       );
                                    }

                                    // Show ellipsis if current page is far from the end
                                    if (currentPage < totalPages - siblingCount - 1) {
                                       pages.push(
                                          <PaginationItem key="ellipsis-end">
                                             <PaginationEllipsis />
                                          </PaginationItem>,
                                       );
                                    }

                                    // Always show last page (if it's not the first one)
                                    if (totalPages > 1) {
                                       pages.push(
                                          <PaginationItem key={totalPages}>
                                             <PaginationLink
                                                onClick={() => setCurrentPage(totalPages)}
                                                isActive={currentPage === totalPages}
                                                className="cursor-pointer">
                                                {totalPages}
                                             </PaginationLink>
                                          </PaginationItem>,
                                       );
                                    }

                                    return pages;
                                 })()}

                                 <PaginationItem>
                                    <PaginationNext
                                       onClick={() =>
                                          setCurrentPage((p) =>
                                             Math.min(data?.pagination?.totalPages, p + 1),
                                          )
                                       }
                                       className={
                                          currentPage === data?.pagination?.totalPages
                                             ? "pointer-events-none opacity-50"
                                             : "cursor-pointer"
                                       }
                                    />
                                 </PaginationItem>
                              </PaginationContent>
                           </Pagination>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}
