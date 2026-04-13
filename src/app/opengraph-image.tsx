import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Stoffice — Smart Building AI';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#ffffff',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ fontSize: 56, color: '#1a2b3c', lineHeight: 1.1, marginBottom: 20 }}>
          Stoffice
        </div>
        <div style={{ fontSize: 26, color: '#5a6b7b', lineHeight: 1.4, maxWidth: 700 }}>
          Ihre Gebäude kosten zu viel im Betrieb.
        </div>
        <div style={{ fontSize: 14, color: '#0693e3', marginTop: 40, letterSpacing: '0.1em' }}>
          SMART BUILDING AI — FM COST OPTIMIZER
        </div>
      </div>
    ),
    { ...size }
  );
}
