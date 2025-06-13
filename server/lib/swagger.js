import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { models } from "../../configs/server.js";

/**
 * Dynamically generate Swagger documentation for all routes
 * @param {Object} app - Express application
 */
export const setupSwagger = (app) => {
  const allModels = Object.keys(models).filter(
    (model) => model?.toLowerCase() !== "sequelize"
  );

  // Add CORS middleware specifically for Swagger routes to ensure credentials work
  app.use("/api-docs", (req, res, next) => {
    // Enable CORS specifically for Swagger UI
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    // For preflight requests
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    next();
  });

  // Generate model definitions dynamically
  const modelDefinitions = {};
  const modelPaths = {};

  for (const model of allModels) {
    try {
      // Create model schema based on Sequelize model attributes
      const modelInstance = models[model];
      if (!modelInstance || !modelInstance.rawAttributes) continue;

      const attributes = modelInstance.rawAttributes;
      const properties = {};

      for (const [key, attr] of Object.entries(attributes)) {
        const type = mapSequelizeTypeToSwagger(
          attr.type.key || attr.type.constructor.key
        );
        properties[key] = {
          type,
          example: getExampleForType(type),
          description: attr.comment || `The ${key} field`,
        };
      }

      // Add model schema to definitions
      modelDefinitions[model] = {
        type: "object",
        properties,
      };

      // Generate paths for each model
      modelPaths[`/${model}`] = {
        get: {
          tags: [model],
          summary: `Get all ${model} records`,
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: {
                        type: "string",
                        example: `Successfully fetched ${model}`,
                      },
                      data: {
                        type: "array",
                        items: { $ref: `#/components/schemas/${model}` },
                      },
                    },
                  },
                },
              },
            },
            500: { description: "Server Error" },
          },
        },
        post: {
          tags: [model],
          summary: `Create a new ${model} record`,
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: `#/components/schemas/${model}` },
              },
            },
          },
          responses: {
            201: {
              description: "Created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 201 },
                      message: {
                        type: "string",
                        example: `Successfully created ${model}`,
                      },
                      data: { $ref: `#/components/schemas/${model}` },
                    },
                  },
                },
              },
            },
            400: { description: "Bad Request" },
            500: { description: "Server Error" },
          },
        },
      };

      modelPaths[`/${model}/{id}`] = {
        get: {
          tags: [model],
          summary: `Get ${model} by ID`,
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: `ID of the ${model} to retrieve`,
            },
          ],
          responses: {
            200: {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: {
                        type: "string",
                        example: `Successfully fetched ${model}`,
                      },
                      data: { $ref: `#/components/schemas/${model}` },
                    },
                  },
                },
              },
            },
            404: { description: "Not Found" },
            500: { description: "Server Error" },
          },
        },
        put: {
          tags: [model],
          summary: `Update ${model} by ID`,
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: `ID of the ${model} to update`,
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: `#/components/schemas/${model}` },
              },
            },
          },
          responses: {
            200: {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: {
                        type: "string",
                        example: `Successfully updated ${model}`,
                      },
                      data: { $ref: `#/components/schemas/${model}` },
                    },
                  },
                },
              },
            },
            404: { description: "Not Found" },
            400: { description: "Bad Request" },
            500: { description: "Server Error" },
          },
        },
        delete: {
          tags: [model],
          summary: `Delete ${model} by ID`,
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: `ID of the ${model} to delete`,
            },
          ],
          responses: {
            200: {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: {
                        type: "string",
                        example: `Successfully deleted ${model}`,
                      },
                      data: { type: "object" },
                    },
                  },
                },
              },
            },
            404: { description: "Not Found" },
            500: { description: "Server Error" },
          },
        },
      };
    } catch (error) {
      console.error(`Error generating Swagger docs for model ${model}:`, error);
    }
  }

  // Find custom route files to document any non-dynamic routes
  const routeDirectories = ["server/core", "src/modules"];
  const customPaths = {};

  // Define Swagger options
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "NeoX.js API Documentation",
        version: "1.0.0",
        description: "Automatically generated API documentation for NeoX.js",
        contact: {
          name: "API Support",
          url: "https://github.com/Pushkarcdn/neoX.js",
        },
      },
      servers: [
        {
          url: "/api",
          description: "API Server",
        },
      ],
      components: {
        schemas: modelDefinitions,
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      paths: { ...modelPaths, ...customPaths },
    },
    apis: [], // We're generating paths dynamically instead
    security: [{ bearerAuth: [] }],
  };

  const swaggerSpec = swaggerJsDoc(swaggerOptions);

  // Add custom CSS to improve token input handling
  const customCss = `
    .swagger-ui .auth-wrapper .authorize {
      margin-right: 10px;
      padding: 5px 10px;
    }
    .swagger-ui .auth-container input {
      min-width: 230px;
    }
  `;

  // Custom JavaScript to handle authentication properly
  const customJs = `
    (function() {
      // Storage key for the auth token
      const TOKEN_STORAGE_KEY = 'swagger_ui_token';
      
      // Get token from storage
      function getToken() {
        return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
      }
      
      // Save token to storage
      function saveToken(token) {
        if (token && token.trim()) {
          localStorage.setItem(TOKEN_STORAGE_KEY, token);
          console.log('Token saved to local storage');
          return true;
        }
        return false;
      }
      
      // Wait for Swagger UI to be fully loaded
      window.addEventListener('load', function() {
        console.log('Swagger UI loaded - initializing auth handlers');
        
        // This runs after Swagger UI is fully initialized
        setTimeout(function() {
          // Hook into the Authorize button actions
          const authorizeBtn = document.querySelector('.auth-wrapper .authorize');
          if (authorizeBtn) {
            // Check if we already have a token and update the UI accordingly
            if (getToken()) {
              authorizeBtn.classList.add('authorized');
            }
            
            const originalClick = authorizeBtn.onclick;
            authorizeBtn.onclick = function(e) {
              if (originalClick) originalClick.call(this, e);
              
              // Add listeners after the modal is shown
              setTimeout(function() {
                const authBtn = document.querySelector('.auth-btn-wrapper .btn-done');
                if (authBtn) {
                  authBtn.addEventListener('click', function() {
                    // Get token value from input
                    const tokenInput = document.querySelector('.auth-container input');
                    if (tokenInput) {
                      saveToken(tokenInput.value);
                    }
                  });
                }
              }, 100);
            };
          }

          // Enhance all API requests to include authorization
          const originalFetch = window.fetch;
          window.fetch = function() {
            const args = Array.prototype.slice.call(arguments);
            
            // First arg is the URL, second is the options object
            if (!args[1]) args[1] = {};
            
            // Ensure headers exist
            if (!args[1].headers) {
              args[1].headers = {};
            }
            
            // Use token from storage
            const token = getToken();
            if (token) {
              args[1].headers['Authorization'] = 'Bearer ' + token;
            }
            
            return originalFetch.apply(this, args);
          };

          // Patch XMLHttpRequest
          const originalOpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function() {
            const xhrArgs = Array.prototype.slice.call(arguments);
            
            // Apply token when request is opened
            this.addEventListener('readystatechange', function() {
              if (this.readyState === 1) { // OPENED
                const token = getToken();
                if (token) {
                  this.setRequestHeader('Authorization', 'Bearer ' + token);
                }
              }
            });
            
            // Call original open
            originalOpen.apply(this, xhrArgs);
          };
          
          // Update UI to show authorized state if we have a token
          if (getToken()) {
            const authorizeBtn = document.querySelector('.auth-wrapper .authorize');
            if (authorizeBtn) {
              authorizeBtn.classList.add('authorized');
              console.log('Auth state updated in UI with saved token');
            }
          }
          
          console.log('Auth handlers initialized for Swagger UI');
        }, 1000);
      });
    })();
  `;

  // Setup Swagger UI with authentication
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true,
        requestInterceptor: (req) => {
          // Server-side we don't have access to the user's localStorage
          // The client-side JavaScript will handle adding the token
          return req;
        },
        responseInterceptor: (res) => {
          // Log if there were issues with the request
          if (res.status >= 400) {
            console.log("API request failed:", res.url, res.status);
          }
          return res;
        },
      },
      customCss,
      customJs,
    })
  );

  // Route to get the Swagger JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.info("[Swagger]: Documentation available at /api-docs");
};

/**
 * Map Sequelize data types to Swagger data types
 * @param {string} sequelizeType - Sequelize data type
 * @returns {string} - Swagger data type
 */
function mapSequelizeTypeToSwagger(sequelizeType) {
  const typeMap = {
    STRING: "string",
    TEXT: "string",
    UUID: "string",
    UUIDV4: "string",
    UUIDV1: "string",
    INTEGER: "integer",
    BIGINT: "integer",
    FLOAT: "number",
    DOUBLE: "number",
    REAL: "number",
    DECIMAL: "number",
    BOOLEAN: "boolean",
    DATE: "string",
    DATEONLY: "string",
    TIME: "string",
    JSON: "object",
    JSONB: "object",
    ARRAY: "array",
    ENUM: "string",
    BLOB: "string",
    CITEXT: "string",
  };

  return typeMap[sequelizeType] || "string";
}

/**
 * Generate example value based on data type
 * @param {string} type - Swagger data type
 * @returns {*} - Example value
 */
function getExampleForType(type) {
  switch (type) {
    case "string":
      return "example";
    case "integer":
      return 1;
    case "number":
      return 1.0;
    case "boolean":
      return true;
    case "object":
      return {};
    case "array":
      return [];
    default:
      return "example";
  }
}
