const fs = require('fs');
const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
  console.error("Usage: node generate-trivy-html.js input.json output.html");
  process.exit(1);
}

try {
  const data = fs.readFileSync(input, 'utf8');
  const json = JSON.parse(data);

  const html = `
    <html>
      <head><title>Trivy Report</title></head>
      <body>
        <h1>Trivy Vulnerability Report</h1>
        <pre>${JSON.stringify(json, null, 2)}</pre>
      </body>
    </html>
  `;

  fs.writeFileSync(output, html);
  console.log(`HTML report written to ${output}`);
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
