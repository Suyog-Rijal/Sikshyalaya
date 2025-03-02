
import { useFormContext } from "react-hook-form"
import { useState, useRef, useCallback, useEffect, MutableRefObject } from "react"
import type * as React from "react"

interface CustomSingleFileInputV1Props {
    name: string
    maxSize?: number
    className?: string
    accept?: string
}

type ImageWithPreview = {
    file: File
    id: string
    preview: string
}

export const CustomSingleFileInputV1 = ({
                                        name,
                                        maxSize = 4,
                                        className = "",
                                        accept = "image/jpeg,image/png,image/svg+xml",
                                    }: CustomSingleFileInputV1Props) => {
    const {
        register,
        setValue,
        setError,
        clearErrors,
        watch,
        formState: { errors },
    } = useFormContext()

    const [image, setImage] = useState<ImageWithPreview | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const error = errors[name]

    const { ref, onChange, ...rest } = register(name)

    const watchedFile = watch(name)

    const processFile = useCallback((file: File): ImageWithPreview => {
        const id = `${file.name}-${Date.now()}`
        const preview = URL.createObjectURL(file)
        return { file, id, preview }
    }, [])

    useEffect(() => {
        if (!watchedFile) {
            setImage(null)
            return
        }

        if (watchedFile && !(watchedFile instanceof FileList) && 'size' in watchedFile) {
            setImage(processFile(watchedFile))
        }
    }, [watchedFile, processFile])

    useEffect(() => {
        return () => {
            if (image?.preview) URL.revokeObjectURL(image.preview)
        }
    }, [image])

    const handleFileChange = useCallback(
        (selectedFile: FileList | null) => {
            if (!selectedFile || selectedFile.length === 0) return

            const file = selectedFile[0]

            if (file.size > maxSize * 1024 * 1024) {
                setError(name, {
                    type: "manual",
                    message: `File size must be under ${maxSize} MB`,
                })
                return
            } else {
                clearErrors(name)
            }

            if (!file.type.startsWith("image/")) {
                setError(name, {
                    type: "manual",
                    message: "Only image files are allowed",
                })
                return
            }

            setValue(name, file, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            })
        },
        [maxSize, name, setValue, setError, clearErrors]
    )

    const removeFile = () => {
        if (image?.preview) {
            URL.revokeObjectURL(image.preview)
        }

        setImage(null)
        setValue(name, null, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFiles = e.dataTransfer.files
        if (droppedFiles.length > 0) {
            handleFileChange([droppedFiles[0]] as unknown as FileList)
        }
    }

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowPreview(false)
            }
        }

        if (showPreview) {
            document.addEventListener('keydown', handleEscape)
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [showPreview])

    return (
        <>
            <div className={`flex items-center gap-4 ${className}`}>
                <div
                    className={`
                        relative w-28 h-28 rounded-xl border-2 border-dashed
                        ${
                        isDragging
                            ? 'border-blue-500 bg-purple-50/50'
                            : error
                                ? 'border-red-500 bg-red-50/50'
                                : 'border-gray-200 hover:border-blue-400 bg-gray-50/50'
                    }
                    `}
                    onClick={() => image ? setShowPreview(true) : handleClick()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {image ? (
                        <div className="relative h-full w-full overflow-hidden rounded-lg">
                            <img
                                src={image.preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                <span className="text-white text-xs font-medium">Click to preview</span>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-gray-400">
                            <div
                                className="p-2 text-lg bg-gradient-to-br from-blue-500 to-blue-600 flex rounded-full text-white">
                                {/*@ts-expect-error: Ion icon not recognized*/}
                                <ion-icon name="cloud-upload-outline"></ion-icon>
                            </div>
                            <p className="text-xs text-center px-4">
                                Drag & drop or <span className='text-[#5649E8] cursor-pointer'>browse</span>
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleClick}
                            className="px-4 py-2 text-sm bg-white shadow rounded-md cursor-pointer"
                        >
                            Choose File
                        </button>
                        <button
                            type="button"
                            onClick={removeFile}
                            disabled={!image}
                            className={`
                                px-4 py-2 text-sm bg-white shadow rounded-md
                                ${
                                image
                                    ? 'border-red-200 text-red-600 hover:border-red-300 cursor-pointer'
                                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                            }
                            `}
                        >
                            Remove
                        </button>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-gray-500">
                            Supported formats: JPEG, PNG, SVG
                        </p>
                        {error && (
                            <div className="flex items-center gap-1 text-red-600 text-xs mt-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{error.message as string}</span>
                            </div>
                        )}
                    </div>
                </div>

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
                    className="hidden"
                    onChange={(e) => {
                        onChange(e).then(() => handleFileChange(e.target.files))
                        handleFileChange(e.target.files)
                        if (e.target) e.target.value = ""
                    }}
                    {...rest}
                />
            </div>

            {showPreview && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    onClick={() => setShowPreview(false)}
                >
                    <div
                        className="relative w-[90vw] max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {image && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(false)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg z-10"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6 text-gray-800"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                                <div className="w-full h-full flex items-center justify-center p-8">
                                    <img
                                        src={image.preview}
                                        alt="Full preview"
                                        className="max-w-full max-h-[80vh] object-contain rounded-lg"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
