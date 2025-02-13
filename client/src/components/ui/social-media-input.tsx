import { useState } from "react"
import { Input } from "./input"
import { Button } from "./button"
import { Plus, X } from "lucide-react"

interface SocialMediaInputProps {
  value: string[]
  onChange: (urls: string[]) => void
  className?: string
}

export function SocialMediaInput({
  value = [],
  onChange,
  className
}: SocialMediaInputProps) {
  const [newUrl, setNewUrl] = useState("")

  const addUrl = () => {
    if (newUrl && isValidUrl(newUrl)) {
      onChange([...value, newUrl])
      setNewUrl("")
    }
  }

  const removeUrl = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className={className}>
      <div className="flex gap-2 mb-2">
        <Input
          type="url"
          placeholder="Enter social media URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addUrl()
            }
          }}
        />
        <Button
          type="button"
          size="icon"
          onClick={addUrl}
          disabled={!newUrl || !isValidUrl(newUrl)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {value.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              type="url"
              value={url}
              readOnly
              className="flex-1"
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => removeUrl(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
