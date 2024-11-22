// https://zenn.dev/chot/articles/lz-string-vs-compression-stream
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const createUpstream = (value: unknown) => {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(value);
      controller.close();
    },
  });
};

export async function compressToBase64(input: string): Promise<string> {
  const upstream = createUpstream(textEncoder.encode(input));
  const compression = new CompressionStream("deflate");
  const stream = upstream.pipeThrough(compression);
  const compressed = await new Response(stream).arrayBuffer();
  return btoa(String.fromCharCode(...new Uint8Array(compressed)));
}
export async function decompressFromBase64(input: string): Promise<string> {
  const compressedBytes = Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
  const upstream = createUpstream(compressedBytes);
  const decompression = new DecompressionStream("deflate");
  const stream = upstream.pipeThrough(decompression);
  const decompressed = await new Response(stream).arrayBuffer();
  return textDecoder.decode(decompressed);
}
