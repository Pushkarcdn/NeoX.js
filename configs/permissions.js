const unprotectedRoutes = [
  // root
  {
    methods: ["GET"],
    route: "/",
  },

  // favicon
  {
    methods: ["GET"],
    route: "/favicon.ico",
  },

  // uploads
  {
    methods: ["GET"],
    route: "/uploads/:folder/:file",
  },

  // reset superadmin
  {
    methods: ["GET"],
    route: "/api/reset-superadmin",
  },

  // manual signup
  {
    methods: ["POST"],
    route: "/api/signup/:userType",
  },

  // manual signin
  {
    methods: ["POST"],
    route: "/api/signin/:userType",
  },

  // current user
  {
    methods: ["GET"],
    route: "/api/me",
  },

  // email verification
  {
    methods: ["GET"],
    route: "/api/send-verification-email/:email",
  },
  {
    methods: ["GET"],
    route: "/api/verify-email/:token",
  },

  // signout
  {
    methods: ["GET"],
    route: "/api/signout",
  },

  // colleges
  {
    methods: ["GET"],
    route: "/api/colleges",
  },
  {
    methods: ["GET"],
    route: "/api/colleges/:slug",
  },

  // programs
  {
    methods: ["GET"],
    route: "/api/programs",
  },
  {
    methods: ["GET"],
    route: "/api/programs/:slug",
  },

  // events
  {
    methods: ["GET"],
    route: "/api/events",
  },
  {
    methods: ["GET"],
    route: "/api/events/:slug",
  },

  // blogs
  {
    methods: ["GET"],
    route: "/api/blogs",
  },
  {
    methods: ["GET"],
    route: "/api/blogs/:slug",
  },

  // faqs
  {
    methods: ["GET"],
    route: "/api/faqs",
  },

  // testimonials
  {
    methods: ["GET"],
    route: "/api/testimonials",
  },

  // job profiles
  {
    methods: ["GET"],
    route: "/api/job-profiles",
  },
  {
    methods: ["GET"],
    route: "/api/job-profiles/:slug",
  },

  // applications
  {
    methods: ["POST"],
    route: "/api/applications",
  },

  // registrations
  {
    methods: ["POST"],
    route: "/api/registrations",
  },

  // inquiry
  {
    methods: ["POST"],
    route: "/api/inquiries",
  },

  // mentors
  {
    methods: ["GET"],
    route: "/api/mentors",
  },

  // mentors
  {
    methods: ["GET"],
    route: "/api/mentor-categories",
  },

  {
    methods: ["POST"],
    route: "/api/scholarship-inquiries",
  },
];

const commonProtectedRoutes = [];

const mentorRoutes = [
  ...commonProtectedRoutes,
  {
    methods: ["PUT"],
    route: "/api/update-my-mentor-details",
  },
];

const studentRoutes = [...commonProtectedRoutes];

const adminRoutes = [
  ...commonProtectedRoutes,
  ...studentRoutes,
  ...mentorRoutes,
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/inquiries",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/inquiries/:id",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/faqs",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/faqs/:id",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/testimonials",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/testimonials/:id",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/events",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/events/:slug",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/programs",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/programs/:slug",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/blogs",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/blogs/:slug",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/job-profiles",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/job-profiles/:slug",
  },
  {
    methods: ["GET", "PUT", "DELETE"],
    route: "/api/applications",
  },
  {
    methods: ["GET", "PUT", "DELETE"],
    route: "/api/applications/:id", // application id
  },
  {
    methods: ["GET"],
    route: "/api/applications/program/:slug", // program slug
  },
  {
    methods: ["GET", "PUT", "DELETE"],
    route: "/api/registrations",
  },
  {
    methods: ["GET"],
    route: "/api/registrations/:slug", // event slug
  },
  {
    methods: ["DELETE"],
    route: "/api/registrations/:id", // registration id
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/mentors",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/mentors/:userId",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/scholarship-inquiries",
  },
  {
    methods: ["GET", "POST", "PUT", "DELETE"],
    route: "/api/scholarship-inquiries/:id",
  },
];

const allowedExtension = [];

const isUserAllowed = (route, method, role) => {
  /* 
    Temporarily allow all routes for everyone (for development purpose only)
    Specify api access acc to roles and remove this before going to prodution
  */
  // if (role) return true;

  let currentRoutes = [];

  switch (role) {
    case "mentor":
      currentRoutes = mentorRoutes;
      break;
    case "student":
      currentRoutes = studentRoutes;
      break;
    case "admin":
      currentRoutes = adminRoutes;
      break;
    case "superAdmin":
      return true; // everything allowed for superAdmin
    default:
      return false;
  }

  // Check if the route and method match
  const isMatch = currentRoutes.some((item) => {
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
      role,
      "User is not authorized to access this resource."
    );
  }
  return isMatch;
};

export { allowedExtension, unprotectedRoutes, isUserAllowed };
