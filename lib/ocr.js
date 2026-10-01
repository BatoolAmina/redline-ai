export async function extractWithConfiguredOcr(buffer) {
  const endpoint = process.env.OCR_ENDPOINT;
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/pdf" },
    body: buffer,
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) {
    const error = new Error("The configured OCR service could not process this PDF.");
    error.code = "OCR_FAILED";
    error.status = 502;
    throw error;
  }

  const result = await response.json();
  if (!Array.isArray(result.pages)) {
    const error = new Error("The configured OCR service returned an invalid page payload.");
    error.code = "OCR_INVALID_RESPONSE";
    error.status = 502;
    throw error;
  }
  return {
    text: result.pages.map((page) => page.text || "").join("\n\n"),
    pages: result.pages.map((page, index) => ({
      pageNumber: page.pageNumber || index + 1,
      text: page.text || "",
      width: page.width,
      height: page.height,
      blocks: Array.isArray(page.blocks) ? page.blocks : [],
    })),
    pageCount: result.pages.length,
  };
}
