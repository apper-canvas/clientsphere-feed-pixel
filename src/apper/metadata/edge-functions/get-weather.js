import apper from 'https://cdn.apper.io/actions/apper-actions.js';

// --- UTILITY FUNCTION TO FETCH AND CONVERT ---
/**
 * Fetches a public URL and converts the response body into a Base64 Data URL string.
 * This is suitable for edge function environments that support 'fetch' and 'btoa'.
 * @param {string} url The public URL of the file.
 * @param {string} mimeType The MIME type of the file (e.g., 'application/pdf').
 * @returns {Promise<string>} A promise that resolves to the Base64 Data URL string.
 */
async function fetchFileAsBase64DataUri2(url, mimeType) {
    try {
        console.log(`Fetching file from: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 1. Get the content as an ArrayBuffer (binary data)
        const arrayBuffer = await response.arrayBuffer();

        // 2. Convert the ArrayBuffer to a "binary string"
        // This process handles the raw bytes for btoa() encoding.
        const base64String = btoa(
            new Uint8Array(arrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        // 3. Return the complete Data URL
        return `data:${mimeType};base64,${base64String}`;

    } catch (error) {
        console.error('Error fetching or converting file:', error);
        throw new Error(`Failed to process file URL: ${error.message}`);
    }
}
async function fetchFileAsBase64DataUri(url, mimeType) {
  try {
    console.log(`Streaming file from: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // For Node.js/Bun - stream and convert in chunks
    if (typeof Buffer !== 'undefined' && response.body) {
      const reader = response.body.getReader();
      const chunks = [];
      let totalSize = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        totalSize += value.length;
        
        // Log progress
        console.log(`Downloaded: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      }
      
      // Combine all chunks
      const allChunks = new Uint8Array(totalSize);
      let position = 0;
      for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
      }
      
      const base64String = Buffer.from(allChunks).toString('base64');
      return `data:${mimeType};base64,${base64String}`;
    }
    
    // Fallback for other environments
    const arrayBuffer = await response.arrayBuffer();
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );
    return `data:${mimeType};base64,${base64String}`;
    
  } catch (error) {
    console.error('Error streaming file:', error);
    throw new Error(`Failed to stream file: ${error.message}`);
  }
}

// ---------------------------------------------

apper.serve(async (req) => {
  const apperClient = req.apperClient; // Assuming apperClient is available here

  try {
    // --- DYNAMIC DATA SETUP ---
    const pdfUrl = 'https://www.fws.gov/sites/default/files/documents/16w_Appendix_Entire_Document%2810351KB%29.pdf'; // Example public PDF
    const contentType = 'application/pdf';
    const filename = 'document_from_url.pdf';
    const purpose = 'RecordAttachment';
    // -------------------------

    // 1. Fetch the file and convert it to the Base64 Data URL format
    const base64DataUri = await fetchFileAsBase64DataUri(pdfUrl, contentType);
    
    // 2. The base64DataUri now contains the full string, e.g., 'data:application/pdf;base64,JVBERi0xLjc...'
    console.log('base64DataUri successfully generated (length: ' + base64DataUri.length + ')');
    
    // Upload file using apperClient
    const result = await apperClient.storage.uploadFile(
      base64DataUri,
      {
        filename: filename,
        purpose: purpose,
        contentType: contentType
      },
      (progress) => console.log(`Progress: ${progress.toFixed(1)}%`)
    );

    console.log('result::', result);

    return new Response(JSON.stringify({
      success: true,
      message: 'File uploaded successfully from URL.',
      uploadResult: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Edge function error:', error.message);
    return new Response(JSON.stringify({
      success: false,
      message: `File upload failed: ${error.message}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});