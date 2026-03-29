import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Trash2, Pin, PinOff } from "lucide-react";
import { toast } from "sonner";

interface Prompt {
  id: number;
  title: string;
  content: string;
  category?: string;
  tags?: string;
  isPinned: boolean;
}

interface PromptCardProps {
  prompt: Prompt;
  onDelete: (id: number) => void;
  onEdit: (prompt: Prompt) => void;
  onTogglePin: (prompt: Prompt) => void;
}

export function PromptCard({ prompt, onDelete, onEdit, onTogglePin }: PromptCardProps) {
  const [isCopying, setIsCopying] = useState(false);

  const copyToClipboard = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(prompt.content);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    } finally {
      setTimeout(() => setIsCopying(false), 1000);
    }
  };

  return (
    <Card className={`relative group transition-all hover:shadow-md ${prompt.isPinned ? "border-primary/50 bg-primary/5" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">{prompt.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => onTogglePin(prompt)}
          >
            {prompt.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </Button>
        </div>
        {prompt.category && (
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {prompt.category}
          </span>
        )}
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
          {prompt.content}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t bg-muted/50 rounded-b-lg">
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(prompt)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onDelete(prompt.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button size="sm" className="gap-2" onClick={copyToClipboard} disabled={isCopying}>
          <Copy className="h-4 w-4" />
          {isCopying ? "Copied" : "Copy"}
        </Button>
      </CardFooter>
    </Card>
  );
}
