"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
} from "@/components/ui/pagination";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
   currentPage: number;
   totalPages: number;
   totalItems: number;
   itemsPerPage: number;
   onPageChange: (page: number) => void;
   onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function ProfessionalPagination({
   currentPage,
   totalPages,
   totalItems,
   itemsPerPage,
   onPageChange,
   onItemsPerPageChange,
}: PaginationProps) {
   const [jumpValue, setJumpValue] = useState("");
   const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

   useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 640);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   // Calculate displayed page number
   const startItem = (currentPage - 1) * itemsPerPage + 1;
   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

   // Handle jump to page
   const handleJump = () => {
      const pageNum = parseInt(jumpValue);
      if (pageNum >= 1 && pageNum <= totalPages) {
         onPageChange(pageNum);
         setJumpValue("");
      }
   };

   // Generate pagination numbers with smarter ellipsis for large datasets
   const getPaginationPages = () => {
      const pages: (number | string)[] = [];

      // For mobile: show fewer siblings
      const siblingCount = isMobile ? 1 : 2;
      const showFirstPages = 2; // Always show first 2 pages
      const showLastPages = 2; // Always show last 2 pages

      // Always show first page
      if (totalPages > 0) {
         pages.push(1);
      }

      // Ellipsis after first pages
      if (currentPage > showFirstPages + siblingCount + 1) {
         pages.push("...");
      }

      // Pages around current page
      const start = Math.max(2, currentPage - siblingCount);
      const end = Math.min(totalPages - 1, currentPage + siblingCount);

      for (let i = start; i <= end; i++) {
         if (!pages.includes(i)) {
            pages.push(i);
         }
      }

      // Ellipsis before last pages
      if (currentPage < totalPages - showLastPages - siblingCount) {
         pages.push("...");
      }

      // Always show last page (if more than 1 page)
      if (totalPages > 1 && !pages.includes(totalPages)) {
         pages.push(totalPages);
      }

      return pages;
   };

   const paginationPages = getPaginationPages();

   // Don't show pagination for single page
   if (totalPages <= 1) {
      return null;
   }

   return (
      <div className="flex flex-col gap-4 mt-8">
         {/* Pagination Stats */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground px-2">
            <span>
               Showing <span className="font-medium text-foreground">{startItem}</span> to{" "}
               <span className="font-medium text-foreground">{endItem}</span> of{" "}
               <span className="font-medium text-foreground">{totalItems.toLocaleString()}</span>{" "}
               results
            </span>

            {/* Items Per Page Selector (Hidden on very small screens) */}
            {onItemsPerPageChange && (
               <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(val) => {
                     onItemsPerPageChange(parseInt(val));
                  }}>
                  <SelectTrigger className="w-40 hidden sm:flex">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="12">12 per page</SelectItem>
                     <SelectItem value="24">24 per page</SelectItem>
                     <SelectItem value="48">48 per page</SelectItem>
                  </SelectContent>
               </Select>
            )}
         </div>

         {/* Main Pagination */}
         <div className="flex flex-col gap-4">
            {/* Pagination Controls */}
            <div className="flex justify-center px-2">
               <Pagination className="w-full justify-center overflow-x-auto">
                  <PaginationContent className="gap-1 sm:gap-2">
                     {/* Previous Button */}
                     <PaginationItem>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                           disabled={currentPage === 1}
                           className="h-9 w-9 p-0 sm:w-auto sm:px-3">
                           <ChevronLeft className="h-4 w-4 mr-0 sm:mr-2" />
                           <span className="hidden sm:inline">Previous</span>
                        </Button>
                     </PaginationItem>

                     {/* Page Numbers */}
                     {paginationPages.map((page, index) =>
                        page === "..." ? (
                           <PaginationItem key={`ellipsis-${index}`}>
                              <PaginationEllipsis />
                           </PaginationItem>
                        ) : (
                           <PaginationItem key={page}>
                              <PaginationLink
                                 onClick={() => onPageChange(page as number)}
                                 isActive={currentPage === page}
                                 className="cursor-pointer h-9 min-w-9 sm:h-auto sm:min-w-auto">
                                 {page}
                              </PaginationLink>
                           </PaginationItem>
                        ),
                     )}

                     {/* Next Button */}
                     <PaginationItem>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                           disabled={currentPage === totalPages}
                           className="h-9 w-9 p-0 sm:w-auto sm:px-3">
                           <span className="hidden sm:inline">Next</span>
                           <ChevronRight className="h-4 w-4 ml-0 sm:ml-2" />
                        </Button>
                     </PaginationItem>
                  </PaginationContent>
               </Pagination>
            </div>

            {/* Jump to Page - Visible on medium screens and up */}
            {totalPages > 20 && (
               <div className="flex items-center justify-center gap-2 px-2">
                  <label
                     htmlFor="jump-page"
                     className="text-sm font-medium">
                     Go to:
                  </label>
                  <Input
                     id="jump-page"
                     type="number"
                     min="1"
                     max={totalPages}
                     placeholder={`1-${totalPages}`}
                     value={jumpValue}
                     onChange={(e) => setJumpValue(e.target.value)}
                     onKeyDown={(e) => e.key === "Enter" && handleJump()}
                     className="w-20 h-9"
                  />
                  <Button
                     size="sm"
                     onClick={handleJump}
                     className="h-9 px-3">
                     Jump
                  </Button>
               </div>
            )}

            {/* Mobile Items Per Page - Visible on very small screens */}
            {onItemsPerPageChange && isMobile && (
               <div className="flex items-center justify-center gap-2 px-2 sm:hidden">
                  <Select
                     value={itemsPerPage.toString()}
                     onValueChange={(val) => {
                        onItemsPerPageChange(parseInt(val));
                     }}>
                     <SelectTrigger className="w-32 h-9">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="12">12 per page</SelectItem>
                        <SelectItem value="24">24 per page</SelectItem>
                        <SelectItem value="48">48 per page</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            )}
         </div>
      </div>
   );
}
