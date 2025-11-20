import fs from "fs";
import path from "path";

const files = [
  "src/routes/auth.routes.js",
  "src/controllers/auth.controller.js",
  "src/services/auth.service.js",
  "src/middleware/auth.js",
  "src/utils/jwt.js",
];

files.forEach((file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, "utf8");

    // Fix imports - add .js extension
    content = content.replace(
      /from ['"](\.\.[^'"]+)(?<!\.js)['"]/g,
      `from '$1.js'`
    );

    fs.writeFileSync(file, content);
    console.log(`✅ Fixed: ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
  }
});

console.log("\n✨ Import fixes complete!");
