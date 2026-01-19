import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Note)
        private notesRepository: Repository<Note>,
        private categoriesService: CategoriesService,
    ) { }

    create(createNoteDto: CreateNoteDto): Promise<Note> {
        const note = this.notesRepository.create(createNoteDto);
        return this.notesRepository.save(note);
    }

    findAll(archived: boolean = false): Promise<Note[]> {
        return this.notesRepository.find({
            where: { isArchived: archived },
            relations: ['categories'],
        });
    }

    async findOne(id: number): Promise<Note> {
        const note = await this.notesRepository.findOne({
            where: { id },
            relations: ['categories'],
        });
        if (!note) {
            throw new NotFoundException(`Note with ID ${id} not found`);
        }
        return note;
    }

    async update(id: number, updateNoteDto: Partial<CreateNoteDto>): Promise<Note> {
        const note = await this.findOne(id);
        Object.assign(note, updateNoteDto);
        return this.notesRepository.save(note);
    }

    async remove(id: number): Promise<void> {
        const result = await this.notesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Note with ID ${id} not found`);
        }
    }

    async toggleArchive(id: number): Promise<Note> {
        const note = await this.findOne(id);
        note.isArchived = !note.isArchived;
        return this.notesRepository.save(note);
    }

    async addCategory(id: number, categoryId: number): Promise<Note> {
        const note = await this.findOne(id);
        const category = await this.categoriesService.findOne(categoryId);
        // Since findAll in CategoriesService returns array, we need findOne there.
        // Wait, CategoriesService only had findAll. I need to add findOne there or use repository directly if I can export it.
        // Actually, let's update CategoriesService first or assume it has findOne (I need to add it).
        // For now, let's implement basic filtering.
        // Actually, changing logic:
        note.categories = [...(note.categories || []), category];
        return this.notesRepository.save(note);
    }

    async removeCategory(id: number, categoryId: number): Promise<Note> {
        const note = await this.findOne(id);
        note.categories = note.categories.filter(c => c.id !== categoryId);
        return this.notesRepository.save(note);
    }
}
