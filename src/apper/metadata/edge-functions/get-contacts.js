import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    // Parse optional request parameters for pagination and filtering
    let params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "phone_c"}},
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "company_c"}},
        {"field": {"Name": "notes_c"}},
        {"field": {"Name": "tags_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ],
      orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    // Parse request body for custom parameters if provided
    try {
      const body = await req.text();
      if (body) {
        const requestData = JSON.parse(body);
        if (requestData.limit) {
          params.pagingInfo.limit = Math.min(requestData.limit, 500); // Max 500 records
        }
        if (requestData.offset) {
          params.pagingInfo.offset = requestData.offset;
        }
        if (requestData.searchTerm) {
          params.where = [
            {
              "FieldName": "name_c",
              "Operator": "Contains",
              "Values": [requestData.searchTerm],
              "Include": true
            }
          ];
        }
      }
    } catch (parseError) {
      // Continue with default parameters if parsing fails
      console.info('Using default parameters due to parsing error:', parseError.message);
    }

    // Fetch contacts using globally available apperClient
    const response = await apperClient.fetchRecords('contacts_c', params);

    // Handle top-level API failures
    if (!response.success) {
      console.error('Contact fetch failed:', response.message);
      
      return new Response(JSON.stringify({
        success: false,
        message: response.message || 'Failed to retrieve contacts from database'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate response data structure
    if (!response.data) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid response structure from database'
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format successful response with contact data
    const formattedResponse = {
      success: true,
      data: response.data,
      total: response.total || response.data.length,
      pageInfo: response.pageInfo || params.pagingInfo,
      message: `Successfully retrieved ${response.data.length} contact${response.data.length !== 1 ? 's' : ''}`
    };

    return new Response(JSON.stringify(formattedResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get Contacts Function Error:', error.message);
    
    // Handle different types of errors with appropriate status codes
    let statusCode = 500;
    let errorMessage = 'Unable to retrieve contacts. Please try again later.';
    
    if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
      statusCode = 401;
      errorMessage = 'Authentication required to access contact data.';
    } else if (error.message.includes('permission') || error.message.includes('access')) {
      statusCode = 403;
      errorMessage = 'Insufficient permissions to access contact data.';
    } else if (error.message.includes('network') || error.message.includes('connection')) {
      statusCode = 503;
      errorMessage = 'Database connection unavailable. Please try again later.';
    }
    
    return new Response(JSON.stringify({
      success: false,
      message: errorMessage,
      error: error.message
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});