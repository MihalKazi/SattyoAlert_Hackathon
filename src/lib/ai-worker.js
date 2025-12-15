const { pipeline, env } = require('@xenova/transformers');
if (typeof self === 'undefined') { global.self = global; }

async function generate(text) {
  try {
    env.allowLocalModels = false;
    env.useBrowserCache = false;
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    process.stdout.write(JSON.stringify(Array.from(output.data)));
  } catch (err) {
    process.stderr.write(err.message);
    process.exit(1);
  }
}
generate(process.argv[2]);