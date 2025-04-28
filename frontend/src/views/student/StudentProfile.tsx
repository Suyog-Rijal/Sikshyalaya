"use client"

import {
    Mail,
    Phone,
    Calendar,
    MapPin,
    User,
    Users,
    School,
    Bus,
    Droplet,
    Home,
    Building,
    BookOpen,
    BadgeCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface StudentProfileProps {
    student: {
        id: string
        profile_picture?: string
        first_name: string
        last_name: string
        date_of_birth: string
        gender: string
        account_status: string
        blood_group: string
        personal_email: string
        phone_number: string
        father: string
        mother: string
        guardian?: string
        email: string
        current_address: string
        permanent_address: string
        transportation?: string
        pickup_address?: string
        previous_school?: string
        previous_school_address?: string
        created_at: string
        updated_at: string
        school: string
        section: string
        enrolled_at: string
    }
}

export function SimpleStudentProfile({ student }: StudentProfileProps) {
    // Generate initials for avatar fallback
    const getInitials = () => {
        return `${student.first_name.charAt(0)}${student.last_name.charAt(0)}`
    }

    // Format date to be more readable
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Header with basic info */}
            <Card>
                <CardHeader className="pb-0">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="flex-shrink-0">
                            <Avatar className="h-24 w-24 border-2 border-primary/10">
                                {student.profile_picture ? (
                                    <AvatarImage
                                        src={student.profile_picture || "/placeholder.svg"}
                                        alt={`${student.first_name} ${student.last_name}`}
                                    />
                                ) : (
                                    <AvatarFallback>{getInitials()}</AvatarFallback>
                                )}
                            </Avatar>
                        </div>

                        <div className="flex-grow space-y-2 text-center md:text-left">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {student.first_name} {student.last_name}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                      {student.school}, Section {student.section}
                  </span>
                                    <span>•</span>
                                    <span>ID: {student.id}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                                <Badge
                                    variant="outline"
                                    className={`${
                                        student.account_status.toLowerCase() === "active"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-red-50 text-red-700 border-red-200"
                                    }`}
                                >
                                    <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                                    {student.account_status}
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    <Droplet className="h-3.5 w-3.5 mr-1" />
                                    {student.blood_group}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <User className="h-5 w-5 mr-2 text-primary" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Full Name</p>
                                        <p className="font-medium">
                                            {student.first_name} {student.last_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Gender</p>
                                        <p className="font-medium">{student.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                                        <p className="font-medium flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            {formatDate(student.date_of_birth)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Blood Group</p>
                                        <p className="font-medium">{student.blood_group}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium flex items-center gap-1">
                                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                            {student.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Personal Email</p>
                                        <p className="font-medium flex items-center gap-1">
                                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                            {student.personal_email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phone Number</p>
                                        <p className="font-medium flex items-center gap-1">
                                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                            {student.phone_number}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Enrolled At</p>
                                        <p className="font-medium">{formatDate(student.enrolled_at)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Family Information */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-primary" />
                                    Family Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Father</p>
                                    <p className="font-medium">{student.father}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Mother</p>
                                    <p className="font-medium">{student.mother}</p>
                                </div>
                                {student.guardian && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Guardian</p>
                                        <p className="font-medium">{student.guardian}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Address Information */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <Home className="h-5 w-5 mr-2 text-primary" />
                                    Address Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Current Address</p>
                                    <p className="font-medium flex items-start gap-1">
                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-1" />
                                        <span>{student.current_address}</span>
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">Permanent Address</p>
                                    <p className="font-medium flex items-start gap-1">
                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-1" />
                                        <span>{student.permanent_address}</span>
                                    </p>
                                </div>
                                {student.pickup_address && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Pickup Address</p>
                                            <p className="font-medium flex items-start gap-1">
                                                <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-1" />
                                                <span>{student.pickup_address}</span>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* School Information */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <School className="h-5 w-5 mr-2 text-primary" />
                                    School Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Current School</p>
                                        <p className="font-medium">{student.school}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Section</p>
                                        <p className="font-medium">{student.section}</p>
                                    </div>
                                </div>

                                {student.previous_school && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Previous School</p>
                                            <p className="font-medium">{student.previous_school}</p>
                                        </div>
                                        {student.previous_school_address && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Previous School Address</p>
                                                <p className="font-medium flex items-start gap-1">
                                                    <Building className="h-3.5 w-3.5 text-muted-foreground mt-1" />
                                                    <span>{student.previous_school_address}</span>
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {student.transportation && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Transportation</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <Bus className="h-3.5 w-3.5 text-muted-foreground" />
                                                {student.transportation}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Example usage with mock data
export default function StudentProfilePage() {
    const mockStudent = {
        id: "ST12345",
        profile_picture: "/student-profile.jpg",
        first_name: "Alex",
        last_name: "Johnson",
        date_of_birth: "2006-06-15",
        gender: "Male",
        account_status: "Active",
        blood_group: "O+",
        personal_email: "alex.personal@example.com",
        phone_number: "+1 (555) 123-4567",
        father: "Robert Johnson",
        mother: "Sarah Johnson",
        guardian: "Robert Johnson",
        email: "alex.johnson@school.edu",
        current_address: "123 Education Lane, Learning City, 54321",
        permanent_address: "456 Family Road, Hometown, 98765",
        transportation: "School Bus #12",
        pickup_address: "123 Education Lane, Learning City, 54321",
        previous_school: "Junior High Academy",
        previous_school_address: "789 Knowledge Ave, Previous City, 12345",
        created_at: "2020-08-10T08:00:00Z",
        updated_at: "2024-05-01T10:30:00Z",
        school: "Springfield High School",
        section: "10-A",
        enrolled_at: "2020-08-10T08:00:00Z",
    }

    return <SimpleStudentProfile student={mockStudent} />
}
