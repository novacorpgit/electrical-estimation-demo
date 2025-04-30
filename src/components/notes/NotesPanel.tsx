
import React, { useState } from "react";
import { X, Plus, Save, MessageSquare } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesPanelProps {
  entityId: string;
  entityType: "project" | "subProject";
  entityName?: string;
}

export function NotesPanel({ entityId, entityType, entityName }: NotesPanelProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      content: "Client requested additional information about electrical specifications.",
      createdAt: "2025-04-25T10:30:00",
      updatedAt: "2025-04-25T10:30:00"
    },
    {
      id: "2",
      content: "Need to follow up on material costs - prices may have increased since initial quote.",
      createdAt: "2025-04-26T14:15:00",
      updatedAt: "2025-04-26T14:15:00"
    },
    {
      id: "3",
      content: "Project meeting scheduled for May 5th to discuss timeline adjustments.",
      createdAt: "2025-04-28T09:45:00",
      updatedAt: "2025-04-28T09:45:00"
    }
  ]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const addNote = () => {
    if (newNote.trim() === "") return;
    
    const now = new Date().toISOString();
    const newNoteObj: Note = {
      id: `note-${Date.now()}`,
      content: newNote,
      createdAt: now,
      updatedAt: now
    };
    
    setNotes([newNoteObj, ...notes]);
    setNewNote("");
    
    toast({
      title: "Note added",
      description: "Your note has been successfully added.",
    });
  };

  const startEditingNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const saveEditedNote = () => {
    if (!editingNoteId) return;
    
    const updatedNotes = notes.map(note => 
      note.id === editingNoteId 
        ? { ...note, content: editingContent, updatedAt: new Date().toISOString() } 
        : note
    );
    
    setNotes(updatedNotes);
    setEditingNoteId(null);
    setEditingContent("");
    
    toast({
      title: "Note updated",
      description: "Your note has been successfully updated.",
    });
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    
    toast({
      title: "Note deleted",
      description: "Your note has been successfully deleted.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed right-0 top-1/2 -translate-y-1/2 h-24 w-12 rounded-l-md rounded-r-none border-r-0 bg-white shadow-md hover:bg-gray-100 transform transition-transform"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-600" />
            <span className="text-xs font-medium text-gray-600 rotate-90 translate-y-2">Notes</span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center justify-between">
            <span>Notes {entityName ? `- ${entityName}` : ''}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="mb-4">
            <Textarea 
              placeholder="Add a new note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <Button 
              className="mt-2 w-full flex items-center justify-center gap-2"
              onClick={addNote}
            >
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <Accordion type="multiple" className="w-full">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <AccordionItem key={note.id} value={note.id} className="border rounded-md mb-3 bg-gray-50">
                    <div className="flex justify-between items-start p-3">
                      <div className="flex-1">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="text-left">
                            <p className="text-sm text-gray-500 pb-1">
                              {formatDate(note.updatedAt)}
                            </p>
                            {editingNoteId !== note.id && (
                              <p className="text-sm line-clamp-2">{note.content}</p>
                            )}
                          </div>
                        </AccordionTrigger>
                      </div>
                    </div>
                    
                    <AccordionContent className="px-3 pb-3">
                      {editingNoteId === note.id ? (
                        <div>
                          <Textarea 
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="min-h-[100px] resize-none"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingNoteId(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={saveEditedNote}
                            >
                              <Save className="h-3.5 w-3.5" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                          <div className="flex justify-end gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startEditingNote(note)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteNote(note.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No notes yet. Add your first note above.
                </div>
              )}
            </Accordion>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
