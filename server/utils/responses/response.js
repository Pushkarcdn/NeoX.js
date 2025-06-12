/**
 * Represents a standardized success response.
 *
 * @property {boolean} success - Indicates if the response is successful.
 * @property {number} status - HTTP status code of the response.
 * @property {array|object} data - The main data of the response.
 * @property {string} message - Response message for client readability.
 * @property {string} source - Source of the response (e.g., "Product", "User").
 * @property {object|null} pagination - Pagination information if applicable.
 */
class SuccessResponse {
  constructor() {
    this.success = true;
    this.status = null;
    this.data = [];
    this.message = "";
    this.source = "";
    this.pagination = null; // Holds pagination data if provided
  }
}

class ErrorResponse {
  constructor(status, message, source) {
    this.status = status;
    this.message = message;
    this.source = source;
  }
  success = false;
  status;
  message;
  source;
}

export { SuccessResponse, ErrorResponse };
