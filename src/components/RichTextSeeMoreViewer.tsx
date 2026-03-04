"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RichTextViewerProps {
   content: string;
   className?: string;
}

export function RichTextSeeMoreViewer({ content, className }: RichTextViewerProps) {
   const [expanded, setExpanded] = useState(false);
   const [isOverflowing, setIsOverflowing] = useState(false);
   const contentRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!contentRef.current) return;

      const el = contentRef.current;
      // Check if content exceeds 3 lines
      setIsOverflowing(el.scrollHeight > el.clientHeight);
   }, [content, expanded]);

   if (!content) return null;

   return (
      <div className="relative">
         <div
            ref={contentRef}
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
