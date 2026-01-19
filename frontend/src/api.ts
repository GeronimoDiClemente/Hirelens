import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

export interface Category {
    id: number;
    name: string;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    categories: Category[];
}

export interface CreateNoteDto {
    title: string;
    content: string;
}

export interface CreateCategoryDto {
    name: string;
}

export const fetchNotes = async (archived: boolean = false) => {
    const response = await api.get<Note[]>('/notes', { params: { archived } });
    return response.data;
};

export const createNote = async (note: CreateNoteDto) => {
    const response = await api.post<Note>('/notes', note);
    return response.data;
};

export const updateNote = async (id: number, note: Partial<CreateNoteDto>) => {
    const response = await api.patch<Note>(`/notes/${id}`, note);
    return response.data;
};

export const deleteNote = async (id: number) => {
    await api.delete(`/notes/${id}`);
};

export const toggleArchiveNote = async (id: number) => {
    await api.patch(`/notes/${id}/archive`);
};

export const fetchCategories = async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
};

export const createCategory = async (name: string) => {
    const response = await api.post<Category>('/categories', { name });
    return response.data;
}

export const addCategoryToNote = async (noteId: number, categoryId: number) => {
    await api.post(`/notes/${noteId}/categories/${categoryId}`);
}

export const removeCategoryFromNote = async (noteId: number, categoryId: number) => {
    await api.delete(`/notes/${noteId}/categories/${categoryId}`);
}
