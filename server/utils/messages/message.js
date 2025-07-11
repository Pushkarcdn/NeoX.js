const formattedMsg = {
  errorMsg: {
    invalidBody: "Cannot process request body!",
    usernameNotAvailable: "Username is not available.Choose another username!",
    notAuthorized: "You are not authorized to access this resource!",
    notAuthenticated: "You are not authenticated to access this resource!",
    invalidCredential: "invalid Email or Password!",
    notFound: "%s not found!",
    duplicateData: "Duplicate %s found!",
    tokenExpired: "Access Token has expired!",
    invalidToken: "Invalid Token!",
    invalidOtp: "Invalid OTP!",
    permanentData: "You can't delete or update this %s!",
  },

  successMsg: {
    create: "%s created successfully!",
    fetch: "%s fetched successfully!",
    update: "%s updated successfully!",
    delete: "%s deleted successfully!",
    remove: "%s removed successfully!",
    register: "%s registered successfully!",
    loggedIn: "logged in successfully!",
    stored: "%s stored successfully!",
    publish: "%s published successfully!",
    verify: "%s verified successfully!",
  },
};

export const { errorMsg, successMsg } = formattedMsg;
