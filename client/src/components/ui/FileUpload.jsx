import React, { useRef, useState } from 'react';
import Button from './Button';

const FileUpload = ({ label, onUpload, className = '' }) => {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setFileName(file.name);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/users/upload', {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                onUpload(data.filePath); // Pass back the URL
            } else {
                alert('Upload failed');
                setFileName('');
            }
        } catch (err) {
            console.error(err);
            alert('Upload error');
            setFileName('');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="flex gap-2 items-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Choose File'}
                </Button>
                <span className="text-xs text-gray-500 truncate max-w-[150px]">
                    {fileName || 'No file chosen'}
                </span>
            </div>
        </div>
    );
};

export default FileUpload;
