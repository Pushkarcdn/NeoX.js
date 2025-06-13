import fs from "fs";
import path from "path";

const isUserAllowed = async (route, method, userType) => {
  if (userType === "superAdmin") return true;

  const permissionsPath = path.resolve(
    `src/modules/user/${userType}/${userType}.permissions.js`
  );

  if (!fs.existsSync(permissionsPath)) {
    console.error(`Permissions are not specified for user type: ${userType}.`);
    return false;
  }

  const allowedRoutes = (await import(permissionsPath))?.default;

  if (!allowedRoutes) return false;

  // Check if the route and method match
  const isMatch = allowedRoutes.some((item) => {
    const normalizedMethods = item.methods.map((method) =>
      method.toUpperCase()
    );

    // Convert dynamic route patterns like `/api/testimonials/:id` into a regex
    const routePattern = new RegExp(
      `^${item.route.replace(/:\w+/g, "[^/]+")}$`,
      "i" // Case-insensitive
    );

    return (
      routePattern.test(route) && // Check if the route matches the pattern
      normalizedMethods.includes(method.toUpperCase()) // Check if the method is allowed
    );
  });

  if (!isMatch) {
    console.error(
      route,
      method,
      userType,
      "User is not authorized to access this resource."
    );
  }
  return isMatch;
};

export { isUserAllowed };
