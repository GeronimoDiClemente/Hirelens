import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../api';
import type { Category } from '../api';

interface NoteCategorySelectorProps {
    selectedCategoryIds: number[];
    onAddCategory: (categoryId: number) => void;
    onRemoveCategory: (categoryId: number) => void;
}

export const NoteCategorySelector: React.FC<NoteCategorySelectorProps> = ({ selectedCategoryIds, onAddCategory, onRemoveCategory }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchCategories().then(setCategories).catch(console.error);
    }, []);

    const availableCategories = categories.filter(c => !selectedCategoryIds.includes(c.id));
    const selectedCategoriesData = categories.filter(c => selectedCategoryIds.includes(c.id));

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Tags</h4>
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategoriesData.map(category => (
                    <span key={category.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {category.name}
                        <button onClick={() => onRemoveCategory(category.id)} className="ml-1 text-blue-500 hover:text-blue-700">×</button>
                    </span>
                ))}
            </div>
            {availableCategories.length > 0 && (
                <div className="flex gap-2">
                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-1 border"
                        onChange={(e) => {
                            if (e.target.value) {
                                onAddCategory(Number(e.target.value));
                                e.target.value = '';
                            }
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>Add tag...</option>
                        {availableCategories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};
