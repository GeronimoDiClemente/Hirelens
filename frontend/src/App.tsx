import { useState, useEffect } from 'react';
import { Plus, Archive as ArchiveIcon, FileText, Settings, Filter } from 'lucide-react';
import { createNote, deleteNote, fetchNotes, toggleArchiveNote, updateNote, addCategoryToNote, removeCategoryFromNote, fetchCategories } from './api';
import type { CreateNoteDto, Note, Category } from './api';
import { NoteCard } from './components/NoteCard';
import { NoteForm } from './components/NoteForm';
import { Button } from './components/ui/Button';
import { Modal } from './components/ui/Modal';
import { CategoryManager } from './components/CategoryManager';
import { NoteCategorySelector } from './components/NoteCategorySelector';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [managingTagsNote, setManagingTagsNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsCategoriesModalOpen(false);
    setEditingNote(null);
    setManagingTagsNote(null);
    setNoteToDelete(null);
  };

  const loadData = async () => {
    try {
      const notesData = await fetchNotes(showArchived);
      setNotes(notesData);
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [showArchived]);

  const filteredNotes = notes.filter(note => {
    if (selectedCategoryFilter === null) return true;
    return note.categories?.some(c => c.id === selectedCategoryFilter);
  });

  const handleCreate = async (data: CreateNoteDto) => {
    try {
      await createNote(data);
      closeModals();
      loadData();
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleUpdate = async (data: CreateNoteDto) => {
    if (!editingNote) return;
    try {
      await updateNote(editingNote.id, data);
      closeModals();
      loadData();
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDelete = (id: number) => {
    setNoteToDelete(id);
  };

  const confirmDelete = async () => {
    if (noteToDelete === null) return;
    try {
      await deleteNote(noteToDelete);
      setNoteToDelete(null);
      loadData();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleToggleArchive = async (id: number) => {
    try {
      await toggleArchiveNote(id);
      loadData();
    } catch (error) {
      console.error('Failed to toggle archive:', error);
    }
  };

  const handleAddCategoryToNote = async (categoryId: number) => {
    if (!managingTagsNote) return;
    try {
      await addCategoryToNote(managingTagsNote.id, categoryId);
      // Optimistic update or reload
      const updatedNote = { ...managingTagsNote, categories: [...(managingTagsNote.categories || []), categories.find(c => c.id === categoryId)!] };
      setManagingTagsNote(updatedNote);
      loadData();
    } catch (error) {
      console.error("Failed to add category", error);
    }
  }

  const handleRemoveCategoryFromNote = async (categoryId: number) => {
    if (!managingTagsNote) return;
    try {
      await removeCategoryFromNote(managingTagsNote.id, categoryId);
      const updatedNote = { ...managingTagsNote, categories: managingTagsNote.categories.filter(c => c.id !== categoryId) };
      setManagingTagsNote(updatedNote);
      loadData();
    } catch (error) {
      console.error("Failed to remove category", error);
    }
  }

  return (
    <div className="min-h-screen bg-pastel-bg p-8">
      <header className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white">
          <div>
            <h1 className="text-4xl font-extrabold text-pastel-text tracking-tight mb-1">My Notes</h1>
            <p className="text-gray-500 text-sm">Capture your thoughts in style</p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="pl-8 pr-4 py-2 border-none rounded-xl text-sm bg-white/60 focus:ring-2 focus:ring-pastel-primary focus:outline-none shadow-sm text-pastel-text"
                value={selectedCategoryFilter || ''}
                onChange={(e) => setSelectedCategoryFilter(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <Button variant="ghost" onClick={() => { closeModals(); setIsCategoriesModalOpen(true); }} title="Manage Categories">
              <Settings className="w-4 h-4" />
            </Button>

            <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>

            <Button
              variant="secondary"
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center gap-2"
            >
              {showArchived ? <FileText className="w-4 h-4" /> : <ArchiveIcon className="w-4 h-4" />}
              {showArchived ? 'Active' : 'Archived'}
            </Button>

            {!showArchived && (
              <Button onClick={() => { closeModals(); setIsCreateModalOpen(true); }} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Note
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No notes found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={(note) => { closeModals(); setEditingNote(note); }}
                  onDelete={handleDelete}
                  onToggleArchive={handleToggleArchive}
                  onManageCategories={(note) => { closeModals(); setManagingTagsNote(note); }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Note"
      >
        <NoteForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
        title="Edit Note"
      >
        <NoteForm
          initialData={editingNote || undefined}
          onSubmit={handleUpdate}
          onCancel={() => setEditingNote(null)}
        />
      </Modal>

      <Modal
        isOpen={isCategoriesModalOpen}
        onClose={() => { setIsCategoriesModalOpen(false); loadData(); }} // Reload to refresh categories everywhere
        title="Manage Categories"
      >
        <CategoryManager />
      </Modal>

      <Modal
        isOpen={!!managingTagsNote}
        onClose={() => setManagingTagsNote(null)}
        title="Manage Tags"
      >
        {managingTagsNote && (
          <NoteCategorySelector
            selectedCategoryIds={managingTagsNote.categories?.map(c => c.id) || []}
            onAddCategory={handleAddCategoryToNote}
            onRemoveCategory={handleRemoveCategoryFromNote}
          />
        )}
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setManagingTagsNote(null)}>Done</Button>
        </div>
      </Modal>

      <Modal
        isOpen={noteToDelete !== null}
        onClose={() => setNoteToDelete(null)}
        title="Delete Note"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this note? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setNoteToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div >
  );
}

export default App;
