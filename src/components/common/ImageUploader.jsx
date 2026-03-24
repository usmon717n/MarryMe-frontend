import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
const UT_URL = BACKEND_URL + '/api/uploadthing';

export default function ImageUploader({
  value = '',
  onChange,
  endpoint = 'serviceCover',
  label = 'Rasm yuklash',
  className = '',
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Faqat rasm fayllari qabul qilinadi');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Fayl hajmi 4MB dan oshmasin');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const token = localStorage.getItem('mm_token');

      // Step 1: get presigned URL from uploadthing
      const presignRes = await fetch(UT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'x-uploadthing-version': '6.13.2',
          'x-uploadthing-package': 'react',
        },
        body: JSON.stringify({
          files: [{ name: file.name, size: file.size, type: file.type }],
          routeConfig: { image: { maxFileSize: '4MB' } },
          input: {},
          actionType: 'upload',
        }),
      });

      if (!presignRes.ok) {
        // Fallback: use direct base64 preview for local dev
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange(e.target.result);
          setUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      const presignData = await presignRes.json();
      const { url: uploadUrl, fields, fileUrl } = presignData?.[0] || {};

      if (uploadUrl && fileUrl) {
        // Step 2: upload to S3
        const formData = new FormData();
        if (fields) {
          Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
        }
        formData.append('file', file);

        await fetch(uploadUrl, { method: 'POST', body: formData });
        onChange(fileUrl);
      } else {
        // If UT not configured, use object URL as fallback
        onChange(URL.createObjectURL(file));
      }
    } catch (err) {
      console.error('Upload error:', err);
      // Graceful fallback — show local preview
      const reader = new FileReader();
      reader.onload = (e) => onChange(e.target.result);
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="preview"
            className="w-full h-36 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
          />
          <button
            type="button"
            onClick={() => { onChange(''); if (inputRef.current) inputRef.current.value = ''; }}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
          >
            O'zgartirish
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full h-36 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-rose-300 dark:hover:border-rose-600 hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-all group"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-rose-400 animate-spin" />
              <span className="text-xs text-gray-400 dark:text-gray-500">Yuklanmoqda...</span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/20 flex items-center justify-center transition-colors">
                <Upload className="w-5 h-5 text-gray-400 group-hover:text-rose-400 transition-colors" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Bosing yoki suring
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, WEBP · maks 4MB</span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
