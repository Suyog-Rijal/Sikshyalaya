import {Form} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FormProvider, useForm} from "react-hook-form";

export function AddStaff() {
    const form = useForm();

    const onSubmit = (data) => {
        console.log(data)
    }
    return (
        <FormProvider {...form}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 bg-gray-50">

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </FormProvider>
    );
}