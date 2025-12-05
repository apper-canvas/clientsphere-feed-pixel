import apper from 'https://cdn.apper.io/actions/apper-actions.js';


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
   const pdfUrl = 'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf';
  const contentType = 'application/pdf'; // These are not needed for uploadFileFromUrl's basic call
   const filename = 'sample-pdf.pdf';
  const purpose = 'RecordAttachment';
  // -------------------------

  // 1. Start the timer
  const startTime = performance.now(); // Use performance.now() for high-resolution timing

  // 2. Execute the upload function
  const result = await apperClient.storage.uploadFileFromUrl(
   pdfUrl,
    //  null,
    {
      filename: filename,
      contentType: contentType, 
      purpose: purpose
    },
   (progress) => console.log(`Progress: ${progress.toFixed(1)}%`)
  );
   console.log('result::', result);

   const TABLE_NAME = 'contacts_c';
   const params = {
     "records": [
       {
         "Name": "Cena",
         "name_c": "Cena",
         "email_c": "cena@test.com",
         "phone_c": "12346793",
         "title_c": "Sales",
         "company_c": "testing",
         "notes_c": "testing",
         "file_c": [
           {
             "Name": result.data.fileName,
             "Path": result.data.key,
             "Size": result.data.fileSizeKB,
             "Type": result.data.contentType,
             "IsExternal": false,
             "Ordinal": 1
           }
         ]
       }
     ]
   }
   
   const response = await apperClient.createRecord(TABLE_NAME, params);
   console.log('create record response::', response)

  // 3. Stop the timer
  const endTime = performance.now();
  
  // 4. Calculate the elapsed time
  const elapsedTimeMs = endTime - startTime;
  const elapsedTimeSeconds = (elapsedTimeMs / 1000).toFixed(2);

   console.log(`uploadFileFromUrl execution time: ${elapsedTimeMs.toFixed(2)} ms (${elapsedTimeSeconds} seconds)`);
   const recordId = response.results[0].data.Id;
   const attachmentId = response.results[0].data.file_c[0].Id;
   const tableName = 'contacts_c';
   const downloadResult = await apperClient.storage.downloadFile({
      tableName,
      recordId,
      attachmentId
    });
  //  const downloadResult = await apperClient.storage.previewFile({
  //    tableName,
  //    recordId,
  //    attachmentId
  //  });
  

  return new Response(JSON.stringify({
   success: true,
   message: 'File uploaded successfully from URL.',
   uploadResult: result,
    uploadTimeMs: elapsedTimeMs.toFixed(2), // Include the time in the final response
    createResponse: response,
    downloadResult: downloadResult
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