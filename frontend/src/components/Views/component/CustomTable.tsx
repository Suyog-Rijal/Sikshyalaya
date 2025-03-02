import {ActionMenu, ActionMenuProps} from "@/components/Views/component/table/ActionMenu.tsx";
import {Avatar} from "@/components/Views/component/table/Avatar.tsx";

export const CustomTable = () => {
    const testData: ActionMenuProps = {
        items: [
            {
                id: 1,
                label: 'Edit',
                onClick: () => {
                    console.log('Edit');
                }
            },
            {
                id: 2,
                label: 'Delete',
                onClick: () => {
                    console.log('Delete');
                }
            }
        ]
    }

    return (
        <div className={'grid grid-cols-8 place-items-center'}>
            <p></p>
            <p></p>
            <p></p>
            <Avatar src={'https://via.placeholder.com/150'} alt={'Avatar'} size={'md'}></Avatar>
            <p></p>
            <p></p>
            <p></p>
            <ActionMenu items={testData.items}></ActionMenu>
        </div>
    );
};