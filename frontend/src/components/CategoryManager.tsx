import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { createCategory, fetchCategories } from '../api';
import type { Category } from '../api';
import { Button } from './ui/Button';

export const CategoryManager: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');

    const loadCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            await createCategory(newCategoryName);
            setNewCategoryName('');
            loadCategories();
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Manage Categories</h3>
            <form onSubmit={handleCreate} className="flex gap-2">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
                <Button type="submit" size="sm">
                    <Plus className="w-4 h-4" />
                </Button>
            </form>
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <span key={category.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {category.name}
                    </span>
                ))}
            </div>
        </div>
    );
};
