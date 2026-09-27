import { marked } from "marked"

import ReactMarkdown from "react-markdown"
import { memo, useMemo } from "react"

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown)
  return tokens.map((token) => token.raw)
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return <ReactMarkdown>{content}</ReactMarkdown>
  },
  (prevProps, nextProps) => prevProps.content === nextProps.content
)
MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock"

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content])
    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock key={`${id}-block${index}`} content={block} />
    ))
  }
)

MemoizedMarkdown.displayName = "MemoizedMarkdown"
