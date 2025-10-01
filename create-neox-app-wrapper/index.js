#!/usr/bin/env node

/**
 * create-neox-app wrapper
 *
 * This is a lightweight wrapper that delegates to the main neox.js package.
 * It allows users to run both:
 * - npx create-neox-app
 * - npx neox.js
 */

// Simply require and execute the main neox.js CLI
require("neox.js");
