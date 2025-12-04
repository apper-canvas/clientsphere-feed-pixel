apper.serve(async (req)=>{
 
   const TABLE_NAME = 'contacts_c';
   const params = {
     "records": [
       {
         "Name": "Danny1",
         "name_c": "Danny1",
         "email_c": "danny@test.com",
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
  console.log('create record response::', response);

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive'
    }
  });
});