import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface FilterPanelProps {
    categories: Array<{ id: string; name: string; slug: string; productCount?: number }>;
    brands: string[];
    sizes: string[];
    selectedCategories: string[];
    selectedBrands: string[];
    selectedSizes: string[];
    priceRange: [number, number];
    activeFilterCount: number;
    onToggleCategory: (slug: string) => void;
    onToggleBrand: (brand: string) => void;
    onToggleSize: (size: string) => void;
    onPriceRangeChange: (value: [number, number]) => void;
    onClearFilters: () => void;
    hideCategoryFilter?: boolean;
}

export function FilterPanel({
    categories,
    brands,
    sizes,
    selectedCategories,
    selectedBrands,
    selectedSizes,
    priceRange,
    activeFilterCount,
    onToggleCategory,
    onToggleBrand,
    onToggleSize,
    onPriceRangeChange,
    onClearFilters,
    hideCategoryFilter = false,
}: FilterPanelProps) {
    return (
        <div className="space-y-6">
            {/* Categories */}
            {!hideCategoryFilter && (
                <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
                        Categories
                        <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 pt-3">
                        {categories.map((cat) => (
                            <label
                                key={cat.id}
                                className="flex items-center gap-3 cursor-pointer">
                                <Checkbox
                                    checked={selectedCategories.includes(cat.slug)}
                                    onCheckedChange={() => onToggleCategory(cat.slug)}
                                />
                                <span className="text-sm">{cat.name}</span>
                                {cat.productCount !== undefined && (
                                    <span className="ml-auto text-xs text-muted-foreground">
                                        ({cat.productCount})
                                    </span>
                                )}
                            </label>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            )}

            {/* Price Range */}
            <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
                    Price Range
                    <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                    <Slider
                        value={priceRange}
                        onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                        max={5000}
                        step={10}
                        className="mb-2"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>BDT {priceRange[0]}</span>
                        <span>BDT {priceRange[1]}</span>
                    </div>
                </CollapsibleContent>
            </Collapsible>



            {/* Sizes */}
            {sizes.length > 0 && (
                <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
                        Sizes
                        <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-3">
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => (
                                <Button
                                    key={size}
                                    variant={selectedSizes.includes(size) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onToggleSize(size)}
                                    className="h-8 min-w-[40px]">
                                    {size}
                                </Button>
                            ))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )}

            {activeFilterCount > 0 && (
                <Button
                    variant="ghost"
                    className="w-full"
                    onClick={onClearFilters}>
                    Clear All Filters
                </Button>
            )}
        </div>
    );
}
