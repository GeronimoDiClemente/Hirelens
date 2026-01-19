import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseBoolPipe, DefaultValuePipe } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    @Post()
    create(@Body() createNoteDto: CreateNoteDto) {
        return this.notesService.create(createNoteDto);
    }

    @Get()
    findAll(@Query('archived', new DefaultValuePipe(false), ParseBoolPipe) archived: boolean) {
        return this.notesService.findAll(archived);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.notesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateNoteDto: Partial<CreateNoteDto>) {
        return this.notesService.update(+id, updateNoteDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.notesService.remove(+id);
    }

    @Patch(':id/archive')
    toggleArchive(@Param('id') id: string) {
        return this.notesService.toggleArchive(+id);
    }

    @Post(':id/categories/:categoryId')
    addCategory(@Param('id') id: string, @Param('categoryId') categoryId: string) {
        return this.notesService.addCategory(+id, +categoryId);
    }

    @Delete(':id/categories/:categoryId')
    removeCategory(@Param('id') id: string, @Param('categoryId') categoryId: string) {
        return this.notesService.removeCategory(+id, +categoryId);
    }
}
