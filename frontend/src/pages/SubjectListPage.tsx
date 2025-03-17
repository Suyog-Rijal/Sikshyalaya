import { PageHeader } from "@/components/ListPage/PageHeader.tsx";
import { Plus, PlusCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import AxiosInstance from "@/auth/AxiosInstance.ts";
import SubjectDataTable from "@/components/Table/SubjectDataTable.tsx";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const subjectSchema = z.object({
    selectedClass: z.string().trim().min(1, "Class is required"),
    subjects: z.array(
        z.object({
            id: z.string(),
            name: z.string().min(1, "Subject name is required"),
            full_mark: z.string().min(1, "Full mark is required"),
            pass_mark: z.string().min(1, "Pass mark is required"),
        })
    )
});

export type tApiData = {
    id: string;
    name: string;
    full_marks: number;
    pass_marks: number;
    school_class: {
        id: string;
        name: string;
    };
}

export type tClasses = {
    id: string;
    name: string;
}

export function SubjectListPage() {
    const [open, setOpen] = useState(false);
    const [apiData, setApiData] = useState<tApiData[]>([]);
    const [classes, setClasses] = useState<tClasses[]>([]);

    const fetchData = () => {
        console.log("Fetching data...");
        AxiosInstance.get("/api/academic/subject/")
            .then((response) => {
                const data = response.data;
                console.log(data);
                setApiData(data);
            })
            .catch(() => {
                toast.error("Failed to fetch subjects");
            });

        AxiosInstance.get("/api/academic/class/")
            .then((response) => {
                const data = response.data;
                console.log(data);
                setClasses(data);
            })
            .catch(() => {
                toast.error("Failed to fetch classes");
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    // React Hook Form setup
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            selectedClass: "",
            subjects: [{ id: "", name: "", full_mark: "", pass_mark: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "subjects",
    });

    const onSubmit = (data: any) => {
        AxiosInstance.post("/api/academic/subject/", {
            school_class: data.selectedClass,
            subjects: data.subjects,
        })
            .then(() => {
                toast.success("Subjects added successfully!");
                fetchData();
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to add subjects");
            })
            .finally(() => {
                setOpen(false);
            });
    };

    const addSubjectRow = () => {
        append({ id: "", name: "", full_mark: "", pass_mark: "" });
    };

    const removeSubjectRow = (index: number) => {
        remove(index);
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <PageHeader
                title="Subjects"
                breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Subjects", href: "/subject/list/" }]}
                primaryAction={{
                    label: "Add Subject",
                    onClick: () => setOpen(true),
                    icon: <PlusCircle className="h-4 w-4" />,
                }}
            />

            <SubjectDataTable data={apiData} setData={setApiData} />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[650px] p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Add New Subject</DialogTitle>
                        <DialogDescription className="text-muted-foreground">Add subjects for a specific class.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-2 items-center">
                                <Label htmlFor="class" className="text-right font-medium">
                                    Class
                                </Label>
                                <div className="col-span-3">
                                    <Controller
                                        name="selectedClass"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className={`w-full ${errors.selectedClass ? 'border-red-500' : ''}`}>
                                                    <SelectValue placeholder="Select a class" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {classes.map((cls) => (
                                                        <SelectItem key={cls.id} value={cls.id.toString()}>
                                                            {cls.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.selectedClass && <span className="text-red-500 text-sm">{errors.selectedClass.message}</span>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-12 gap-2 mb-2 px-1">
                                    <Label className="col-span-5 text-sm text-muted-foreground">Subject Name</Label>
                                    <Label className="col-span-3 text-sm text-muted-foreground">Full Mark</Label>
                                    <Label className="col-span-3 text-sm text-muted-foreground">Pass Mark</Label>
                                    <div className="col-span-1"></div>
                                </div>

                                {fields.map((subject, index) => (
                                    <div key={subject.id} className="grid grid-cols-12 gap-2 items-center">
                                        <div className="col-span-5">
                                            <Controller
                                                name={`subjects.${index}.name`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        placeholder=""
                                                        className={`w-full ${errors?.subjects?.[index]?.name ? 'border-red-500' : ''}`}
                                                    />
                                                )}
                                            />
                                            {errors?.subjects?.[index]?.name && <span className="text-red-500 text-sm">{errors.subjects[index].name.message}</span>}
                                        </div>
                                        <div className="col-span-3">
                                            <Controller
                                                name={`subjects.${index}.full_mark`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder=""
                                                        className={`w-full ${errors?.subjects?.[index]?.full_mark ? 'border-red-500 focus:border-red-500' : ''}`}
                                                    />
                                                )}
                                            />
                                            {errors?.subjects?.[index]?.full_mark && <span className="text-red-500 text-sm">{errors.subjects[index].full_mark.message}</span>}
                                        </div>
                                        <div className="col-span-3">
                                            <Controller
                                                name={`subjects.${index}.pass_mark`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder=""
                                                        className={`w-full ${errors?.subjects?.[index]?.pass_mark ? 'border-red-500' : ''}`}
                                                    />
                                                )}
                                            />
                                            {errors?.subjects?.[index]?.pass_mark && <span className="text-red-500 text-sm">{errors.subjects[index].pass_mark.message}</span>}
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeSubjectRow(index)}
                                                disabled={fields.length === 1}
                                                className="h-8 w-8 rounded-full hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={addSubjectRow}
                                type="button"
                                className="w-fit mx-auto border-dashed"
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add More Subject
                            </Button>
                        </div>

                        <DialogFooter className="gap-2 mt-6">
                            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
