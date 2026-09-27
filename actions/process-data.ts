"use server"

import { EmbeddingDocumentSchema, embeddingDocumentTable, EmbeddingDocumentType } from "@/schema/tables/embedding-document";
import { scrapeWebpages } from "./scrape-webpage";
import { generateEmbeddings } from "@/lib/embeddings";
import db from "@/connector/db.drizzle"

export async function processData() {
    try {
        console.log('Processing data starts...');
        const chunks: EmbeddingDocumentType['create'][] = [];
        // scrapping from the URL
        await scrapeWebpages().then(data => chunks.push(...data));

        const embeddings = await generateEmbeddings(chunks.map((chunk) => chunk.text))
        const records: EmbeddingDocumentType['create'][] = chunks.map((chunk, index) => EmbeddingDocumentSchema.create.parse({
                  text: chunk.text,
      sourceType: chunk.sourceType,
      source: chunk.source,
      chunkIndex: chunk.chunkIndex,
      hash: chunk.hash,
      metaData: chunk?.metaData,
            embedding: embeddings[index]
        }));
        console.log(`Total data records:`,{records});
        
        await db.insert(embeddingDocumentTable).values(records)


        return records;
    } catch (error) {
        console.error('Error processing data:', error);
        return [];
    }
}