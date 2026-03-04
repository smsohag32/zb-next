export function formatCurrency(amount: number): string {
   return `BDT ${new Intl.NumberFormat("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   }).format(amount)}`;
}

export function formatDate(date: string | Date): string {
   return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
   }).format(new Date(date));
}

export function formatShortDate(date: string | Date): string {
   return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
   }).format(new Date(date));
}

export function formatRelativeDate(date: string | Date): string {
   const now = new Date();
   const then = new Date(date);
   const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

   if (diffInSeconds < 60) return "Just now";
   if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
   if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
   if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

   return formatShortDate(date);
}

export function truncateText(text: string, maxLength: number): string {
   if (text.length <= maxLength) return text;
   return text.slice(0, maxLength).trim() + "...";
}

export function slugify(text: string): string {
   return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
}

export function getDiscountPercentage(original: number, current: number): number {
   return Math.round(((original - current) / original) * 100);
}

export const capitalizeWords = (text: string) =>
   text.replace(/\b\w/g, (char) => char.toUpperCase());

export const formatCategoryTitle = (categories: string[]) => capitalizeWords(categories.join(", "));
export const cleanDescription = (text = "", max = 160) => {
   const plainText = text
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
   return plainText.length > max ? plainText.slice(0, max).trim() + "..." : plainText;
};
