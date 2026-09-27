import * as drz from "drizzle-orm/zod"
import { sql } from "drizzle-orm";
import {text,json , pgEnum, pgTable,serial, vector, timestamp, index } from "drizzle-orm/pg-core";
import z from "zod";

const embeddingDocumentFaqSchema = z.object({
    question: z.string(),
    answer: z.string(),
    topic: z.string()
}).default({
    question: "",
    answer: "",
    topic: ""
});


export const allowedSourceType = pgEnum('source_type',["url", "docs","pdf","text",'json']);

export const embeddingDocumentTable = pgTable('embedding_document',{
    id: serial('id').primaryKey(),
    chunkIndex: serial('chunk_index').notNull(),
    source: text("source").notNull(),
    sourceType: allowedSourceType("source_type").notNull(),
    text: text("text").notNull(),
    metaData:json('meta_data').$type<z.infer<typeof embeddingDocumentFaqSchema>>().default(embeddingDocumentFaqSchema.def.defaultValue),
    embedding:vector("embedding",{dimensions: 1536}),
    hash: text("hash").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
},(table)=>[
   index('embedding_document_idx').using('hnsw',table.embedding.op('vector_cosine_ops')) ,
   index("embedding_document_text_search_idx").using(
      "gin",
      sql`to_tsvector('simple', ${table.text})`
    ),
])

export const EmbeddingDocumentSchema = {
    create:drz.createInsertSchema(embeddingDocumentTable,{metaData: embeddingDocumentFaqSchema.optional()}),
    select: drz.createSelectSchema(embeddingDocumentTable)
}


export type EmbeddingDocumentType = {
  create: z.infer<typeof EmbeddingDocumentSchema.create>
  select: typeof embeddingDocumentTable.$inferSelect
}



