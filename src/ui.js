export function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function table(headers, rows) {
  const head = headers.map((cell) => `<th>${esc(cell)}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`,
    )
    .join("");
  return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

export function paragraphs(lines) {
  return lines.map((line) => `<p>${esc(line)}</p>`).join("");
}
