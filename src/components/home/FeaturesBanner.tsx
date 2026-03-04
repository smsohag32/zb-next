import { Truck, RotateCcw, Shield, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";
// Map icon strings to components
import * as LucideIcons from "lucide-react";

const getIcon = (iconName: string) => {
   // @ts-ignore
   return LucideIcons[iconName] || LucideIcons.HelpCircle;
};

interface FeatureItem {
   icon: string;
   title: string;
   description: string;
}

interface FeaturesBannerProps {
   features?: FeatureItem[];
}

const defaultFeatures = [
   {
      icon: "Truck",
      title: "Free Shipping",
      description: "On orders over BDT3000",
   },
   {
      icon: "RotateCcw",
      title: "Easy Returns",
      description: "30-day return policy",
   },
   {
      icon: "Shield",
      title: "Secure Payment",
      description: "100% secure checkout",
   },
   {
      icon: "HeadphonesIcon",
      title: "24/7 Support",
      description: "Dedicated support team",
   },
];

export function FeaturesBanner({ features }: FeaturesBannerProps) {
   const displayFeatures = features && features.length > 0 ? features : defaultFeatures;

   return (
      <section className="border-y bg-card">
         <div className="container py-8 lg:py-12">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
               {displayFeatures.map((feature, index) => {
                  const Icon = getIcon(feature.icon);
                  return (
                     <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-3">
                           <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                           <h3 className="font-medium">{feature.title}</h3>
                           <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                     </motion.div>
                  )
               })}
            </div>
         </div>
      </section>
   );
}
