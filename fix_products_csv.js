const fs = require("fs");
const csv = require("fast-csv");

const INPUT = "test_products.csv";      // change if your file name is different
const OUTPUT = "test_products_fixed.csv";

const results = [];

fs.createReadStream(INPUT)
  .pipe(csv.parse({ headers: true, trim: true }))
  .on("error", (error) => {
    console.error("Error reading CSV:", error);
  })
  .on("data", (row) => {
    // Normalize and fill defaults
    const fixed = {
      Name: row.Name || "",
      Category: row.Category || "",
      Brand: row.Brand && row.Brand.toString().trim() !== "" ? row.Brand : "VaibhavTools",
      Price: row.Price && row.Price.toString().trim() !== "" ? row.Price : "1",
      Description: row.Description || "",
      Stock: row.Stock || "",
    };

    results.push(fixed);
  })
  .on("end", () => {
    // Write fixed CSV
    const ws = fs.createWriteStream(OUTPUT);
    csv.write(results, { headers: true }).pipe(ws);
    console.log("Fixed CSV generated:", OUTPUT);
  });
