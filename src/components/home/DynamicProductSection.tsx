"use client";

import { useGetAllProductsQuery } from "@/redux-store/apis_action/products";
import { ProductCard } from "../product/ProductCard";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { Button } from "../ui/button";
import { ArrowRight, PackageOpen } from "lucide-react";
import Link from "next/link";

interface DynamicProductSectionProps {
    title: string;
    filter: any;
    slug?: string;
}

export const DynamicProductSection = ({ title, filter, slug }: DynamicProductSectionProps) => {
    // Construct query params from filter object
    // Filter might contain: { category: 'sneakers', limit: 8, sort: 'newest' }
    const queryParams = {
        page: 0,
        limit: filter?.limit || 8,
        category: filter?.category,

        // Add other filters as needed by your API
    };

    const { data, isLoading } = useGetAllProductsQuery(queryParams);
    const products = data?.data || [];

    return (
        <section className="container py-8 lg:py-12">
            <div className="mb-8 flex items-end justify-between">
                <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">{title}</h2>
                <Link href={slug ? slug : `/products`}>
                    <Button variant="ghost" className="hidden sm:flex">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
                    {Array.from({ length: filter?.limit || 8 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-lg">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <PackageOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No products found</h3>
                    <p className="text-muted-foreground mt-1 max-w-xs">
                        We couldn't find any products in this category right now.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
            <div className="mt-8 flex justify-center sm:hidden">
                <Link href="/products">
                    <Button variant="outline">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </section>
    );
};
