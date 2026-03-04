"use client";

import { useState } from "react";
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle, Send } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
    title: string;
    text?: string;
    className?: string;
}

export function ShareButton({ title, text, className }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();
    // Safe window access — this component is always "use client" so window exists at runtime
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast({ title: "Link copied!", description: "Product link has been copied to your clipboard." });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast({ title: "Failed to copy", description: "Could not copy the link.", variant: "destructive" });
        }
    };

    const socialLinks = [
        {
            name: "Facebook",
            icon: <Facebook className="h-5 w-5 fill-current" />,
            color: "bg-[#1877F2] hover:bg-[#1877F2]/90",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: "WhatsApp",
            icon: <MessageCircle className="h-5 w-5 fill-current" />,
            color: "bg-[#25D366] hover:bg-[#25D366]/90",
            href: `https://wa.me/?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`,
        },
        {
            name: "Twitter",
            icon: <Twitter className="h-5 w-5 fill-current" />,
            color: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90",
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: "Telegram",
            icon: <Send className="h-5 w-5 fill-current" />,
            color: "bg-[#0088cc] hover:bg-[#0088cc]/90",
            href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
        },
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" variant="outline" className={cn("transition-all", className)} aria-label="Share product" title="Share Product">
                    <Share2 className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Share Product</DialogTitle>
                    <DialogDescription>Share this product with your friends and family.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Input value={shareUrl} readOnly className="pr-12 bg-muted/50 font-mono text-xs focus-visible:ring-primary" />
                        </div>
                        <Button type="button" size="icon" onClick={handleCopy} className={cn("transition-all duration-300", copied ? "bg-green-600 hover:bg-green-700" : "bg-primary")}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {socialLinks.map((link) => (
                            <a key={link.name} href={link.href} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 group">
                                <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 active:scale-95", link.color)}>
                                    {link.icon}
                                </div>
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider group-hover:text-foreground">
                                    {link.name}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
