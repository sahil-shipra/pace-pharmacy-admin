import { Fragment } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDocuments, getDocuments, uploadNewDocuments } from "../../_api";
import { toast } from "sonner";
import { isErrorResponse } from "@/types/common.api";

interface Props {
    referenceCode: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes


async function fetchDocuments(referenceCode: string) {
    const response = await getDocuments(referenceCode)
    if (isErrorResponse(response)) throw response.error
    return response.data
}

function Documents({ referenceCode }: Props) {
    const [documents, setDocuments] = useState<any[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ['patient-documents'],
        queryFn: () => fetchDocuments(referenceCode),
        enabled: Boolean(referenceCode)
    })

    const queryClient = useQueryClient()

    const { mutate: onUploadDocument, isPending } = useMutation({
        mutationFn: (data: FormData) => uploadNewDocuments(referenceCode, data),
        onSuccess() {
            toast.success("Documents uploaded successfully.")
            // Refresh related queries so latest documents are visible across the app
            queryClient.invalidateQueries({ queryKey: ['patient-documents'] })
            // Clear local selection after successful upload
            setDocuments([])
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        },
        onError() {
            toast.error("Failed to upload documents. Please try again.")
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            return;
        }

        const fileArray = Array.from(files);
        const invalidFiles: string[] = [];

        // Validate file sizes
        fileArray.forEach((file) => {
            if (file.size > MAX_FILE_SIZE) {
                invalidFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
            }
        });

        if (invalidFiles.length > 0) {
            e.target.value = "";
            return;
        }


        // Append new files to the existing list so multiple uploads are preserved
        setDocuments((prev) => [...prev, ...fileArray]);
        e.target.value = "";
    };

    const handleRemoveFile = (index: number) => {
        const updatedFiles = documents.filter((_, i) => i !== index);

        if (updatedFiles.length === 0) {
            setDocuments([]);
            return;
        }
        setDocuments(updatedFiles);
    };

    const handleUploadDocuments = () => {
        if (!documents || documents.length === 0) return;

        const formData = new FormData();
        documents.forEach((file) => {
            formData.append("documents", file);
        });

        onUploadDocument(formData);
    };


    return (
        <Fragment>
            <div className="flex flex-col gap-3">
                <h1 className="text-theme-green text-xl">Documents</h1>
            </div>

            <div>
                <div className={cn("flex items-center justify-center w-full border rounded-md p-2",
                    (documents && documents.length > 0) && "justify-between items-start gap-2",
                )}>
                    <label htmlFor="dropzone-file" className="cursor-pointer">
                        <Button
                            className="z-0 cursor-pointer h-11 hover:shadow"
                            type="button"
                            variant={'secondary'}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {(documents && documents.length > 0) ? 'Upload more' : `Upload documents`}
                        </Button>
                    </label>
                    <Input
                        ref={fileInputRef}
                        id="dropzone-file"
                        type="file"
                        accept="application/pdf,image/jpeg,image/png"
                        className="hidden"
                        multiple={true}
                        onChange={(e) => handleFileChange(e)}
                    />
                </div>
                <p className="py-0.5 text-sm font-medium text-foreground/80">PDF, JPG, PNG (Max 10MB per file)</p>

                {isLoading && <div className="flex justify-start items-center gap-2">
                    <div><Loader2 className="animate-spin size-4.5" /></div> Retrieving your documents. This may take a moment…
                </div>}
                {(isSuccess && data.docs && data.docs.length > 0) && (
                    <div className="grid grid-cols-1 gap-1">
                        {data.docs.map((file, index) => {
                            return (

                                <div
                                    key={index}
                                    className="bg-theme-green-100 p-2.5 w-fit flex justify-start items-center gap-1 rounded-lg h-11"
                                >
                                    <span className="max-w-sm truncate">{`Documents ${index + 1}`}</span>
                                    <Button
                                        variant={'ghost'}
                                        size={"icon-sm"}
                                        type="button"
                                        className="p-0.5 hover:text-green-500 hover:bg-transparent transition-colors cursor-pointer size-5"
                                        asChild
                                    > <a href={file.publicUrl} target="_blank">
                                            <Eye className="size-4" />
                                        </a>
                                    </Button>
                                    <DeleteDocument id={file.id} />
                                </div>


                            )
                        })}
                    </div>
                )}

                {documents && documents.length > 0 && (
                    <div className="space-y-3 my-3">
                        <div className="grid grid-cols-1 gap-1">
                            {documents.map((file, index) => {
                                return (

                                    <div
                                        key={index}
                                        className="bg-theme-green-100 p-2.5 w-fit flex justify-start items-center gap-1 rounded-lg h-11"
                                    >
                                        <span className="max-w-sm truncate">{file.name}</span>
                                        <span className="text-xs pl-0.5">
                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>

                                        <Button
                                            variant={'ghost'}
                                            size={"icon-sm"}
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                            className="p-0.5 hover:text-red-600 transition-colors cursor-pointer size-5"
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>


                                )
                            })}
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                className="h-9 px-4"
                                disabled={isPending || documents.length === 0}
                                onClick={handleUploadDocuments}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    "Upload selected documents"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    )
}

export default Documents


const DeleteDocument = ({ id }: { id: string }) => {
    const queryClient = useQueryClient()

    const { mutate: onRemoveDocument, isPending } = useMutation({
        mutationFn: deleteDocuments,
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['patient-documents'] })
        },
        onError() {
            toast.error("Failed to upload documents. Please try again.")
        }
    })

    return (<Fragment>
        <Button
            variant={'ghost'}
            size={"icon-sm"}
            type="button"
            onClick={() => onRemoveDocument(id)}
            className="p-0.5 hover:text-red-600 transition-colors cursor-pointer size-5"
            disabled={isPending}
        >
            {isPending ? <Loader2 className="animate-spin size-4" /> : <X className="size-4" />}
        </Button>
    </Fragment>)
}