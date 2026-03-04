import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { NewArrivals } from "@/components/home/NewArrivals";
import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { PopularCategory } from "@/components/home/PopularCategory";
import { SneakersCollection } from "@/components/home/SneakerCollections";
import DynamicHero from "@/components/home/DynamicHero";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";
import { Seo } from "@/seo/Seo";
import { LoaferCollection } from "@/components/home/LofferCollection";
import { useGetPublicSectionsQuery } from "@/redux-store/apis_action/section";
import { DynamicProductSection } from "@/components/home/DynamicProductSection";

const Index = () => {
   const { storeData } = useSelector((state: RootState) => state.store);
   const { data: sectionsData, isLoading } = useGetPublicSectionsQuery(undefined);

   const hasDynamicSections = sectionsData?.data && sectionsData.data.length > 0;
   const featuresSections = hasDynamicSections ? sectionsData.data.filter((s: any) => s.type === "features") : [];
   const productSections = hasDynamicSections ? sectionsData.data.filter((s: any) => s.type === "products") : [];
   console.log(productSections)
   const safeParse = (data: any) => {
      try {
         return typeof data === "string" ? JSON.parse(data) : data;
      } catch (error) {
         return null;
      }
   }

   return (
      <div className="flex min-h-screen flex-col">
         <Seo storeData={storeData} />
         <main className="flex-1 pb-16 lg:pb-0">
            {/* <HeroSection /> */}
            <DynamicHero />

            {/* Features Section */}
            {isLoading ? (
               <div className="py-4"></div>
            ) : hasDynamicSections ? (
               featuresSections.map((section: any) => (
                  <FeaturesBanner key={section.id} features={safeParse(section.content)} />
               ))
            ) : (
               <FeaturesBanner />
            )}

            {/* Static Popular Category */}
            <PopularCategory />

            {/* Products Sections */}
            {isLoading ? (
               <div className="py-12"></div>
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
      </div>
   );
};

export default Index;
