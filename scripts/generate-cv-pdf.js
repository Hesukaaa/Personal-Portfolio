import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputImage = path.resolve(__dirname, "../src/assets/CV.png");
const outputPdf = path.resolve(__dirname, "../public/CV.pdf");

const doc = new PDFDocument({ autoFirstPage: false, margins: { top: 0, bottom: 0, left: 0, right: 0 } });
const stream = fs.createWriteStream(outputPdf);

doc.pipe(stream);
doc.addPage({ size: "A4", layout: "portrait" });
doc.image(inputImage, 0, 0, { fit: [doc.page.width, doc.page.height], align: "center", valign: "center" });
doc.end();

stream.on("finish", () => {
  console.log(`Created ${outputPdf}`);
});

stream.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
