import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react';
import type { Note } from '../api';
import { Button } from './ui/Button';

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: number) => void;
    onToggleArchive: (id: number) => void;
    onManageCategories: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onToggleArchive, onManageCategories }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-pastel-text">{note.title}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => onManageCategories(note)} title="Manage Tags">
                        <span className="font-bold text-xs">#</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(note)} title="Edit">
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onToggleArchive(note.id)} title={note.isArchived ? "Unarchive" : "Archive"}>
                        {note.isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(note.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50" title="Delete">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap mb-6 flex-grow leading-relaxed">{note.content}</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {note.categories?.map(cat => (
                    <span key={cat.id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-pastel-accent text-pastel-text">
                        {cat.name}
                    </span>
                ))}
            </div>
            <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};
