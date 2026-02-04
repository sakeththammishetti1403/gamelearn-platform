const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');

/**
 * Generates a certificate PDF for a student
 * @param {Object} data - { studentName, courseName, date }
 * @returns {Promise<Buffer>} - PDF Buffer
 */
const generateCertificatePDF = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
                margin: 0
            });

            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            const { studentName, courseName, date } = data;
            const certificateId = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;

            // --- Styling & Background ---
            const width = doc.page.width;
            const height = doc.page.height;

            // Sophisticated Border
            doc.rect(20, 20, width - 40, height - 40)
                .lineWidth(8)
                .stroke('#335495');

            doc.rect(35, 35, width - 70, height - 70)
                .lineWidth(1)
                .stroke('#5798A3');

            // --- Decorative Elements ---
            // Left corner seal area
            doc.circle(100, 100, 40)
                .lineWidth(2)
                .stroke('rgba(51, 84, 149, 0.2)');

            // --- Content ---
            doc.fillColor('#1a1a1a');

            // Platform Logo Placeholder (Top Middle)
            doc.fontSize(24)
                .font('Helvetica-Bold')
                .fillColor('#335495')
                .text('GameLearn Academy', 0, 60, { align: 'center' });

            // Main Title
            doc.fontSize(44)
                .font('Helvetica-Bold')
                .fillColor('#1a1a1a')
                .text('CERTIFICATE OF ACHIEVEMENT', 0, 120, { align: 'center', letterSpacing: 1 });

            doc.fontSize(18)
                .font('Helvetica')
                .text('This academic credential is proud presented to', 0, 185, { align: 'center' });

            // Student Name (Prominent)
            doc.fontSize(52)
                .font('Times-Roman') // More formal
                .fillColor('#335495')
                .text(studentName, 0, 220, { align: 'center' });

            doc.moveTo(width / 4, 280)
                .lineTo(3 * width / 4, 280)
                .lineWidth(1)
                .stroke('#335495');

            doc.fontSize(16)
                .font('Helvetica')
                .fillColor('#1a1a1a')
                .text('for demonstrating exceptional mastery in the module', 0, 300, { align: 'center' });

            // Course Name
            doc.fontSize(32)
                .font('Helvetica-Bold')
                .text(`"${courseName}"`, 0, 340, { align: 'center' });

            // Verification Section
            doc.fontSize(10)
                .font('Helvetica')
                .fillColor('gray')
                .text(`Certificate Authentication ID: ${certificateId}`, 0, 410, { align: 'center' });

            // Signatures
            const footerY = 460;

            // Instructor Signature
            doc.fillColor('#1a1a1a')
                .fontSize(16)
                .font('Times-Italic')
                .text('Dr. Sarah Jenkins', 150, footerY, { width: 200, align: 'center' });
            doc.moveTo(150, footerY + 20)
                .lineTo(350, footerY + 20)
                .lineWidth(0.5)
                .stroke('#1a1a1a');
            doc.fontSize(10)
                .font('Helvetica')
                .text('Head of Instruction', 150, footerY + 30, { width: 200, align: 'center' });

            // Institution Seal
            doc.fontSize(16)
                .font('Helvetica-Bold')
                .fillColor('#335495')
                .text('GameLearn Official', width - 350, footerY, { width: 200, align: 'center' });
            doc.moveTo(width - 350, footerY + 20)
                .lineTo(width - 150, footerY + 20)
                .lineWidth(0.5)
                .stroke('#335495');
            doc.fontSize(10)
                .font('Helvetica')
                .fillColor('#1a1a1a')
                .text('Academic Verification Unit', width - 350, footerY + 30, { width: 200, align: 'center' });

            doc.fontSize(11)
                .text(`Date of Issue: ${new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`, 0, height - 70, { align: 'center' });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { generateCertificatePDF };
