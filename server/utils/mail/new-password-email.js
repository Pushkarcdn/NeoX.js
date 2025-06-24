import nodeMailer from "./node-mailer.js";
import { server } from "../../../configs/env.js";

const sendNewPasswordEmail = async (data) => {
  const emailData = {
    reciever: data?.email, // Email recipient
    subject: `Password reset | ${server.appName}`, // Subject line
    templateFile: "newPasswordMail", // The name of the Handlebars file (without .ejs or .handlebars extension)
    context: {
      name: data.name,
      password: data.password,
    },
    priority: "normal", // Pass priority, default to 'normal'
    // Data to pass to the template
  };

  try {
    await nodeMailer(emailData);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendNewPasswordEmail;
