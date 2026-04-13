import { jsPDF } from 'jspdf';
import type { ReportContext } from '@/components/ReportDrawer';
import type { Locale } from './i18n';

interface PdfParams {
  context: ReportContext;
  lang: Locale;
  reportDataUrl: string;
}

/**
 * A4 portrait: 210 × 297 mm
 * Canvas is 794 × N px (2 pages of ~1123px each)
 * We slice the image into pages.
 */
const A4W = 210;
const PAGE_PX = 1123;

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function generateReport({ context, reportDataUrl }: PdfParams): Promise<void> {
  /* Load source image */
  const img = new Image();
  img.src = reportDataUrl;
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; });

  const totalH = img.naturalHeight;
  const totalW = img.naturalWidth;
  const pages = Math.ceil(totalH / (PAGE_PX * (totalW / 794))); // scale-aware page count
  const scaledPageH = PAGE_PX * (totalW / 794); // page height in source image pixels

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
  });

  pdf.setProperties({
    title: `Stoffice Report - ${context.companyName}`,
    subject: `FM impact report for ${context.companyName}`,
    author: 'Stoffice',
    creator: 'Stoffice',
  });

  for (let p = 0; p < pages; p++) {
    if (p > 0) pdf.addPage();

    /* Slice canvas for this page */
    const sliceY = p * scaledPageH;
    const sliceH = Math.min(scaledPageH, totalH - sliceY);
    const canvas = document.createElement('canvas');
    canvas.width = totalW;
    canvas.height = sliceH;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalW, sliceH);
    ctx.drawImage(img, 0, sliceY, totalW, sliceH, 0, 0, totalW, sliceH);

    const pageDataUrl = canvas.toDataURL('image/png');
    const pageHmm = (sliceH / totalW) * A4W;
    pdf.addImage(pageDataUrl, 'PNG', 0, 0, A4W, pageHmm, `page-${p}`, 'FAST');
  }

  const blob = pdf.output('blob');
  const safeName = context.companyName.replace(/[^a-zA-Z0-9À-ÿ\-_ ]/g, '').replace(/\s+/g, '-');
  const filename = `Stoffice-Report-${safeName}-${context.date}.pdf`;
  triggerDownload(blob, filename);
}
