#!/usr/bin/env node

/**
 * create-neox-app package
 *
 * This is a lightweight creator package that delegates to the main neox.js package.
 * It allows users to run both:
 * - npx create-neox-app
 * - npx neox.js
 */

// Simply require and execute the main neox.js CLI
import "neox.js";
