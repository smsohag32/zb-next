import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function CartSkeleton() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 pb-16 lg:pb-0">
                <div className="container py-8">
                    {/* Title Skeleton */}
                    <Skeleton className="h-10 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-8" />

                    <div className="mt-8 grid gap-8 lg:grid-cols-3">
                        {/* Cart Items List Skeleton */}
                        <div className="lg:col-span-2 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-4 p-4 border rounded-xl">
                                    <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <div className="flex justify-between items-center pt-2">
                                            <Skeleton className="h-8 w-24 rounded-md" />
                                            <Skeleton className="h-6 w-16" />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between pt-4">
                                <Skeleton className="h-10 w-36" />
                                <Skeleton className="h-10 w-28" />
                            </div>
                        </div>

                        {/* Order Summary Skeleton */}
                        <div className="lg:col-span-1">
                            <div className="rounded-xl border p-6 sticky top-24 space-y-6">
                                <Skeleton className="h-7 w-36" />

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-24" />
                                </div>

                                <Skeleton className="h-12 w-full rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
