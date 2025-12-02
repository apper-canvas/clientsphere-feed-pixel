import apper from 'https://cdn.apper.io/actions/apper-actions.js';

// --- UTILITY FUNCTION TO FETCH AND CONVERT (Keep for completeness, though not used in the final logic) ---
/**
 * Fetches a public URL and converts the response body into a Base64 Data URL string.
 * ... (omitted for brevity)
 */
async function fetchFileAsBase64DataUri2(url, mimeType) { /* ... */ }
async function fetchFileAsBase64DataUri(url, mimeType) { /* ... */ }

// ---------------------------------------------

apper.serve(async (req) => {

 try {
  // --- DYNAMIC DATA SETUP ---
   // const pdfUrl = 'https://ash-speed.hetzner.com/100MB.bin';
   //  const pdfUrl = 'https://cartographicperspectives.org/index.php/journal/article/view/cp43-complete-issue/pdf';
  //  const pdfUrl ='http://ipv4.download.thinkbroadband.com/100MB.zip'
   //  const pdfUrl = 'https://drive.google.com/file/d/15JxC3fFbUd9GGXaDePsbljKwaPCKB3rX/view?usp=sharing'
   //const pdfUrl = 'http://speedtest.tele2.net/200MB.zip';
   // const pdfUrl = 'https://link.testfile.org/iK7sKT';
   //  const pdfUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4';
   const pdfUrl = 'https://pdfobject.com/pdf/sample.pdf'
  // const contentType = 'application/octet-stream'; // These are not needed for uploadFileFromUrl's basic call
   // const filename = 'hetzner-100MB.bin';
  // const purpose = 'RecordAttachment';
  // -------------------------

  // 1. Start the timer
  const startTime = performance.now(); // Use performance.now() for high-resolution timing

  // 2. Execute the upload function
  const result = await apperClient.storage.uploadFileFromUrl(
   pdfUrl,
   null,
   (progress) => console.log(`Progress: ${progress.toFixed(1)}%`)
  );

  // 3. Stop the timer
  const endTime = performance.now();
  
  // 4. Calculate the elapsed time
  const elapsedTimeMs = endTime - startTime;
  const elapsedTimeSeconds = (elapsedTimeMs / 1000).toFixed(2);

  console.log('result::', result);
  console.log(`uploadFileFromUrl execution time: ${elapsedTimeMs.toFixed(2)} ms (${elapsedTimeSeconds} seconds)`);

  return new Response(JSON.stringify({
   success: true,
   message: 'File uploaded successfully from URL.',
   uploadResult: result,
   uploadTimeMs: elapsedTimeMs.toFixed(2) // Include the time in the final response
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