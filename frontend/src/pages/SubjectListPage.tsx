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
            full_marks: z.coerce.number().int().min(1, "Full mark is required"),
            pass_marks: z.coerce.number().int().min(1, "Pass mark is required"),
        })
    )
});

type tSubjectSchema = z.infer<typeof subjectSchema>;

export type tApiData = {
    id: string;
    name: string;
    subjects: {
        id: string;
        name: string;
        full_marks: number;
        pass_marks: number;
    }[];
}

export function SubjectListPage() {
    const [open, setOpen] = useState(false);
    const [apiData, setApiData] = useState<tApiData[]>([]);

    const fetchData = () => {
        console.log("Fetching data...");
        AxiosInstance.get("/api/academic/subject/")
            .then((response) => {
                const data = response.data;
                setApiData(data);
            })
            .catch(() => {
                toast.error("Failed to fetch subjects");
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
            subjects: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "subjects",
    });

    const onSubmit = (data: tSubjectSchema) => {
        console.log(data);
        AxiosInstance.post('api/academic/subject/', data)
            .then(() => {
                toast.success('Subject added successfully');
            })
            .catch((err) => {
                console.log(err)
                toast.error('Failed to add subject');
            })
            .finally(() => {
                setOpen(false);
                fetchData();
            });
    };

    const addSubjectRow = () => {
        append({ id: "", name: "", full_marks: 0, pass_marks: 0 });
    };

    const removeSubjectRow = (index: number) => {
        remove(index);
    };

    const handleAddClassDropdownChange = (value: string) => {
        if (value) {
            const selectedClass = apiData.find((cls) => cls.id === value);
            if (selectedClass) {
                const subjects = selectedClass.subjects.map((subject) => ({
                    id: subject.id,
                    name: subject.name,
                    full_marks: subject.full_marks,
                    pass_marks: subject.pass_marks,
                }));
                console.log(subjects);
                for (let i = fields.length - 1; i >= 0; i--) {
                    remove(i);
                }
                subjects.forEach((subject) => {
                    append(subject);
                });
            }
        }
    }

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
                                            <Select
                                                value={field.value || undefined}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    handleAddClassDropdownChange(value);
                                                }}>
                                            <SelectTrigger className={`w-full ${errors.selectedClass ? 'border-red-500' : ''}`}>
                                                    <SelectValue placeholder="Select a class" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {apiData.map((cls) => (
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

                            <div className="space-y-4 max-h-[200px] overflow-y-scroll scrollbar">
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
                                                name={`subjects.${index}.full_marks`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder=""
                                                        className={`w-full ${errors?.subjects?.[index]?.full_marks ? 'border-red-500 focus:border-red-500' : ''}`}
                                                    />
                                                )}
                                            />
                                            {errors?.subjects?.[index]?.full_marks && <span className="text-red-500 text-sm">{errors.subjects[index].full_marks.message}</span>}
                                        </div>
                                        <div className="col-span-3">
                                            <Controller
                                                name={`subjects.${index}.pass_marks`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder=""
                                                        className={`w-full ${errors?.subjects?.[index]?.pass_marks ? 'border-red-500' : ''}`}
                                                    />
                                                )}
                                            />
                                            {errors?.subjects?.[index]?.pass_marks && <span className="text-red-500 text-sm">{errors.subjects[index].pass_marks.message}</span>}
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
