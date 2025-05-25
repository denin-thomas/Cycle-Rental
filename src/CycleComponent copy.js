import React, { useEffect, useRef } from 'react';
import qrCode from 'qrcode';

const CycleComponent = ({ cycleId, websiteUrl }) => {
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrDataURL = await qrCode.toDataURL(`${websiteUrl}/cycle/${cycleId}`);
        if (qrCodeRef.current) {
          qrCodeRef.current.src = qrDataURL;
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [cycleId, websiteUrl]);

  const downloadQRCode = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = qrCodeRef.current.width;
    canvas.height = qrCodeRef.current.height;
    context.drawImage(qrCodeRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr_code_${cycleId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className='qr-div'>
      <h2>Cycle {cycleId}</h2>
      {/* Render QR code image */}
      <img ref={qrCodeRef} alt='QR Code' />
      {/* Render download button */}
      <button onClick={downloadQRCode}>Download QR Code</button>
    </div>
  );
};

export default CycleComponent;
