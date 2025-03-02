import {MainPage} from "@/components/Views/MainPage.tsx";
import {Heading} from "@/components/Views/component/Heading.tsx";
import {CustomTable} from "@/components/Views/component/CustomTable.tsx";

export const TeacherView = () => {
    return (
        <MainPage>
            <Heading heading="Teacher View"/>
            <div>Filter Section</div>
            <CustomTable></CustomTable>
        </MainPage>
    );
};