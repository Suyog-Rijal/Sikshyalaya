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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const classes = [
    { id: 1, name: "Class 1" },
    { id: 2, name: "Class 2" },
    { id: 3, name: "Class 3" },
    { id: 4, name: "Class 4" },
    { id: 5, name: "Class 5" },
];

const subjectSchema = z.object({
    selectedClass: z.string().min(1, "Class is required"),
    subjects: z.array(
        z.object({
            id: z.number(),
            name: z.string().min(1, "Subject name is required"),
            fullMark: z.string().min(1, "Full mark is required"),
            passMark: z.string().min(1, "Pass mark is required"),
        })
    )
});

export function SubjectListPage() {
    const [open, setOpen] = useState(false);
    const [apiData, setApiData] = useState([]);
    const { control, handleSubmit, reset, setValue, watch } = useForm({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            selectedClass: "",
            subjects: [{ id: 1, name: "", fullMark: "", passMark: "" }]
        }
    });

    const subjects = watch("subjects");

    const addSubjectRow = () => {
        setValue("subjects", [...subjects, { id: subjects.length + 1, name: "", fullMark: "", passMark: "" }]);
    };

    const removeSubjectRow = (id) => {
        if (subjects.length > 1) {
            setValue("subjects", subjects.filter((subject) => subject.id !== id));
        }
    };

    const onSubmit = (data) => {
        console.log(data);
        setOpen(false);
        reset();
    };

    useEffect(() => {
        AxiosInstance.get("/api/academic/subject/")
            .then((response) => {
                setApiData(response.data);
            })
            .catch(() => {
                toast.error("Failed to fetch subjects");
            });
    }, []);

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
                                                <SelectTrigger className="w-full">
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
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-12 gap-2 mb-2 px-1">
                                    <Label className="col-span-5 text-sm text-muted-foreground">Subject Name</Label>
                                    <Label className="col-span-3 text-sm text-muted-foreground">Full Mark</Label>
                                    <Label className="col-span-3 text-sm text-muted-foreground">Pass Mark</Label>
                                    <div className="col-span-1"></div>
                                </div>

                                {subjects.map((subject, index) => (
                                    <div key={subject.id} className="grid grid-cols-12 gap-2 items-center">
                                        <div className="col-span-5">
                                            <Controller
                                                name={`subjects.${index}.name`}
                                                control={control}
                                                render={({ field }) => <Input {...field} placeholder="Subject name" className="w-full" />}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <Controller
                                                name={`subjects.${index}.fullMark`}
                                                control={control}
                                                render={({ field }) => <Input {...field} type="number" placeholder="100" className="w-full" />}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <Controller
                                                name={`subjects.${index}.passMark`}
                                                control={control}
                                                render={({ field }) => <Input {...field} type="number" placeholder="40" className="w-full" />}
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeSubjectRow(subject.id)}
                                                disabled={subjects.length === 1}
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
