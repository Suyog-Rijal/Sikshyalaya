import { ChangeEvent, DragEvent, useRef, useState } from "react";

interface CustomFileInputProps {
    label?: string;
    type?: "image" | "file";
}

export const CustomFileInput = ({
                                    label = "Drag & drop or click to select file",
                                    type = "image",
                                }: CustomFileInputProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const handleFileUploadClick = () => {
        fileInputRef.current?.click();
    };

    const processFile = (file: File) => {
        setFileName(file.name);
        if (type === "image") {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        } else {
            setPreview(null);
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            processFile(event.dataTransfer.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setPreview(null);
        setFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="py-4 rounded-sm bg-white max-w-xs">
            <div className="flex items-center gap-2">
                <div
                    className={`w-16 h-16 flex items-center justify-center border border-dotted border-gray-300 rounded-sm cursor-pointer ${
                        isDragActive ? "border-blue-400" : ""
                    }`}
                    onClick={handleFileUploadClick}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {type === "image" && preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="object-cover w-full h-full rounded-sm"
                        />
                    ) : (
                        <div className="text-gray-400 text-xl">
                            {/*@ts-expect-error: IonIcon is not recognized*/}
                            <ion-icon name={type === "image" ? "image-outline" : "document-outline"}></ion-icon>
                        </div>
                    )}
                </div>
                <div className="flex gap-4">
                    <button
                        type="button"
                        className="text-sm hover:underline shadow py-1.5 px-4 rounded-md text-white bg-[var(--tw-button-primary)] cursor-pointer"
                        onClick={handleFileUploadClick}
                    >
                        Upload
                    </button>
                    <button
                        type="button"
                        className="text-sm text-red-500 hover:underline shadow py-1.5 px-4 rounded-md cursor-pointer"
                        onClick={handleRemoveFile}
                        disabled={!preview && !fileName}
                    >
                        Remove
                    </button>
                </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
                {fileName
                    ? type === "image"
                        ? `Selected image: ${fileName}`
                        : `Selected file: ${fileName}`
                    : label}
            </p>
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
