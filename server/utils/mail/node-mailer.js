import nodemailer from "nodemailer";
import ejs from "ejs";
import { mailerConfig } from "../../../configs/env.js";
import path from "path";

/**
 * Sends an email using the configured template engine.
 * @param {Object} data - The email data, including receiver, subject, template file, and context.
 * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error.
 */
const nodeMailer = (data) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(mailerConfig);
    const templateEngine = mailerConfig.templateEngine;

    try {
      if (templateEngine === "handlebars") {
        // Handlebars setup
        // const handlebarOptions = {
        //   viewEngine: {
        //     partialsDir: path.resolve("./views/"),
        //     defaultLayout: false,
        //   },
        //   viewPath: path.resolve("./views/"),
        // };
        // transporter.use("compile", hbs(handlebarOptions));
        // console.info("Handlebars template engine configured.");
      } else if (templateEngine === "ejs") {
        // EJS setup
        transporter.use("compile", (mail, callback) => {
          ejs.renderFile(
            path.join(
              path.resolve("public/views/emailTemplates"),
              `${data.templateFile}.ejs`
            ),
            data.context,
            (err, renderedHtml) => {
              if (err) {
                console.error(`Error rendering EJS template: ${err.message}`);
                return callback(err);
              }
              mail.data.html = renderedHtml;
              callback();
            }
          );
        });
        console.info("EJS template engine configured.");
      } else {
        throw new Error(`Unsupported template engine: ${templateEngine}`);
      }

      const mailOptions = {
        from: `One College <${mailerConfig.auth.user}>`, // sender address
        to: [data.reciever], // list of receivers
        subject: `${data.subject}`,
        template:
          templateEngine === "handlebars" ? data.templateFile : undefined, // Only set for Handlebars
        context: templateEngine === "handlebars" ? data.context : undefined,
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Failed to send email: ${error.message}`);
          return reject(error);
        }
        console.info(`Message sent: ${info.response}`);
        resolve(`Mail sent to ${data.reciever} successfully`);
      });
    } catch (err) {
      console.error(`Mailer setup failed: ${err.message}`);
      reject(err);
    }
  });
};

export default nodeMailer;
