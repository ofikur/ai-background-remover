'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, Download, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bgMode, setBgMode] = useState<'transparent' | 'color'>('transparent');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const finalImageRef = useRef<HTMLImageElement>(null);

  const resetState = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setIsLoading(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { 
      setError('Ukuran file terlalu besar! Maksimal 10MB.');
      return;
    }
    
    resetState();
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    processImage(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0] || null);
  };
  
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files?.[0] || null);
  };

  const processImage = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/remove-background/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error! Coba gambar lain.`);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(imageUrl);
    } catch (err) { // PERBAIKAN: Mengganti 'err: any'
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!processedImage || !finalImageRef.current) return;
    const link = document.createElement('a');
    link.download = `vanishbg_edit_${Date.now()}.png`;
    
    if (bgMode === 'transparent') {
      link.href = processedImage;
    } else {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = finalImageRef.current;
      if (!ctx) return;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(img, 0, 0);
      
      link.href = canvas.toDataURL('image/png');
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const transparentBgPattern = {
    backgroundImage: `
      linear-gradient(45deg, #334155 25%, transparent 25%), 
      linear-gradient(-45deg, #334155 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #334155 75%),
      linear-gradient(-45deg, transparent 75%, #334155 75%)`,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    backgroundColor: '#1e293b'
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-900 text-white p-2 sm:p-4">
      <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/png, image/jpeg" className="hidden" />

      <div className="w-full max-w-6xl lg:h-[85vh] grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 w-full h-full bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-center p-4 aspect-square lg:aspect-auto overflow-hidden">
          
          {!originalImage && !processedImage ? (
            <div 
              className="w-full h-full border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-rose-500 hover:text-rose-500 transition-all cursor-pointer text-center"
              onClick={() => fileInputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <UploadCloud size={48} className="sm:size-64"/>
              <p className="mt-4 font-semibold text-base sm:text-lg">Klik atau Seret Gambar ke Sini</p>
              <p className="text-xs sm:text-sm">Ukuran download sesuai resolusi asli</p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={(processedImage && bgMode === 'transparent') ? transparentBgPattern : { backgroundColor: bgColor }}>
              {isLoading && <div className="border-4 border-slate-400 border-t-rose-500 rounded-full w-16 h-16 animate-spin"></div>}
              {error && <p className="text-center text-red-400">{error}</p>}
              {processedImage && (
                // PERBAIKAN: Menambahkan komentar untuk menghilangkan peringatan
                // eslint-disable-next-line @next/next/no-img-element
                <img ref={finalImageRef} src={processedImage} alt="Processed" className="max-h-full max-w-full object-contain" />
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1 w-full h-full bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-4 sm:p-6 flex flex-col">
            <h1 className="text-2xl lg:text-3xl font-bold text-rose-400">VanishBG</h1>
            <p className="text-slate-400 text-sm mb-6">Hapus background cepat & efisien</p>
            
            <div className="flex-grow flex flex-col gap-6 overflow-y-auto pr-2">
              {!processedImage && !isLoading ? (
                 <div className="text-slate-400 text-center my-auto">
                   <p>Unggah gambar untuk memulai...</p>
                 </div>
              ) : (
                <div>
                  <h2 className="font-semibold mb-3">Latar Belakang</h2>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setBgMode('transparent')} className={`p-3 rounded-lg text-sm font-semibold transition-colors ${bgMode === 'transparent' ? 'bg-rose-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Transparan</button>
                    <button onClick={() => setBgMode('color')} className={`p-3 rounded-lg text-sm font-semibold transition-colors ${bgMode === 'color' ? 'bg-rose-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Warna</button>
                  </div>
                  {bgMode === 'color' && (
                    <div className="flex items-center gap-3 mt-4">
                      <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 p-1 bg-transparent border-none rounded-lg cursor-pointer"/>
                      <span className="font-mono text-slate-400 text-sm">{bgColor.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className='mt-6'>
              {processedImage && (
                <button onClick={handleDownload} className="w-full p-4 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-green-500 transition-all">
                  <Download size={20} /> Download Gambar
                </button>
              )}
              <button onClick={() => fileInputRef.current?.click()} className="w-full mt-3 p-2 text-slate-400 hover:bg-slate-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                <RefreshCw size={14} /> 
                {processedImage ? 'Ganti Gambar' : 'Pilih Gambar Lain'}
              </button>
            </div>
        </div>
      </div>
    </main>
  );
}