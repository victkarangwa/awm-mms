import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (
  members: { [key: string]: any }[],
  fileName: string = "members.xlsx"
) => {
  if (members.length === 0) {
    alert("No data to export");
    return;
  }

  // Convert JSON to Worksheet
  const worksheet = XLSX.utils.json_to_sheet(members);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

  // Convert to Excel File
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create a Blob and Save File
  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(file, fileName);
};
