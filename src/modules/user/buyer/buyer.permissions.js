export default [
  {
    methods: ["GET", "POST"],
    route: "/api/faq",
  },
  {
    methods: ["GET", "PUT", "DELETE"],
    route: "/api/faq/:id",
  },
  {
    methods: ["GET"],
    route: "/api/refresh",
  },
];
