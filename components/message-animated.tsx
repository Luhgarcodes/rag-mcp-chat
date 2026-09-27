import { UIMessage } from "ai"
import { MessageScrollerItem } from "./ui/message-scroller"
import { Message, MessageContent } from "./ui/message"
import { getMessageText } from "@/lib/ai"
import { Marker, MarkerContent, MarkerIcon } from "./ui/marker"
import { WrenchIcon } from "lucide-react"
import { Spinner } from "./ui/spinner"
import { Bubble, BubbleContent } from "./ui/bubble"
import { MemoizedMarkdown } from "./memoized-markdown"

export interface MessageAnimatedProps extends React.ComponentProps<
  typeof MessageScrollerItem
> {
  message: UIMessage
  scrollAnchor?: boolean
}

function getToolParts(message: UIMessage) {
  return message.parts.filter(
    (part) => typeof part.type === "string" && part.type.startsWith("tool-")
  )
}

function getRunningTool(message: UIMessage) {
  return getToolParts(message).find((part) => {
    {
      if (!("state" in part)) return false
      return (
        part.state === "input-streaming" || part.state === "input-available"
      )
    }
  })
}

export function MessageAnimated({
  message,
  scrollAnchor = false,
  className,
  ...props
}: MessageAnimatedProps) {
  const isUser = message.role === "user"
  const text = getMessageText(message)
  const runningTool = !isUser ? getRunningTool(message) : undefined

  const toolName = runningTool?.type.replace(/^tool-/, "")

  return (
    <MessageScrollerItem
      scrollAnchor={scrollAnchor}
      className={className}
      {...props}
    >
      <Message align={isUser ? "end" : "start"}>
        <MessageContent>
          {runningTool && (
            <Marker role="status">
              <MarkerIcon>
                <Spinner />
              </MarkerIcon>

              <MarkerContent className="flex items-center gap-2">
                <WrenchIcon className="size-3" />
                Running <strong>{toolName}</strong>...
              </MarkerContent>
            </Marker>
          )}
          {getToolParts(message).map((tool: any, index: number) => (
            <Marker key={tool.toolCallId || `${tool.type}-${index}`}>
              <MarkerIcon>
                <WrenchIcon className="size-3" />
              </MarkerIcon>
              <MarkerContent className="flex items-center gap-2">
                Running <strong>{tool.type.replace(/^tool-/, "")}</strong>...
                {"state" in tool && <>({tool.state})</>}
              </MarkerContent>
            </Marker>
          ))}

          {isUser ? (
            <Bubble>
              <BubbleContent>{text}</BubbleContent>
            </Bubble>
          ) : text ? (
            <MemoizedMarkdown
              key={`${message.id}-text`}
              id={message.id}
              content={text}
            />
          ) : null}
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  )
}
