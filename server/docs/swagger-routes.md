# Swagger Documentation for Custom Routes

This document explains how to add Swagger documentation to your custom routes in NeoX.js.

## Overview

NeoX.js automatically generates API documentation for:

1. All model CRUD operations (GET, POST, PUT, DELETE)
2. Custom routes defined in `.route.js` files

## How to Document Your Custom Routes

### Step 1: Create a route file with the `.route.js` extension

Place your route file in one of these directories or their subdirectories:

- `server/core/`
- `src/modules/`

### Step 2: Add JSDoc comments with Swagger annotations

Use the `@swagger` annotation in your JSDoc comments to document your routes. Here's an example:

```javascript
/**
 * @swagger
 * /your-prefix/your-endpoint:
 *   get:
 *     tags:
 *       - YourTag
 *     summary: Short description of what the endpoint does
 *     description: More detailed explanation
 *     security:
 *       - bearerAuth: []  # If the endpoint requires authentication
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *         description: Description of the parameter
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success message
 *                 data:
 *                   type: object
 */
```

### Step 3: Export your routes as a function

Your route file should export a function that takes a router parameter:

```javascript
export default (router) => {
  router.get("/your-prefix/your-endpoint", (req, res) => {
    // Your handler logic
  });

  // More routes...
};
```

## Example

See the example route file at `server/core/example.route.js` for a complete working example.

## Important Notes

1. Ensure your route path in the Swagger documentation matches the actual route path in your code.
2. Group related endpoints under the same tag for better organization in the Swagger UI.
3. Document all parameters, request bodies, and possible responses.
4. Use security schemes appropriately for authenticated endpoints.

## OpenAPI/Swagger Documentation Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger JSDoc Documentation](https://github.com/Surnet/swagger-jsdoc/blob/master/docs/GETTING-STARTED.md)
