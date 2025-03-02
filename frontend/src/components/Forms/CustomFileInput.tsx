
import { useFormContext } from "react-hook-form"
import { AlertCircle, Upload, X, File } from "lucide-react"
import {useState, useRef, useCallback, useEffect, MutableRefObject} from "react"
import type * as React from "react"

export interface CustomFileInputProps {
    label?: string
    name: string
    accept?: string
    multiple?: boolean
    maxSize?: number // in MB
    maxFiles?: number
    className?: string
    required?: boolean
}

type FileWithPreview = {
    file: File
    id: string
    preview: string
    type: "image" | "pdf" | "other"
}

export const CustomFileInput = ({
                                    label,
                                    name,
                                    accept = "image/*",
                                    multiple = false,
                                    maxSize = 5,
                                    maxFiles = 5,
                                    className = "",
                                    required = false,
                                }: CustomFileInputProps) => {
    const {
        register,
        setValue,
        setError,
        clearErrors,
        watch,
        formState: { errors },
    } = useFormContext()

    const [showTooltip, setShowTooltip] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const error = errors[name]
    const errorMessage = (error?.message as string) || ""

    const { ref, onChange, ...rest } = register(name)

    const watchedFiles = watch(name)

    const processFiles = useCallback((fileList: File | File[]): FileWithPreview[] => {
        const filesToProcess = Array.isArray(fileList) ? fileList : [fileList]

        return filesToProcess.map((file) => {
            const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
            let preview = ""
            let type: "image" | "pdf" | "other" = "other"

            if (file.type.startsWith("image/")) {
                preview = URL.createObjectURL(file)
                type = "image"
            } else if (file.type === "application/pdf") {
                type = "pdf"
            }

            return { file, id, preview, type }
        })
    }, [])

    useEffect(() => {
        if (!watchedFiles) {
            setFiles([])
            return
        }

        if (typeof watchedFiles === "object" && Object.keys(watchedFiles).length === 0) {
            setFiles([])
            return
        }

        if (Array.isArray(watchedFiles) && watchedFiles.length > 0) {
            setFiles(processFiles(watchedFiles))
        } else if (watchedFiles && !(watchedFiles instanceof FileList) && 'size' in watchedFiles) {
            setFiles(processFiles([watchedFiles]))
        } else if (Array.isArray(watchedFiles) && watchedFiles.length === 0) {
            setFiles([])
        }
    }, [watchedFiles, processFiles])

    useEffect(() => {
        return () => {
            files.forEach((file) => {
                if (file.preview) URL.revokeObjectURL(file.preview)
            })
        }
    }, [files])

    const handleFileChange = useCallback(
        (selectedFiles: FileList | null) => {
            if (!selectedFiles || selectedFiles.length === 0) return

            if (multiple && files.length + selectedFiles.length > maxFiles) {
                setError(name, {
                    type: "manual",
                    message: `Maximum of ${maxFiles} files can be uploaded.`,
                })
                return
            } else {
                clearErrors(name)
            }

            const newFilesArray: File[] = []
            const filesToProcess = multiple ? selectedFiles : [selectedFiles[0]]

            Array.from(filesToProcess).forEach((file) => {
                if (file.size > maxSize * 1024 * 1024) {
                    setError(name, {
                        type: "manual",
                        message: `File "${file.name}" size must be under ${maxSize} MB`,
                    })
                    return
                }
                newFilesArray.push(file)
            })

            if (newFilesArray.length === 0) return

            if (multiple) {
                const currentFiles = Array.isArray(watchedFiles) ? watchedFiles : []
                const updatedFiles = [...currentFiles, ...newFilesArray]
                setValue(name, updatedFiles, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                })
            } else {
                setValue(name, newFilesArray, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                })
            }
        },
        [files.length, maxFiles, maxSize, multiple, name, setValue, setError, clearErrors, watchedFiles],
    )

    const removeFile = (id: string) => {
        const fileToRemove = files.find((f) => f.id === id)
        if (!fileToRemove) return

        if (fileToRemove.preview) {
            URL.revokeObjectURL(fileToRemove.preview)
        }

        const updatedFiles = files.filter((f) => f.id !== id)
        setFiles(updatedFiles)

        if (multiple) {
            setValue(
                name,
                updatedFiles.map((f) => f.file),
                { shouldValidate: true, shouldDirty: true, shouldTouch: true },
            )
        } else {
            // Set the value as an array (empty if removed)
            setValue(name, updatedFiles.map((f) => f.file), {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            })
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const droppedFiles = e.dataTransfer.files
        handleFileChange(droppedFiles)
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className={`flex flex-col gap-1 w-full ${className}`}>
            {label && (
                <label htmlFor={name} className="text-sm text-gray-700 font-medium mb-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <div
                    className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                        isDragging ? "border-blue-400 bg-blue-50" : error ? "border-red-200" : "border-gray-200"
                    } ${files.length === 0 ? "cursor-pointer" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={files.length === 0 ? handleClick : undefined}
                >
                    <input
                        ref={(e) => {
                            ref(e)
                            if (e) {
                                (fileInputRef as MutableRefObject<HTMLInputElement | null>).current = e
                            }
                        }}
                        type="file"
                        id={name}
                        accept={accept}
                        multiple={multiple}
                        className="hidden"
                        onChange={(e) => {
                            onChange(e).then(() => handleFileChange(e.target.files))
                            handleFileChange(e.target.files)
                            if (e.target) e.target.value = ""
                        }}
                        {...rest}
                    />

                    {files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-4">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 font-medium">
                                Drag and drop your {multiple ? "files" : "file"} here
                            </p>
                            <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                            <p className="text-xs text-gray-400 mt-2">
                                {accept.replace(/,/g, ", ")} • Max {maxSize}MB
                                {multiple && ` • Up to ${maxFiles} files`}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {files.map((file) => (
                                <div key={file.id} className="flex items-center bg-gray-50 rounded p-2 gap-3">
                                    {file.type === "image" && file.preview ? (
                                        <div className="h-12 w-12 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={file.preview || "/placeholder.svg"}
                                                alt={file.file.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : file.type === "pdf" ? (
                                        <div className="h-12 w-12 flex items-center justify-center bg-red-50 rounded flex-shrink-0">
                                            <File className="h-6 w-6 text-red-500" />
                                        </div>
                                    ) : (
                                        <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded flex-shrink-0">
                                            <File className="h-6 w-6 text-gray-500" />
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-700 truncate">{file.file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeFile(file.id)
                                        }}
                                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                                        aria-label={`Remove ${file.file.name}`}
                                    >
                                        <X className="h-4 w-4 text-gray-500" />
                                    </button>
                                </div>
                            ))}

                            {multiple && files.length < maxFiles && (
                                <button
                                    type="button"
                                    onClick={handleClick}
                                    className="mt-2 text-sm text-purple-500 hover:text-purple-600 transition-colors cursor-pointer font-medium flex items-center gap-1"
                                >
                                    <Upload className="h-4 w-4" />
                                    Add more files
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <div
                        className="absolute right-3 top-3"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <AlertCircle size={16} className="text-red-500" />
                        {showTooltip && (
                            <div
                                role="tooltip"
                                className="absolute bottom-full mb-2 right-0 bg-white border border-gray-200 shadow-sm p-2 rounded text-xs text-red-600 w-max max-w-[200px] z-10"
                            >
                                {errorMessage || "This field is invalid"}
                                <div className="absolute bottom-0 translate-y-1/2 right-4 transform rotate-45 w-2 h-2 bg-white border-b border-r border-gray-200"></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
