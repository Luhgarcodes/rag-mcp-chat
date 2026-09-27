import { UIMessage } from "ai"

const DEFAULT_SUGGESTIONS = [
  "How can I help you?",
  "What can I do for you?",
  "Why is that?",
]
interface UseChatSuggestionsOptions {
  messages?: UIMessage[]
  isBusy?: boolean
}

export function useChatSuggestions({
  messages = [],
  isBusy = false,
}: UseChatSuggestionsOptions = {}) {
  const lastAssistantMessage = messages
    .filter((m) => m.role === "assistant")
    .at(-1)

  const isSuggestionsLoading = Boolean(
    lastAssistantMessage?.parts?.some(
      (part) => part.type === "data-suggestions-loading"
    )
  )

  const suggestionsPart = lastAssistantMessage?.parts?.find(
    (part) => part.type === "data-suggestions"
  ) as { type: string; data?: { suggestion: string[] } } | undefined

  const dataSuggestions = suggestionsPart?.data?.suggestion

  const isMainTextStreaming = isBusy && !isSuggestionsLoading

  const suggestions =
    dataSuggestions && dataSuggestions.length > 0
      ? dataSuggestions
      : messages.length === 0
        ? DEFAULT_SUGGESTIONS
        : []

  const isLoading =
    isSuggestionsLoading && (!dataSuggestions || dataSuggestions.length === 0)

  const isVisible =
    !isMainTextStreaming && (isLoading || suggestions.length > 0)
  return {
    suggestions,
    isLoading,
    isVisible,
    isMainTextStreaming,
  }
}
