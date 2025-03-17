import {FormEvent, useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/ListPage/PageHeader.tsx";
import { PlusCircle, X } from "lucide-react";
import ClassDataTable from "@/components/Table/ClassDataTable";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import AxiosInstance from "@/auth/AxiosInstance.ts";
import { toast } from "sonner";

const addClassSchema = z.object({
    name: z
        .string()
        .trim()
        .nonempty("Class name is required")
        .transform((val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()),

    sections: z
        .array(z.string().transform((val) =>
            val
                .trim()
                .toLowerCase()
                .charAt(0).toUpperCase() + val.slice(1)
        ))
        .default([]),
});



type tAddClass = z.infer<typeof addClassSchema>;

export function ClassListPage() {
    const [open, setOpen] = useState(false);
    const [apiData, setApiData] = useState<ClassApiResponse[]>([]);
    const [newSection, setNewSection] = useState("");
    const [buttonText, setButtonText] = useState("Save Class");
    const [currentClassId, setCurrentClassId] = useState<string | null>(null);

    type ClassApiResponse = {
        id: string;
        section: {
            id: string;
            name: string;
        }[];
        no_of_students: string;
        no_of_subjects: string;
        name: string;
    };

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<tAddClass>({
        resolver: zodResolver(addClassSchema),
        defaultValues: {
            name: "",
            sections: [],
        },
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = () => {
        AxiosInstance.get("api/academic/class/")
            .then((res) => {
                setApiData(res.data);
            })
            .catch(() => {
                toast.error("Something went wrong, please try again or contact support.");
            });
    };

    const onSubmit = (data: tAddClass) => {
        if (currentClassId) {
            const formattedData = {
                id: currentClassId,
                name: data.name,
                section: data.sections.map((sectionName) => ({ name: sectionName })),
            };
            AxiosInstance.put(`/api/academic/class/${currentClassId}/`, formattedData)
                .then(() => {
                    toast.success("Class updated successfully");
                    fetchClasses();
                    setCurrentClassId(null);
                })
                .catch((err) => {
                    console.log(formattedData);
                    console.log(err.response);
                    toast.error(err.message);
                })
                .finally(() => {
                    reset();
                    setButtonText("Save Class");
                    setOpen(false);
                });
        } else {
            const formattedData = {
                name: data.name,
                section: data.sections.map((sectionName) => ({ name: sectionName })),
            };
            AxiosInstance.post("api/academic/class/", formattedData)
                .then(() => {
                    toast.success("Class added successfully");
                    console.log(formattedData)
                    fetchClasses();
                    setOpen(false);
                })
                .catch((err) => {
                    console.log(err.response);
                    toast.error(err.response.data?.name?.[0] || 'An error occurred');
                })
                .finally(() => {
                    reset();
                });
        }
    };

    const sections = watch("sections");

    const handleAddSection = (e?: FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        if (newSection.trim() !== "" && !sections.includes(newSection.trim())) {
            setValue("sections", [...sections, newSection.trim()]);
            setNewSection("");
        }
    };

    const handleRemoveSection = (e: React.MouseEvent, sectionToRemove: string) => {
        e.stopPropagation();
        e.preventDefault();

        const updatedSections = sections.filter((section) => section !== sectionToRemove);
        setValue("sections", updatedSections, { shouldValidate: true });
    };

    const openEditDialog = (id: string) => {
        setOpen(true);
        setButtonText("Update Class");
        setCurrentClassId(id);

        const classData = apiData.find((data) => data.id === id);
        if (classData) {
            setValue("name", classData.name);
            setValue("sections", classData.section.map((section) => section.name));
        }

    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <PageHeader
                title="Classes"
                breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Classes", href: "/classes/list/" }]}
                onRefresh={fetchClasses}
                onPrint={() => console.log("Printing...")}
                onExport={() => console.log("Exporting...")}
                primaryAction={{
                    label: "Add Class",
                    onClick: () => setOpen(true),
                    icon: <PlusCircle className="h-4 w-4" />,
                }}
            />
            <ClassDataTable data={apiData} setData={setApiData} openEditDialog={openEditDialog} />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmit(onSubmit)} method={"post"}>
                        <DialogHeader>
                            <DialogTitle>Add New Class</DialogTitle>
                            <DialogDescription>
                                Create a new class with sections. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                                <Label htmlFor="name" className="sm:text-right">
                                    Class Name
                                </Label>
                                <div className="sm:col-span-3">
                                    <Input
                                        id="name"
                                        disabled={buttonText === "Update Class"}
                                        className={errors.name ? "border-red-500 focus:border-red-500" : ""}
                                        {...register("name")}
                                        placeholder="e.g. Class I, Class II"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                </div>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-4 sm:items-start sm:gap-4">
                                <Label className="sm:text-right sm:pt-2">Sections</Label>
                                <div className="sm:col-span-3 space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {sections.map((section, index) => (
                                            <Badge key={index} variant="secondary" className="px-3 py-1">
                                                {section}
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleRemoveSection(e, section)}
                                                    className="ml-1 flex items-center justify-center"
                                                    aria-label={`Remove ${section}`}
                                                >
                                                    <X className="h-3 w-3 cursor-pointer" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newSection}
                                            onChange={(e) => setNewSection(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddSection();
                                                }
                                            }}
                                            placeholder="Type section name and press Enter"
                                            className="flex-1"
                                        />
                                        <Button type="button" variant={"shadowed"} onClick={() => handleAddSection()}>
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            >
                                {buttonText}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
