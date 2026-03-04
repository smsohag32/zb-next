"use client";

import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { PopularCategory } from "@/components/home/PopularCategory";
import { SneakersCollection } from "@/components/home/SneakerCollections";
import DynamicHero from "@/components/home/DynamicHero";
import { LoaferCollection } from "@/components/home/LofferCollection";
import { useGetPublicSectionsQuery } from "@/redux-store/apis_action/section";
import { DynamicProductSection } from "@/components/home/DynamicProductSection";

export default function HomePage() {
    const { data: sectionsData, isLoading } = useGetPublicSectionsQuery(undefined);

    const hasDynamicSections = sectionsData?.data && sectionsData.data.length > 0;
    const featuresSections = hasDynamicSections
        ? sectionsData.data.filter((s: any) => s.type === "features")
        : [];
    const productSections = hasDynamicSections
        ? sectionsData.data.filter((s: any) => s.type === "products")
        : [];

    const safeParse = (data: any) => {
        try {
            return typeof data === "string" ? JSON.parse(data) : data;
        } catch {
            return null;
        }
    };

    return (
        <main className="flex-1 pb-16 lg:pb-0">
            <DynamicHero />

            {isLoading ? (
                <div className="py-4" />
            ) : hasDynamicSections ? (
                featuresSections.map((section: any) => (
                    <FeaturesBanner key={section.id} features={safeParse(section.content)} />
                ))
            ) : (
                <FeaturesBanner />
            )}

            <PopularCategory />

            {isLoading ? (
                <div className="py-12" />
            ) : hasDynamicSections ? (
                productSections.map((section: any) => (
                    <DynamicProductSection
                        key={section.id}
                        title={section.title}
                        filter={safeParse(section.filter)}
                        slug={section.slug}
                    />
                ))
            ) : (
                <>
                    <SneakersCollection />
                    <LoaferCollection />
                </>
            )}
        </main>
    );
}
