import nodeMailer from "./node-mailer.js";

const sendEmailVerificationMail = async (data) => {
  const emailData = {
    reciever: data?.email, // Email recipient
    subject: "Verify your email | One College", // Subject line
    templateFile: "emailVerificationMail", // The name of the Handlebars file (without .handlebars extension)
    context: {
      name: data.name,
      link: data.link,
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

export default sendEmailVerificationMail;
