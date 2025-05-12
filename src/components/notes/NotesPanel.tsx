
import React, { useState } from "react";
import { X, Plus, Save, MessageSquare, ListTodo, Square, CheckSquare, GripVertical } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
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
      updatedAt: "2025-04-25T10:30:00",
      tasks: [
        { id: "task1-1", text: "Send spec sheet to client", completed: true },
        { id: "task1-2", text: "Follow up on questions", completed: false }
      ]
    },
    {
      id: "2",
      content: "Need to follow up on material costs - prices may have increased since initial quote.",
      createdAt: "2025-04-26T14:15:00",
      updatedAt: "2025-04-26T14:15:00",
      tasks: [
        { id: "task2-1", text: "Contact suppliers for updated pricing", completed: false },
        { id: "task2-2", text: "Update quote with new figures", completed: false }
      ]
    },
    {
      id: "3",
      content: "Project meeting scheduled for May 5th to discuss timeline adjustments.",
      createdAt: "2025-04-28T09:45:00",
      updatedAt: "2025-04-28T09:45:00",
      tasks: []
    }
  ]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [newTask, setNewTask] = useState("");
  const [addingTaskToNoteId, setAddingTaskToNoteId] = useState<string | null>(null);

  const addNote = () => {
    if (newNote.trim() === "") return;
    
    const now = new Date().toISOString();
    const newNoteObj: Note = {
      id: `note-${Date.now()}`,
      content: newNote,
      createdAt: now,
      updatedAt: now,
      tasks: []
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

  const addTask = (noteId: string) => {
    if (!newTask.trim()) return;

    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          tasks: [
            ...note.tasks,
            {
              id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              text: newTask.trim(),
              completed: false
            }
          ],
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    });

    setNotes(updatedNotes);
    setNewTask("");
    setAddingTaskToNoteId(null);

    toast({
      title: "Task added",
      description: "Your task has been successfully added to the note.",
    });
  };

  const toggleTaskCompletion = (noteId: string, taskId: string, completed: boolean) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          tasks: note.tasks.map(task => 
            task.id === taskId ? { ...task, completed } : task
          ),
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    });

    setNotes(updatedNotes);
  };

  const removeTask = (noteId: string, taskId: string) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          tasks: note.tasks.filter(task => task.id !== taskId),
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    });

    setNotes(updatedNotes);

    toast({
      title: "Task removed",
      description: "Your task has been successfully removed.",
    });
  };

  // Function to get all incomplete tasks across all notes
  const getAllIncompleteTasks = () => {
    return notes.flatMap(note => 
      note.tasks.filter(task => !task.completed)
        .map(task => ({ note, task }))
    );
  };

  // Expose incomplete tasks to parent components
  React.useEffect(() => {
    // This could be used to communicate with parent components
    const incompleteTasks = getAllIncompleteTasks();
    // In a real app, you might use a context or callback prop here
    window.notesIncompleteTasks = incompleteTasks.length;
  }, [notes]);

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
                          
                          {/* Tasks Section */}
                          {note.tasks.length > 0 && (
                            <div className="mt-3 border-t pt-3">
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <ListTodo className="h-4 w-4 mr-1 text-gray-500" />
                                Tasks
                              </h4>
                              <ul className="space-y-2">
                                {note.tasks.map(task => (
                                  <li key={task.id} className="flex items-center gap-2">
                                    <div className="flex items-center flex-1">
                                      <GripVertical className="h-4 w-4 text-gray-300 mr-1 cursor-move" />
                                      <Checkbox 
                                        id={task.id} 
                                        checked={task.completed}
                                        onCheckedChange={(checked) => {
                                          toggleTaskCompletion(note.id, task.id, checked === true);
                                        }}
                                      />
                                      <label 
                                        htmlFor={task.id}
                                        className={`ml-2 text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}
                                      >
                                        {task.text}
                                      </label>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-6 w-6 p-0" 
                                      onClick={() => removeTask(note.id, task.id)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Add Task Form */}
                          {addingTaskToNoteId === note.id ? (
                            <div className="mt-3 border-t pt-3">
                              <div className="flex gap-2">
                                <Input 
                                  placeholder="Enter task..."
                                  value={newTask}
                                  onChange={(e) => setNewTask(e.target.value)}
                                  className="text-sm"
                                />
                                <Button 
                                  size="sm"
                                  onClick={() => addTask(note.id)}
                                >
                                  Add
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setAddingTaskToNoteId(null);
                                    setNewTask("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs flex items-center"
                                onClick={() => setAddingTaskToNoteId(note.id)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Task
                              </Button>
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-2 mt-4">
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
