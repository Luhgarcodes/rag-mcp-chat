"use client"

import { MessageScrollerProvider } from "@/components/ui/message-scroller"
import { Card } from "@/components/ui/card"
import { ChatHeader } from "./chat-header"
import { ChatMessage } from "./chat-message"
import { useChatBot } from "./use-chat-bot"
import ChatSuggestions from "./chat-suggestions"
import { ChatInput } from "./chat-input"

export function ChatBot() {
  const { messages, status, isBusy, sendMessage, stop } = useChatBot()

  console.log("🔥 ChatBot RENDER", {
    messages,
    status,
    isBusy,
  })

  return (
    <MessageScrollerProvider>
      <div className="relative flex flex-col gap-4">
        <Card className="mx-auto h-[calc(100dvh-2rem)] w-full max-w-2xl gap-0">
          <ChatHeader />

          <ChatMessage messages={messages} isBusy={isBusy} />

          <ChatSuggestions
            messages={messages}
            isBusy={isBusy}
            onSendMessage={sendMessage}
          />

          <ChatInput
            status={status}
            isBusy={isBusy}
            onSendMessage={sendMessage}
            onStop={stop}
          />
        </Card>
      </div>
    </MessageScrollerProvider>
  )
}
