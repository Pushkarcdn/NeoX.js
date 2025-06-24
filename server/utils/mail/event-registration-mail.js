import nodeMailer from "./node-mailer.js";
import { server } from "../../../configs/env.js";

const sendEventRegistrationMail = async (data) => {
  const emailData = {
    reciever: data?.email, // Email recipient
    subject: `Event Registration | ${server.appName}`, // Subject line
    templateFile: "eventRegistrationMail", // The name of the Handlebars file (without .handlebars extension)
    context: {
      name: data.name,
      eventTitle: data.eventTitle,
      eventDate: data.eventDate,
      eventStartTime: data.eventStartTime,
      eventEndTime: data.eventEndTime,
      eventLink:
        data?.eventLink?.startsWith("http") ||
        data?.eventLink?.startsWith("https")
          ? data.eventLink
          : data.eventLink.includes("maps.google.com")
            ? data.eventLink
            : data.eventLink.includes(" ") ||
                /[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/.test(data.eventLink)
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.eventLink)}`
              : `https://${data.eventLink}`,
      eventPassword: data.eventPassword,
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

export default sendEventRegistrationMail;
