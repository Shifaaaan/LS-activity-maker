import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * High-fidelity, universal A4 PDF exporter for College Activity Reports.
 * Solves device-specific distortion / cut-off bugs on mobile, tablet, and desktop devices
 * by rendering the sheet unscaled in an isolated sandbox with fixed A4 portrait dimensions
 * and injecting a consistent print-media query strategy matching #document-canvas-container CSS exactly.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  fileName: string = 'College_Activity_Report.pdf',
  onProgress?: (status: string) => void,
  _orientation: 'landscape' | 'portrait' = 'portrait'
): Promise<boolean> {
  let sandbox: HTMLDivElement | null = null;
  try {
    onProgress?.('Preparing high-resolution layout...');

    // Wait for exact Times New Roman TTF and Google fonts to be loaded
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Force page size to exact A4 portrait in mm: 210 x 297 mm
    const a4WidthMm = 210;
    const a4HeightMm = 297;

    // Convert mm to standard CSS px at 96 DPI: 1 mm = 3.779527559 px
    const a4WidthPx = Math.round(a4WidthMm * 3.779527559); // 794 px
    const a4HeightPx = Math.round(a4HeightMm * 3.779527559); // 1123 px

    // Create an isolated render sandbox attached to document.body
    // Matching exact document-canvas-container dimensions to ensure consistent print-media rendering
    sandbox = document.createElement('div');
    sandbox.id = 'pdf-render-isolation-sandbox';
    sandbox.className = 'print-document-container';
    sandbox.style.position = 'fixed';
    sandbox.style.top = '0';
    sandbox.style.left = '0';
    sandbox.style.width = `${a4WidthPx + 40}px`;
    sandbox.style.height = `${a4HeightPx + 40}px`;
    sandbox.style.zIndex = '-99999';
    sandbox.style.opacity = '0.001';
    sandbox.style.pointerEvents = 'none';
    sandbox.style.overflow = 'hidden';
    sandbox.style.backgroundColor = '#ffffff';

    // Deep clone the report sheet element to detach from responsive mobile container and zoom transforms
    const clone = element.cloneNode(true) as HTMLElement;
    clone.id = 'academic-report-sheet-export-clone';
    clone.style.transform = 'none';
    clone.style.transformOrigin = 'top left';
    clone.style.boxShadow = 'none';
    clone.style.margin = '0';
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = `${a4WidthMm}mm`;
    clone.style.minWidth = `${a4WidthMm}mm`;
    clone.style.maxWidth = `${a4WidthMm}mm`;
    clone.style.height = `${a4HeightMm}mm`;
    clone.style.minHeight = `${a4HeightMm}mm`;
    clone.style.maxHeight = `${a4HeightMm}mm`;
    clone.style.boxSizing = 'border-box';

    // Remove any active contentEditable borders or focus rings from the clone
    const editables = clone.querySelectorAll('[contenteditable]');
    editables.forEach((el) => {
      el.removeAttribute('contenteditable');
      (el as HTMLElement).style.outline = 'none';
    });

    sandbox.appendChild(clone);
    document.body.appendChild(sandbox);

    // Micro-delay to allow browser CSS layout and web fonts to paint fully
    await new Promise((resolve) => setTimeout(resolve, 80));

    onProgress?.('Rendering exact document canvas...');

    // Render with html2canvas-pro at 2.5x crisp print density
    const canvas = await html2canvas(clone, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: a4WidthPx,
      height: a4HeightPx,
      windowWidth: a4WidthPx,
      windowHeight: a4HeightPx,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (clonedDoc) => {
        // Enforce consistent print-media query strategy matching document-canvas-container CSS exactly
        const printMediaStrategyStyle = clonedDoc.createElement('style');
        printMediaStrategyStyle.id = 'document-canvas-container-print-strategy';
        printMediaStrategyStyle.textContent = `
          @media print, all {
            @page {
              size: A4 portrait !important;
              margin: 0 !important;
            }
            html, body {
              background: #ffffff !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              overflow: hidden !important;
            }
            #document-canvas-container,
            .print-document-container {
              padding: 0 !important;
              background: transparent !important;
              box-shadow: none !important;
              width: 210mm !important;
              min-height: 297mm !important;
              max-width: 210mm !important;
              margin: 0 auto !important;
            }
            #academic-report-sheet,
            .report-page-sheet,
            #academic-report-sheet-export-clone {
              box-shadow: none !important;
              border-radius: 0 !important;
              width: 210mm !important;
              min-width: 210mm !important;
              max-width: 210mm !important;
              height: 297mm !important;
              min-height: 297mm !important;
              max-height: 297mm !important;
              margin: 0 !important;
              transform: none !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
              overflow: hidden !important;
              box-sizing: border-box !important;
            }
          }
        `;
        clonedDoc.head.appendChild(printMediaStrategyStyle);

        clonedDoc.documentElement.style.width = `${a4WidthPx}px`;
        clonedDoc.documentElement.style.height = `${a4HeightPx}px`;
        clonedDoc.body.style.width = `${a4WidthPx}px`;
        clonedDoc.body.style.height = `${a4HeightPx}px`;
        clonedDoc.body.style.margin = '0';
        clonedDoc.body.style.padding = '0';
        clonedDoc.body.style.overflow = 'hidden';
      }
    });

    onProgress?.('Generating standardized A4 PDF...');
    const imgData = canvas.toDataURL('image/png');

    // Force page size to A4 portrait in jsPDF settings to prevent device-specific scaling bugs
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      hotfixes: ['px_scaling'],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, a4WidthMm, a4HeightMm, undefined, 'FAST');

    onProgress?.('Saving file...');
    pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: Trigger print dialog if canvas generation encountered an exception
    window.print();
    return false;
  } finally {
    if (sandbox && sandbox.parentNode) {
      sandbox.parentNode.removeChild(sandbox);
    }
  }
}
