apper.serve(async (req)=>{
  try {
    const TABLE_NAME = 'contacts_c';
    const params = {
    "records": [
        {
            "Name": "Travis",
            "name_c": "Travis",
            "email_c": "travis@test.com",
            "phone_c": "4632145562",
            "company_c": "testing"
        }
    ]
}
   
   const response = await apperClient.createRecord(TABLE_NAME, params);
   console.log('create record response::', response)
      return new Response(JSON.stringify({
        success: true,
        message: 'Record created.',
        response: response,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
  }
    catch (error) {
    console.error('Edge function error:', error.message);
    return new Response(JSON.stringify({
      success: false,
      message: `Record creation failed: ${error.message}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});


