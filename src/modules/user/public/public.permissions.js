export default [
  {
    methods: ["GET"],
    route: "/",
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
