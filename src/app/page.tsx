"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/PromptCard";
import { PromptModal } from "@/components/PromptModal";
import { useSearchStore } from "@/store/useSearchStore";
import { toast } from "sonner";
import { getPrompts, createPrompt, updatePrompt, deletePrompt } from "./actions";

interface Prompt {
  id: number;
  title: string;
  content: string;
  category?: string;
  tags?: string;
  isPinned: boolean;
}

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>(undefined);
  const { searchQuery, setSearchQuery } = useSearchStore();
  const [isLoading, setIsLoading] = useState(true);

  const loadPrompts = async () => {
    setIsLoading(true);
    const data = await getPrompts();
    setPrompts(data as Prompt[]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const handleSave = async (promptData: any) => {
    try {
      let result;
      if (promptData.id) {
        const { id, ...data } = promptData;
        result = await updatePrompt(id, data);
      } else {
        result = await createPrompt(promptData);
      }

      if (result.success) {
        toast.success(promptData.id ? "Prompt updated" : "Prompt created");
        loadPrompts();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Failed to save prompt");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;
    
    try {
      const result = await deletePrompt(id);
      if (result.success) {
        toast.success("Prompt deleted");
        loadPrompts();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Failed to delete prompt");
    }
  };

  const handleTogglePin = async (prompt: Prompt) => {
    await handleSave({ ...prompt, isPinned: !prompt.isPinned });
  };

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [prompts, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Terminal className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">PromptManager</h1>
          </div>

          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search prompts..."
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button onClick={() => { setEditingPrompt(undefined); setIsModalOpen(true); }} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Prompt</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onDelete={handleDelete}
                onEdit={(p) => { setEditingPrompt(p); setIsModalOpen(true); }}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-muted p-6 rounded-full mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No prompts found</h3>
            <p className="text-muted-foreground max-w-xs">
              {searchQuery ? "Try adjusting your search query." : "Start by creating your first prompt!"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsModalOpen(true)} variant="outline" className="mt-6">
                Create First Prompt
              </Button>
            )}
          </div>
        )}
      </main>

      <PromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingPrompt}
      />
    </div>
  );
}
