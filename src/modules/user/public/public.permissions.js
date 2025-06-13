export default [
  {
    methods: ["GET"],
    route: "/",
  },
  {
    methods: ["GET"],
    route: "/api/test",
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
    methods: ["POST"],
    route: "/api/signin/:userType",
  },
  {
    methods: ["GET"],
    route: "/api/signout",
  },
];
