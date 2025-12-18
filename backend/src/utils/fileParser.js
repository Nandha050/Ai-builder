const fs = require("fs");
const pdfParse = require("pdf-parse");

exports.parseFiles = async (files = []) => {
  let combinedText = "";

  for (const file of files) {
    if (file.mimetype === "application/pdf") {
      const buffer = fs.readFileSync(file.path);
      const data = await pdfParse(buffer);
      combinedText += `\n\n${data.text}`;
    }
  }

  return combinedText.trim();
};
