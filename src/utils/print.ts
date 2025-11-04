export function printElementById(targetId: string, title?: string) {
  if (typeof window === 'undefined') return
  const element = document.getElementById(targetId)
  if (!element) {
    window.print()
    return
  }

  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=650')
  if (!printWindow) {
    window.print()
    return
  }

  const cloned = element.cloneNode(true) as HTMLElement
  const headContent = Array.from(document.head.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((node) => node.outerHTML)
    .join('\n')

  const bodyDataAttributes = Object.entries(document.body.dataset)
    .map(([key, value]) => `data-${key}="${value ?? ''}"`)
    .join(' ')
  const datasetString = bodyDataAttributes ? ` ${bodyDataAttributes}` : ''

  printWindow.document.open()
  printWindow.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${title ?? document.title}</title>
${headContent}
<style>
  @media print {
    body { margin: 24px; }
  }
</style>
</head>
<body${datasetString}>
<div class="print-container">${cloned.outerHTML}</div>
</body>
</html>`)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}
