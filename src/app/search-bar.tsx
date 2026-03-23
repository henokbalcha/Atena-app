"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';

export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('search') || '');

    useEffect(() => {
        setQuery(searchParams.get('search') || '');
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/?search=${encodeURIComponent(query)}`);
        } else {
            router.push('/');
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative group min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <SearchIcon size={16} className="dark:text-white/30 text-black/30 group-hover:text-black/60 dark:group-hover:text-white/60 transition-colors" />
            </div>
            <input
                type="text"
                placeholder="Search the network..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="glass-apple pl-14 pr-20 py-4 w-full rounded-full text-sm font-bold focus:outline-none dark:focus:bg-white/10 focus:bg-black/5 transition-all border-none dark:bg-white/5 bg-black/5 dark:placeholder-white/20 placeholder-black/20 dark:text-white text-black shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                <span className="text-[9px] font-black dark:text-white/10 text-black/10 border dark:border-white/5 border-black/5 px-2 py-1 rounded-md uppercase tracking-tighter italic">
                    ⌘K
                </span>
            </div>
        </form>
    );
}
