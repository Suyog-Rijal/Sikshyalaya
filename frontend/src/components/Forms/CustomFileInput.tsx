import { ChangeEvent, useRef, useState } from "react";

interface CustomFileInputProps {
    label?: string;
    type?: "image" | "file"; // Allow either image or file
}

export const CustomFileInput = ({ label, type = "image" }: CustomFileInputProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (type === "image") {
                const imageUrl = URL.createObjectURL(file);
                setPreview(imageUrl);
            } else {
                setFileName(file.name);
            }
        }
    };

    const handleRemoveFile = () => {
        setPreview(null);
        setFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
        }
    };

    return (
        <div className={'flex justify-start items-center gap-4'}>
            <div
                className="w-20 h-20 border border-gray-300 rounded-lg relative flex items-center justify-center overflow-hidden"
                onClick={handleFileUploadClick}
            >
                {type === "image" && preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <div className={'p-2 cursor-pointer text-xl text-gray-500 hover:text-black'}>
                        {/*@ts-expect-error: ion-icon not recognized by TypeScript*/}
                        <ion-icon name={type === "image" ? "image-outline" : "document-outline"}></ion-icon>
                    </div>
                )}
            </div>
            <div className={'space-y-2'}>
                <div className={'gap-4 flex text-sm'}>
                    <button
                        className={'w-28 py-1.5 cursor-pointer shadow rounded-md'}
                        onClick={handleFileUploadClick}
                    >
                        Upload
                    </button>
                    <button
                        className={'w-28 py-1.5 rounded-md shadow bg-[var(--tw-button-primary)] text-white cursor-pointer'}
                        onClick={handleRemoveFile}
                        disabled={!preview && !fileName}
                    >
                        Remove
                    </button>
                </div>
                {fileName && <p className={'text-sm text-gray-700'}>{fileName}</p>}
                <p className={'text-sm text-gray-500'}>{label}</p>
            </div>
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={type === "image" ? "image/*" : "*"}
                onChange={handleFileChange}
            />
        </div>
    );
};