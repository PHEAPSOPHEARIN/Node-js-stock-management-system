import fs from "fs";
import path from "path";

const folders = [
  "src/config",
  "src/controllers",
  "src/middleware",
  "src/routes",
  "src/services",
  "src/utils",
];

folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`✅ Created: ${folder}`);
  } else {
    console.log(`✓ Exists: ${folder}`);
  }
});

console.log("\n📁 Folder structure ready!");
