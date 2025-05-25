import React, { useEffect, useRef } from 'react';
import qrCode from 'qrcode';

const CycleComponent = ({ cycleId, websiteUrl, width, height }) => {
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrDataURL = await qrCode.toDataURL(`${websiteUrl}/${cycleId}`, { width, height });
        if (qrCodeRef.current) {
          qrCodeRef.current.src = qrDataURL;
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [cycleId, websiteUrl, width, height]);

  const downloadQRCode = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    context.drawImage(qrCodeRef.current, 0, 0, width, height);
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
      <img ref={qrCodeRef} alt='QR Code' width='300' height='300'/>
      {/* Render download button */}
      <button onClick={downloadQRCode}>Download QR Code</button>
    </div>
  );
};

export default CycleComponent;
