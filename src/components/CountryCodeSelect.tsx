"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { countryCodes, type CountryCode } from "@/data/country-codes";

interface CountryCodeSelectProps {
  value: string;
  onChange: (dial: string) => void;
}

export default function CountryCodeSelect({
  value,
  onChange,
}: CountryCodeSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => countryCodes.find((c) => c.dial === value) ?? countryCodes.find((c) => c.code === "US")!,
    [value]
  );

  const filtered = useMemo(() => {
    if (!search) return countryCodes;
    const q = search.toLowerCase();
    return countryCodes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Focus search when opened
  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
    }
  }, [open]);

  const handleSelect = (country: CountryCode) => {
    onChange(country.dial);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-white/5 border border-white/15 rounded-xl px-3 py-3 text-white text-base outline-none hover:bg-white/10 transition-colors min-w-[100px]"
      >
        <span className="text-lg">{selected.flag}</span>
        <span className="text-sm">{selected.dial}</span>
        <ChevronDown
          size={14}
          className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 max-h-72 bg-slate-900 border border-white/15 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden flex flex-col">
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/10">
            <Search size={14} className="text-white/30 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full bg-transparent text-sm text-white placeholder-white/25 outline-none"
            />
          </div>

          {/* Country list */}
          <div ref={listRef} className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-white/30">
                No results
              </div>
            ) : (
              filtered.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-white/10 transition-colors ${
                    country.dial === value ? "bg-violet-500/15" : ""
                  }`}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm text-white flex-1 truncate">
                    {country.name}
                  </span>
                  <span className="text-xs text-white/40">{country.dial}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
