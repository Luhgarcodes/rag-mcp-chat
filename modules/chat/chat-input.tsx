import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input"
import { CardFooter } from "@/components/ui/card"
import { ChatStatus } from "ai"
import { Prompt } from "next/font/google"

interface ChatInputProps {
  status: ChatStatus
  isBusy: boolean
  onSendMessage: (msg: string) => void
  onStop: () => void
}

export function ChatInput({
  status,
  isBusy,
  onSendMessage,
  onStop,
}: ChatInputProps) {
  return (
    <CardFooter>
      <PromptInput
        onSubmit={({ text }) => {
          if (text.trim()) {
            onSendMessage(text.trim())
          }
        }}
      >
        <PromptInputTextarea
          placeholder={isBusy ? "Generating..." : "Type a message..."}
          disabled={isBusy}
        />
        <PromptInputFooter>
          <PromptInputSubmit status={status} onStop={onStop} />
        </PromptInputFooter>
      </PromptInput>
    </CardFooter>
  )
}
