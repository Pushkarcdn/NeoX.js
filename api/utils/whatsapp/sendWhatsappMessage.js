import axios from "axios";
import { whatsapp } from "../../../configs/env.js";

const sendWhatsappMessage = async (messageData) => {
  let { phone, template, variables } = messageData;

  // remove all spaces and replace with %20
  variables = Object.entries(variables).map(([key, value]) => {
    return {
      [key]: value?.replace(" ", "%20"),
    };
  });

  const payload = {
    number: phone?.replace(/\D/g, ""), // remove all non-digit characters
    message: template,
    ...variables,
  };

  // make payload a query string
  const queryString = Object.entries(payload)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  try {
    const response = await axios.get(
      `${whatsapp.apiUrl}/${whatsapp.apiKey}?${queryString}`,
      {
        timeout: 10000, // 10 seconds timeout
      }
    );

    console.info("Whatsapp message sent successfully to: ", phone);
    console.info("Whatsapp response: ", response?.data);
  } catch (error) {
    console.error("Whatsapp message failed to send to: ", phone);
    console.error("Whatsapp error: ", error);
  }
};

export default sendWhatsappMessage;
