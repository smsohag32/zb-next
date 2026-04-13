"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import "@/assets/tiptap.css";

interface RichTextViewerProps {
   content: string;
   className?: string;
}

export function RichTextSeeMoreViewer({ content, className }: RichTextViewerProps) {
   const [expanded, setExpanded] = useState(false);

   if (!content) return null;

   return (
      <div className="relative">
         <div
            className={cn(
               "tiptap-content prose dark:prose-invert max-w-none transition-all",
               !expanded && "line-clamp-3 overflow-hidden",
               className,
            )}
            dangerouslySetInnerHTML={{ __html: content }}
         />

         {content.length > 300 && (
            <button
               onClick={() => setExpanded((prev) => !prev)}
               className="mt-1 text-sm font-medium text-primary hover:underline">
               {expanded ? "See less" : "... See more"}
            </button>
         )}
      </div>
   );
}
