import { jsPDF } from 'jspdf';
import type { ReportContext } from '@/components/ReportDrawer';
import type { Locale } from './i18n';

interface PdfParams {
  context: ReportContext;
  lang: Locale;
  reportDataUrl: string;
}

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

export async function generateReport({ context, lang, reportDataUrl }: PdfParams): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'landscape',
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
    keywords: `stoffice, fm, handover, dalux, ${lang}`,
  });

  pdf.addImage(reportDataUrl, 'PNG', 0, 0, 297, 210, undefined, 'FAST');

  const blob = pdf.output('blob');
  const filename = `Stoffice-Report-${context.companyName.replace(/\s+/g, '-')}-${context.date}.pdf`;
  triggerDownload(blob, filename);
}
