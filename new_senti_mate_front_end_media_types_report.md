# Media Types Analysis in new_senti_mate_front_end

## Overview
This document analyzes the media types used in the `new_senti_mate_front_end` application and identifies potential issues where clients might send requests with media types not supported by the server.

## Summary of Findings
After a thorough examination of the frontend codebase, I've identified one significant issue where the frontend attempts to send requests with a media type that appears to be unsupported by the backend.

## Detailed Analysis

### Default Content Type Configuration
The frontend uses Axios for API calls, with a default configuration in `apiService.js`:

```javascript
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

This sets the default content type for all requests to `application/json`, which is standard and well-supported.

### Non-Standard Content Types

#### 1. Profile Picture Upload (Critical Issue)
**Location**: `UserService.js` (lines 74-100)

The frontend attempts to upload profile pictures using `multipart/form-data`:

```javascript
uploadProfilePicture: async (id, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/users/${id}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // ...
  } catch (error) {
    // ...
  }
}
```

**Issue**: The backend `UserController.java` does not have an endpoint to handle this request. There is no `/users/{id}/profile-picture` endpoint defined, and no configuration for handling `multipart/form-data` requests.

**Impact**: When users attempt to upload profile pictures through the Profile page (`Profile.jsx`), the requests will fail because the backend doesn't support this endpoint or content type.

### Backend Configuration Analysis

1. **Content Negotiation**: The backend's `application.properties` only explicitly configures support for `application/json`:
   ```properties
   spring.mvc.contentnegotiation.media-types.json=application/json
   ```

2. **CORS Configuration**: The `CorsFilterConfig.java` allows all headers with `config.addAllowedHeader("*")`, which means the frontend can send any header, including `Content-Type: multipart/form-data`. However, this doesn't guarantee that the backend can process these requests.

3. **Multipart Configuration**: No explicit multipart configuration was found in the backend, which is typically required for handling file uploads.

## Recommendations

1. **Implement Profile Picture Upload Endpoint**: Add a new endpoint in `UserController.java` to handle profile picture uploads:
   ```java
   @PostMapping("/{id}/profile-picture")
   public ResponseEntity<User> uploadProfilePicture(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
       try {
           User updatedUser = userService.uploadProfilePicture(id, file);
           return ResponseEntity.ok(updatedUser);
       } catch (IllegalArgumentException e) {
           return ResponseEntity.badRequest().build();
       } catch (IOException e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
   }
   ```

2. **Add Multipart Configuration**: Ensure the backend has proper configuration for handling multipart requests, either through `application.properties` or a configuration class:
   ```properties
   spring.servlet.multipart.enabled=true
   spring.servlet.multipart.max-file-size=10MB
   spring.servlet.multipart.max-request-size=10MB
   ```

3. **Implement Service Method**: Add a method in `UserService` to handle the file upload and storage.

4. **Document Supported Media Types**: Clearly document which media types are supported by each endpoint to prevent future mismatches.

## Conclusion
The primary issue identified is the profile picture upload functionality, which uses `multipart/form-data` but lacks corresponding backend support. All other API calls in the frontend use the standard `application/json` content type, which is properly supported by the backend.

Implementing the recommended changes will ensure that all media types used by the frontend are properly supported by the backend, preventing request failures and improving the user experience.
