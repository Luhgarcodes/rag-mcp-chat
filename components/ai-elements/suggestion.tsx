"use client"

import { ComponentProps, useCallback } from "react"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { cn } from "cn"
import { Button } from "../ui/button"

export type SuggestionsProps = ComponentProps<typeof ScrollArea>

export const Suggestions = ({
  className,
  children,
  ...props
}: SuggestionsProps) => {
  return (
    <ScrollArea
      className="w-full scroll-fade-x scrollbar-none overflow-x-auto whitespace-nowrap"
      {...props}
    >
      <div
        className={cn("flex w-max flex-nowrap items-center gap-2", className)}
      >
        {children}
      </div>
      <ScrollBar className="hidden" orientation="horizontal" />
    </ScrollArea>
  )
}
export type SuggestionProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  suggestion: string
  onClick?: (suggestion: string) => void
}

export const Suggestion = ({
  suggestion,
  onClick,
  className,
  variant = "outline",
  size = "sm",
  children,
  ...props
}: SuggestionProps) => {
  const handleClick = useCallback(() => {
    onClick?.(suggestion)
  }, [onClick, suggestion])

  return (
    <Button
      onClick={handleClick}
      className={cn("cursor-pointer rounded-full px-4", className)}
      variant={variant}
      size={size}
      type="button"
      {...props}
    >
      {children ?? suggestion}
    </Button>
  )
}
