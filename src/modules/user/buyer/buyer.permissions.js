export default [
  {
    methods: ["GET"],
    route: "/api/me",
  },
  {
    methods: ["GET", "POST"],
    route: "/api/faq",
  },
  {
    methods: ["GET", "PUT", "DELETE"],
    route: "/api/faq/:id",
  },
];
