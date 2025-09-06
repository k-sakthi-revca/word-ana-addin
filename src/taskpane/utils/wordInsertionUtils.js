/* global Word console */

/**
 * Insert narrative text into the current selection in Word
 * @param {string} text - The narrative text to insert
 * @returns {Promise<Object>} - Result of the operation
 */
export async function insertNarrativeInCurrentSelection(text) {
  try {
    await Word.run(async (context) => {
      const selection = context.document.getSelection();
      selection.insertText(text, Word.InsertLocation.replace);
      await context.sync();
    });

    return { success: true };
  } catch (error) {
    console.error("Error inserting narrative in current selection:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Insert narrative text into a new paragraph at the end of document
 * @param {string} text - The narrative text to insert
 * @returns {Promise<Object>} - Result of the operation
 */
export async function insertNarrativeInNewParagraph(text) {
  try {
    await Word.run(async (context) => {
      const body = context.document.body;
      body.insertParagraph(text, Word.InsertLocation.end);
      await context.sync();
    });

    return { success: true };
  } catch (error) {
    console.error("Error inserting narrative in new paragraph:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Insert a table into the current selection
 * @param {Object} tableData - The table data to insert
 * @returns {Promise<Object>} - Result of the operation
 */
export async function insertTableInCurrentSelection(tableData) {
  try {
    await Word.run(async (context) => {
      const selection = context.document.getSelection();

      // Create values for table (headers + rows + totals)
      const tableValues = [
        tableData.headers,
        ...tableData.rows,
        tableData.totals
      ];

      const table = selection.insertTable(
        tableValues.length, 
        tableData.headers.length, 
        Word.InsertLocation.replace, 
        tableValues
      );

      // Bold header and totals
      table.getRow(0).font.bold = true;
      table.getRow(tableValues.length - 1).font.bold = true;

      await context.sync();
    });

    return { success: true };
  } catch (error) {
    console.error("Error inserting table in current selection:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Insert a table into a new paragraph at end of document
 * @param {Object} tableData - The table data to insert
 * @returns {Promise<Object>} - Result of the operation
 */
export async function insertTableInNewParagraph(tableData) {
  try {
    await Word.run(async (context) => {
      const body = context.document.body;

      const tableValues = [
        tableData.headers,
        ...tableData.rows,
        tableData.totals
      ];

      const table = body.insertTable(
        tableValues.length, 
        tableData.headers.length, 
        Word.InsertLocation.end, 
        tableValues
      );

      // Bold header and totals
      table.getRow(0).font.bold = true;
      table.getRow(tableValues.length - 1).font.bold = true;

      await context.sync();
    });

    return { success: true };
  } catch (error) {
    console.error("Error inserting table in new paragraph:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Copy text to clipboard (works same as Excel)
 * @param {string} text - The text to copy
 * @returns {Promise<Object>} - Result of the operation
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        return { success: true };
      } else {
        return { success: false, error: "Unable to copy to clipboard" };
      }
    }
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Format table data for clipboard (same as Excel)
 * @param {Object} tableData
 * @returns {string}
 */
export function formatTableForClipboard(tableData) {
  let tableText = "";
  tableText += tableData.headers.join("\t") + "\n";
  tableData.rows.forEach(row => {
    tableText += row.join("\t") + "\n";
  });
  tableText += tableData.totals.join("\t");
  return tableText;
}
