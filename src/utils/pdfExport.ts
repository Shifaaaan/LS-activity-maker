import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export async function exportElementToPdf(
  element: HTMLElement,
  fileName: string = 'College_Activity_Report.pdf',
  onProgress?: (status: string) => void,
  orientation: 'landscape' | 'portrait' = 'landscape'
): Promise<boolean> {
  try {
    onProgress?.('Preparing document for high-resolution render...');

    const isLandscape = orientation === 'landscape';
    // A4 dimensions in mm
    const a4WidthMm = isLandscape ? 297 : 210;
    const a4HeightMm = isLandscape ? 210 : 297;

    // Use html2canvas-pro with scale for crisp rendering and onclone to unscale
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedSheet = clonedDoc.getElementById('academic-report-sheet');
        if (clonedSheet) {
          clonedSheet.style.transform = 'none';
          clonedSheet.style.boxShadow = 'none';
          clonedSheet.style.margin = '0';
          clonedSheet.style.width = `${a4WidthMm}mm`;
          clonedSheet.style.height = `${a4HeightMm}mm`;
        }
      },
    });

    onProgress?.('Compiling PDF document...');
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, a4WidthMm, a4HeightMm, undefined, 'FAST');
    
    onProgress?.('Saving file...');
    pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: Trigger print dialog if canvas generation had an issue
    window.print();
    return false;
  }
}
