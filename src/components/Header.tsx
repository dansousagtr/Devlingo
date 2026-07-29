import {useNavigate} from "@tanstack/react-router";
import { IoDiamond, IoHeart } from "react-icons/io5";
import { LogOut } from "lucide-react";
import { useAuth } from "./auth/authContexts";

const Header = () => {
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
        navigate({ to: '/signin', replace: true });
    }

    return (
        <header className="w-full bg-white h-[72px] px-6 flex items-center justify-between">
            <div className="flex items-center">
                <div className="w-9 h-9 rounded-[8px] bg-[#FFD600] flex items-center justify-center">
                    <span className="text-black font-extrabold text-sm leading-none">JS</span>
                </div>
            </div>

            <div className="flex items-center gap-8 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <IoDiamond className="text-[#3b82f6]" size={22} />
                    <span className="text-[22px] font-bold text-slate-900">20</span>
                </div>

                <div className="flex items-center gap-2">
                    <IoHeart className="text-[#ef4444]" size={22} />
                    <span className="text-lg font-semibold text-slate-900">∞</span>
                </div>

                <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="text-slate-900" size={22} />
                    <span className="text-base font-medium text-slate-900">Sair</span>
                </div>
            </div>
        </header>
    )
}

export default Header
