export function getImageUrl(imagePath?: unknown, placeholder: string = "/placeholder.svg"): string {
   if (!imagePath) return placeholder;

   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
   const rawPath = typeof imagePath === "string" ? imagePath : (imagePath as { url?: string })?.url || "";
   const path = rawPath.replace(/^\/+/, "");

   return `${baseUrl}/${path}`;
}
