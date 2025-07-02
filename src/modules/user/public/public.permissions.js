export default [
  {
    methods: ["GET"],
    route: "/",
  },
  {
    methods: ["GET"],
    route: "/favicon.ico",
  },
  {
    methods: ["GET"],
    route: "/api-docs",
  },
  {
    methods: ["GET"],
    route: "/api-docs/*",
  },
  {
    methods: ["GET"],
    route: "/api-docs.json",
  },
  {
    methods: ["GET"],
    route: "/api/reset-superadmin",
  },
  {
    methods: ["POST"],
    route: "/api/signup/:userType",
  },
  {
    methods: ["GET"],
    route: "/api/verify-email/:token",
  },
  {
    methods: ["GET"],
    route: "/api/resend-verification-email/:userType/:email",
  },
  {
    methods: ["POST"],
    route: "/api/signin/:userType",
  },
  {
    methods: ["GET"],
    route: "/api/signout",
  },
  {
    methods: ["GET"],
    route: "/api/auth/google/:userType",
  },
  {
    methods: ["GET"],
    route: "/api/auth/google/callback",
  },
];
