"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function AddressAutocomplete({
    value,
    onChange,
    placeholder = "Enter your address",
    hasError = false,
}) {
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const suggestionsRef = useRef(null);

    // Fetch address suggestions from Nominatim
    const fetchSuggestions = async (query) => {
        if (!query || query.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            // Search within Lagos, Nigeria for better results
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query + ", Lagos, Nigeria"
                )}&limit=5&addressdetails=1`
            );
            const data = await response.json();

            // Format suggestions to show relevant address parts
            const formatted = data.map((result) => ({
                displayName: result.display_name,
                address: result.address?.road
                    ? `${result.address.road}${result.address.suburb
                        ? ", " + result.address.suburb
                        : ""
                    }`
                    : result.display_name.split(",")[0],
                lat: result.lat,
                lon: result.lon,
            }));

            setSuggestions(formatted);
            setSelectedIndex(-1);
        } catch (error) {
            console.error("Autocomplete error:", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    // Debounced fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            if (value && value.trim().length >= 3) {
                fetchSuggestions(value);
                setIsOpen(true);
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [value]);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!isOpen) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    selectSuggestion(suggestions[selectedIndex]);
                }
                break;
            case "Escape":
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    const selectSuggestion = (suggestion) => {
        onChange({ target: { name: "address", value: suggestion.address } });
        setIsOpen(false);
        setSuggestions([]);
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={suggestionsRef}>
            <input
                type="text"
                name="address"
                value={value}
                onChange={(e) => {
                    onChange(e);
                    setIsOpen(true);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => value && suggestions.length > 0 && setIsOpen(true)}
                className={`w-full px-3 py-2 border rounded bg-[#F5F5F5] text-sm text-[#1C1917] placeholder-[#A6A09B] focus:outline-none transition-colors ${hasError ? "border-red-500 focus:border-red-500" : "border-[#D6D3D1] focus:border-[#1C1917]"
                    }`}
                placeholder={placeholder}
                autoComplete="off"
            />

            {/* Loading indicator */}
            {loading && (
                <div className="absolute right-3 top-2.5">
                    <div className="animate-spin h-4 w-4 border-2 border-[#D6D3D1] border-t-[#1C1917] rounded-full" />
                </div>
            )}

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D6D3D1] rounded shadow-lg z-10">
                    <ul className="max-h-64 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => selectSuggestion(suggestion)}
                                className={`px-3 py-2 cursor-pointer text-sm transition-colors ${index === selectedIndex
                                    ? "bg-[#1C1917] text-white"
                                    : "hover:bg-[#F5F5F5] text-[#1C1917]"
                                    }`}
                            >
                                <div className="font-medium">{suggestion.address}</div>
                                <div className={`text-xs ${index === selectedIndex ? "text-gray-200" : "text-[#79716B]"}`}>
                                    {suggestion.displayName.split(",").slice(1, 3).join(",")}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* No results message */}
            {isOpen && !loading && value && suggestions.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D6D3D1] rounded shadow-lg z-10 p-3">
                    <p className="text-xs text-[#79716B]">No addresses found. Try a different search.</p>
                </div>
            )}
        </div>
    );
}
