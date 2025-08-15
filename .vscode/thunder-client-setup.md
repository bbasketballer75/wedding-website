# Thunder Client Setup for Wedding Website

## Quick Start

1. **Open Thunder Client**:
   - Press `Ctrl+Shift+P` → Type "Thunder Client"
   - Or click the Thunder Client icon in the sidebar
   - Or use `Ctrl+Shift+R` to open requests

2. **Import Collection**: Use the pre-configured collection below

## API Endpoints for Testing

### Local Development (http://localhost:5000/api)

```json
{
  "clientName": "Wedding Website - Local",
  "collectionName": "Wedding API - Local",
  "requests": [
    {
      "name": "Health Check",
      "method": "GET",
      "url": "http://localhost:5000/api/health"
    },
    {
      "name": "Get Guestbook Entries",
      "method": "GET",
      "url": "http://localhost:5000/api/guestbook"
    },
    {
      "name": "Submit Guestbook Entry",
      "method": "POST",
      "url": "http://localhost:5000/api/guestbook",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "type": "json",
        "raw": "{\n  \"name\": \"Test User\",\n  \"message\": \"Test message from Thunder Client\"\n}"
      }
    },
    {
      "name": "Get Photo Albums",
      "method": "GET",
      "url": "http://localhost:5000/api/album"
    },
    {
      "name": "Upload Photo (Admin)",
      "method": "POST",
      "url": "http://localhost:5000/api/upload",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ADMIN_KEY}}"
        }
      ]
    },
    {
      "name": "Admin - Approve Guestbook Entry",
      "method": "PUT",
      "url": "http://localhost:5000/api/guestbook/{{entryId}}/approve",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ADMIN_KEY}}"
        }
      ]
    }
  ]
}
```

### Production (https://www.theporadas.com/api)

```json
{
  "clientName": "Wedding Website - Production",
  "collectionName": "Wedding API - Production",
  "requests": [
    {
      "name": "Health Check",
      "method": "GET",
      "url": "https://www.theporadas.com/api/health"
    },
    {
      "name": "Get Guestbook Entries",
      "method": "GET",
      "url": "https://www.theporadas.com/api/guestbook"
    },
    {
      "name": "Submit Guestbook Entry",
      "method": "POST",
      "url": "https://www.theporadas.com/api/guestbook",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "type": "json",
        "raw": "{\n  \"name\": \"Test User\",\n  \"message\": \"Test message from Thunder Client\"\n}"
      }
    },
    {
      "name": "Get Photo Albums",
      "method": "GET",
      "url": "https://www.theporadas.com/api/album"
    }
  ]
}
```

## Environment Variables

1. **Create Environment**: Thunder Client → Environments → New Environment
2. **Add Variables**:
   ```json
   {
     "ADMIN_KEY": "your-admin-key-here",
     "LOCAL_API": "http://localhost:5000/api",
     "PROD_API": "https://www.theporadas.com/api"
   }
   ```

## Testing Workflow

### 1. **Local Development Testing**

```bash
# Start backend server
cd backend && npm start

# Test endpoints in Thunder Client
```

### 2. **API Testing Checklist**

- [ ] Health check returns 200 OK
- [ ] Guestbook GET returns array
- [ ] Guestbook POST creates entry (check approval status)
- [ ] Album GET returns photos
- [ ] Admin endpoints require authentication
- [ ] Error handling works (400, 401, 500)

### 3. **Common Test Scenarios**

#### Valid Guestbook Submission

```json
{
  "name": "John Doe",
  "message": "Congratulations on your wedding!"
}
```

#### Invalid Guestbook Submission (Missing name)

```json
{
  "message": "This should fail validation"
}
```

#### Admin Authentication Test

```http
Authorization: Bearer invalid-key
```

## Thunder Client Features

### 1. **Collections**: Organize related requests

### 2. **Environments**: Switch between local/production

### 3. **Variables**: Use `{{variableName}}` in requests

### 4. **Pre/Post Scripts**: Add JavaScript for advanced testing

### 5. **Tests**: Add assertions to validate responses

## Example Test Script

Add this to a request's "Tests" tab:

```javascript
// Test response status
tc.test('Status is 200', () => {
  tc.expect(tc.response.status).to.equal(200);
});

// Test response structure
tc.test('Response has required fields', () => {
  const json = tc.response.json;
  tc.expect(json).to.have.property('success');
  tc.expect(json.success).to.be.true;
});

// Test guestbook entry
tc.test('Guestbook entry created', () => {
  const json = tc.response.json;
  tc.expect(json.data).to.have.property('id');
  tc.expect(json.data.approved).to.be.false; // New entries need approval
});
```

## Keyboard Shortcuts

- `Ctrl+Shift+R`: Open Thunder Client
- `Ctrl+Enter`: Send request
- `Ctrl+S`: Save request
- `Ctrl+D`: Duplicate request

## Integration with Your Workflow

1. **During Development**: Test API endpoints as you build them
2. **Before Deployment**: Run full test suite against local server
3. **After Deployment**: Verify production endpoints work
4. **Debugging**: Use Thunder Client to isolate API issues

## Pro Tips

1. **Use Variables**: Replace hardcoded values with `{{variables}}`
2. **Save Collections**: Export collections for team sharing
3. **Environment Switching**: Use different environments for local/staging/prod
4. **Request History**: Thunder Client saves all requests automatically
5. **Response Inspection**: Use the response viewer to examine headers, body, etc.
