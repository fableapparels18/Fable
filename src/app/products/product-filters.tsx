'use client';

import { Button } from "@/components/ui/button";
import { CATEGORIES } from "./constants";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

type ProductFiltersProps = {
    selectedCategories: string[];
    onCategoryChange: (category: string, checked: boolean) => void;
};

export function ProductFilters({ selectedCategories, onCategoryChange }: ProductFiltersProps) {
    return (
        <div>
            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Filter by:</p>
                {CATEGORIES.map(category => (
                    <Button
                        key={category}
                        variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onCategoryChange(category, !selectedCategories.includes(category))}
                        className="rounded-full px-4"
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Mobile Filters */}
            <div className="md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <ListFilter className="mr-2 h-4 w-4" />
                            Filter by
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Categories</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {CATEGORIES.map(category => (
                            <DropdownMenuCheckboxItem
                                key={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={(checked) => onCategoryChange(category, !!checked)}
                            >
                                {category}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
