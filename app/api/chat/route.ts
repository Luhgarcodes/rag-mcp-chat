import { generateSuggestions } from "@/actions/suggestions"
import { streamRAGAgent } from "@/lib/agents/rag-agents"
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  toUIMessageStream,
  UIMessage,
} from "ai"
import { NextResponse, type NextRequest } from "next/server"

type ChatRequest = {
  id: string
  lastMessage: string
  messages: UIMessage[]
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequest

  const { lastMessage, messages } = body
  if (!lastMessage || typeof lastMessage !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'lastMessage' field" },
      { status: 400 }
    )
  }

  try {
    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        execute: async ({ writer }) => {
          const result = await streamRAGAgent({
            lastMessage,
            conversationHistory: messages,
            signal: req.signal,
          })

          writer.merge(toUIMessageStream({ stream: result.stream }))
          const answer = await result.text

          if (answer && answer.trim().length > 0) {
            try {
              writer.write({
                type: "data-suggestions-loading",
                data: "loading",
              })
              const suggestions = await generateSuggestions(lastMessage, answer)

              writer.write({
                type: "data-suggestions",
                data: suggestions,
              })
            } catch (error) {
              console.error("[RAG API] Error generating suggestions:", error)
            }
          }
        },
      }),
    })
  } catch (error) {
    console.error("[RAG API] Error:", error)
    return NextResponse.json(
      { error: "Failed to process your question" },
      { status: 500 }
    )
  }
}
