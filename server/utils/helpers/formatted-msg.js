import util from "util";

const formattedMsg = (err, errorMsg) => {
  return err.source
    ? util.format(
        errorMsg[err.message],
        ...(typeof err.source === "string" ? [err.source] : err.source)
      )
    : errorMsg[err.message];
};

export default formattedMsg;
