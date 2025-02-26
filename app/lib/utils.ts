import fs from "fs";
import path from "path";
import Papa from "papaparse";

export const getDataFromCSV = (fileName: string) => {
  const filePath = path.join(process.cwd(), "data", fileName);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data: dataRaw } = Papa.parse(fileContent, {
    header: true,
  });

  return dataRaw;
};
