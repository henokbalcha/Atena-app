'use client'

import { incrementDownload } from "@/app/actions";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";

export function DownloadButton({ apkUrl, appId }: { apkUrl: string, appId: string }) {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            // 1. Trigger the download immediately
            const link = document.createElement('a');
            link.href = apkUrl;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 2. Increment count in background
            await incrementDownload(appId);
        } catch (e) {
            console.error("Download tracking failed", e);
        } finally {
            setTimeout(() => setDownloading(false), 2000);
        }
    }

    return (
        <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 group"
        >
            <DownloadIcon size={16} className={downloading ? "animate-bounce" : "group-hover:translate-y-0.5 transition-transform"} />
            {downloading ? "INSTALLING..." : "INSTALL"}
        </button>
    )
}
