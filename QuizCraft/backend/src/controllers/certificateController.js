const Result = require("../models/Result");
const PDFDocument = require("pdfkit");
const path = require("path");

const generateCertificate = async (req, res) => {
  const { username, courseName } = req.params;

  try {
    // Fetch all results for this user and course
    const results = await Result.find({ username, courseName });

    if (results.length === 0) {
      return res.status(404).json({ message: "Sorry you have not attempted any quiz in this course.." });
    }

    const totalTopics = 5; // You can update this if it's dynamic
    const maxScorePerTopic = 5; // Assume max score per topic is 5
    const maxTotalScore = totalTopics * maxScorePerTopic;

    const userTotalScore = results.reduce((acc, curr) => acc + curr.score, 0);
    const percentage = (userTotalScore / maxTotalScore) * 100;

    if (percentage < 75) {
      return res.status(403).json({
        message: "You are not eligible for the certificate. Score at least 75%.",
        percentage: `${percentage.toFixed(2)}%`
      });
    }

    // Create a PDF certificate
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=certificate.pdf");

    // Gold border
    doc.save();
    doc.rect(10, 10, doc.page.width - 20, doc.page.height - 20)
      .lineWidth(6)
      .strokeColor('#FFD700')
      .stroke();
    doc.restore();

    // Logo at top right
    const logoPath = path.join(__dirname, '../../assets/achieve.png');
    try {
      doc.image(logoPath, doc.page.width - 150, 30, { width: 100 });
    } catch (e) {
      // If logo not found, skip
    }

    // Title
    doc.fontSize(32)
      .fillColor('#222')
      .font('Helvetica-Bold')
      .text('Certificate of Achievement', 0, 80, { align: 'center' });

    // Subtitle
    doc.moveDown(0.5);
    doc.fontSize(18)
      .fillColor('#444')
      .font('Helvetica')
      .text('This is to certify that', { align: 'center' });

    // Recipient
    doc.moveDown(0.3);
    doc.fontSize(26)
      .fillColor('#111')
      .font('Helvetica-Bold')
      .text(username, { align: 'center', underline: true });

    // Course
    doc.moveDown(0.3);
    doc.fontSize(18)
      .fillColor('#444')
      .font('Helvetica')
      .text(`has successfully completed the course`, { align: 'center' });
    doc.moveDown(0.1);
    doc.fontSize(22)
      .fillColor('#1e3a8a')
      .font('Helvetica-Bold')
      .text(courseName, { align: 'center' });

    // Score
    doc.moveDown(0.3);
    doc.fontSize(16)
      .fillColor('#333')
      .font('Helvetica')
      .text(`with a score of ${userTotalScore}/${maxTotalScore} (${percentage.toFixed(2)}%)`, { align: 'center' });

    // Date and signature
    const dateStr = new Date().toLocaleDateString();
    // Place signature and date closer to the bottom, but not too low
    const sigY = doc.page.height - 120;
    doc.fontSize(14)
      .fillColor('#888')
      .text(`Date: ${dateStr}`, 60, sigY, { align: 'left' });
    doc.fontSize(14)
      .fillColor('#888')
      .text('Signature:', doc.page.width - 200, sigY, { align: 'left' });
    doc.moveTo(doc.page.width - 120, sigY + 20)
      .lineTo(doc.page.width - 40, sigY + 20)
      .strokeColor('#222')
      .lineWidth(2)
      .stroke();

    // Add a styled signature (Naveen)
    doc.fontSize(28)
      .fillColor('#222')
      .font('Helvetica-Oblique')
      .text('Naveen', doc.page.width - 140, sigY + 10, { align: 'left', italic: true });

    // Footer
    doc.fontSize(10)
      .fillColor('#aaa')
      .text('Powered by Quiz App', 0, doc.page.height - 40, { align: 'center' });

    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("Error generating certificate:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { generateCertificate };
