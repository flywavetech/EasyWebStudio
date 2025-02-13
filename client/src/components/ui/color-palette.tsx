import { Button } from "./button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const predefinedColors = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#64748b', // Slate
]

interface ColorPaletteProps {
  value: string
  onChange: (color: string) => void
  className?: string
}

export function ColorPalette({
  value,
  onChange,
  className,
}: ColorPaletteProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {predefinedColors.map((color) => (
        <Button
          key={color}
          type="button"
          variant="outline"
          className={cn(
            "h-8 w-8 rounded-full p-0 border-2",
            value === color && "border-black dark:border-white"
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        >
          {value === color && (
            <Check className="h-4 w-4 text-white" />
          )}
        </Button>
      ))}
    </div>
  )
}
