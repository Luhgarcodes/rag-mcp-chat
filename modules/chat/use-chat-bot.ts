"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

/**
 * Custom hook that wraps useChat with the RAG chatbot configuration.
 * Centralizes all chat state and actions.
 */
export function useChatBot() {
  const chat = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  })

  const isBusy = chat.status === "submitted" || chat.status === "streaming"

  console.log("🔥 useChatBot RENDER", {
    messages: chat.messages,
    status: chat.status,
    isBusy,
  })

  const handleSendMessage = (text: string) => {
    console.log("🔥 SEND", text)

    chat.sendMessage(
      { text },
      {
        body: {
          lastMessage: text,
        },
      }
    )
  }

  console.log("All ------- --#######--state", {
    messages: chat.messages,
    status: chat.status,
    isBusy,
    sendMessage: handleSendMessage,
    stop: chat.stop,
  })

  return {
    messages: chat.messages,
    status: chat.status,
    isBusy,
    sendMessage: handleSendMessage,
    stop: chat.stop,
  }
}
