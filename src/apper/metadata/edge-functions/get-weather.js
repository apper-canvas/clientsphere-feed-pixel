import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    // Parse request body to get file data
    // const body = await req.text();

    // if (!body) {
    //   return new Response(JSON.stringify({
    //     success: false,
    //     message: 'No file data provided'
    //   }), {
    //     status: 400,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }

    // const requestData = JSON.parse(body);

    // if (!requestData.fileData) {
    //   return new Response(JSON.stringify({
    //     success: false,
    //     message: 'fileData is required'
    //   }), {
    //     status: 400,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }
    const rawBase64 = fetch('https://webhook.site/9153bab6-fc87-46ed-9490-5f347e969c05');
    console.log('rawBase64::', rawBase64)
    // Extract parameters from request
    const filename = 'singlePart_fairy1.png';
    const purpose = 'RecordAttachment';
    const contentType = 'image/png';
    console.log('apperClient::', apperClient);
    // Upload file using apperClient
    const result = await apperClient.storage.uploadFile(
      rawBase64.content,
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
      data: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload File Function Error:', error.message);

    return new Response(JSON.stringify({
      success: false,
      message: 'Unable to upload file. Please try again.',
      error: error.message, 
      keys: Object.keys(apperClient),
      rawBase64

    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});