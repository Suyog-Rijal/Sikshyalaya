"use client"

import { PageHeader } from "@/components/ListPage/PageHeader.tsx"
import { PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import AxiosInstance from "@/auth/AxiosInstance.ts"
import { toast } from "sonner"
import RoutineDataTable from "@/components/Table/RoutineDataTable.tsx"
import {RoutineFormDialog} from "@/components/Table/AddRoutineDialog.tsx";

export function RoutineListPage() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [editId, setEditId] = useState<string | undefined>(undefined)
    const [apiData, setApiData] = useState<
        {
            id: string
            school_class: {
                id: string
                name: string
            }
            section: {
                id: string
                name: string
            }
            subject: {
                id: string
                name: string
            }
            teacher: {
                id: string
                name: string
            }
            day: string
            start_time: string
            end_time: string
        }[]
    >([])

    const fetchRoutines = () => {
        setLoading(true)
        AxiosInstance.get("/api/academic/routine/")
            .then((response) => {
                setApiData(response.data)
            })
            .catch((error) => {
                console.error(error)
                toast.error("Failed to fetch routine data")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchRoutines()
    }, [])

    const handleOpenEditDialog = (id: string) => {
        setEditId(id)
        setOpen(true)
    }

    const handleOpenAddDialog = () => {
        setEditId(undefined)
        setOpen(true)
    }

    const handleDialogSuccess = () => {
        fetchRoutines()
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <PageHeader
                title="Routine"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Routine", href: "/routine/list/" },
                ]}
                primaryAction={{
                    label: "Add new routine",
                    onClick: handleOpenAddDialog,
                    icon: <PlusCircle className="h-4 w-4" />,
                }}
            />

            <RoutineDataTable data={apiData} setData={setApiData} openEditDialog={handleOpenEditDialog} loading={loading} />

            <RoutineFormDialog open={open} onOpenChange={setOpen} editId={editId} onSuccess={handleDialogSuccess} />
        </div>
    )
}

