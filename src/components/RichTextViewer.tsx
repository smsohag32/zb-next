import { cn } from "@/lib/utils";

interface RichTextViewerProps {
    content: string;
    className?: string;
}

export function RichTextViewer({ content, className }: RichTextViewerProps) {
    if (!content) return null;

    return (
        <div
            className={cn(
                "tiptap-content prose dark:prose-invert max-w-none",
                className
            )}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
