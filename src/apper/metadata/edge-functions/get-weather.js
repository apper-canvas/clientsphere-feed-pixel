import apper from 'https://cdn.apper.io/actions/apper-actions.js';


// ---------------------------------------------

apper.serve(async (req) => {

 try {

   const TABLE_NAME = 'contacts_c';
   const params = {
     "records": [
       {
         "Name": "Ash1",
         "name_c": "Ash1",
         "email_c": "ash@test.com",
         "phone_c": "12346793",
         "title_c": "Sales",
         "company_c": "testing",
         "notes_c": "testing",
        //  "file_c": [
        //    {
        //      "Name": result.data.fileName,
        //      "Path": result.data.location,
        //      "Size": result.data.fileSizeKB,
        //      "Type": result.data.contentType,
        //      "IsExternal": false,
        //      "Ordinal": 1
        //    }
        //  ]
       }
     ]
   }
   
   const response = await apperClient.createRecord(TABLE_NAME, params);
   console.log('create record response::', response)

  

  return new Response(JSON.stringify({
   success: true,
   message: 'Contact created.',
   response: response,
  }), {
   status: 200,
   headers: { 'Content-Type': 'application/json' }
  });


 } catch (error) {
  console.error('Edge function error:', error.message);
  return new Response(JSON.stringify({
   success: false,
   message: `Contact creation failed: ${error.message}`
  }), {
   status: 500,
   headers: { 'Content-Type': 'application/json' }
  });
 }
});