import {useEffect} from "react";
import {useAuthStore} from "@/store/AuthStore.ts";

export function Logout() {
    const {logout} = useAuthStore();
    useEffect(() => {
        console.log('Er aer logging out')
        logout();
        window.location.href = '/login';
    })
    return (
        <></>
    );
}