import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbeddings } from "../utils/embeddings";
import { convertToAscii } from "@/lib/utils";

// SEC-006 FIX: Validate fileKey format to prevent SSRF
function validateFileKey(fileKey: string): boolean {
  // FileKey should match the pattern from s3.ts: "uploads/[timestamp]-[filename]"
  // or "uploads/[timestamp][filename]" (with space replaced by -)
  const fileKeyPattern = /^uploads\/\d+-[\w\-\.]+$/;
  
  if (!fileKeyPattern.test(fileKey)) {
    console.error("Invalid fileKey format:", fileKey);
    return false;
  }
  
  // Additional checks: prevent path traversal
  if (fileKey.includes("..") || fileKey.includes("//")) {
    console.error("Potential path traversal in fileKey:", fileKey);
    return false;
  }
  
  // Ensure fileKey doesn't try to access other namespaces
  if (fileKey.length > 200) {
    console.error("FileKey too long:", fileKey);
    return false;
  }
  
  return true;
}

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    // SEC-006 FIX: Validate fileKey before using it
    if (!validateFileKey(fileKey)) {
      throw new Error("Invalid fileKey format - potential security risk");
    }
    
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("interview-prep");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

//we need to get the namespace, so we dont fetch the information from other pdf
export async function getContext(query: string, fileKey: string) {
  // SEC-006 FIX: Validate fileKey before processing
  if (!validateFileKey(fileKey)) {
    throw new Error("Invalid fileKey format - potential security risk");
  }
  
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.4
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // 5 vectors
  return docs.join("\n").substring(0, 3000);
}
