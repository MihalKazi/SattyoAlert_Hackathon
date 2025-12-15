import { pipeline } from '@xenova/transformers';

let extractor;

export async function getFreeVector(text) {
  // Load the free AI model (only happens once)
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  // Generate the numbers (embedding)
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}