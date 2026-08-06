import {useNavigate} from "@tanstack/react-router";
import { useState } from 'react';
import { IoDiamond, IoHeart } from "react-icons/io5";
import { LogOut } from "lucide-react";
import { useAuth } from "./auth/authContexts";
import { supabase } from '../services/supabaseClient';

const Header = () => {
    const navigate = useNavigate();
    const { user, signOut, loading, setUserTotalXp } = useAuth();
    const [loadingXp, setLoadingXp] = useState(false);

    const handleLogout = async () => {
        await signOut();
        navigate({ to: '/signin', replace: true });
    }

    const renderXp = () => {
        if (loading || loadingXp) {
            return (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-200 border-t-transparent animate-spin" aria-hidden="true" />
            )
        }

        // If user exists but total_xp is missing, attempt to load it directly from Supabase
        // Use loadingXp to prevent multiple simultaneous fetches (no separate refreshAttempted flag)
        if (user && (user.total_xp === undefined || user.total_xp === null)) {
            if (!loadingXp) {
                setLoadingXp(true);
                void (async () => {
                    try {
                        const { data: profileData, error: profileError } = await supabase
                            .from('user_profiles')
                            .select('total_xp')
                            .eq('id', user.id)
                            .maybeSingle();

                        if (profileError) {
                            console.warn('Header: erro ao buscar total_xp:', profileError);
                        } else if (profileData) {
                            const total = Number(profileData.total_xp ?? 0);
                            try { setUserTotalXp(total); } catch (e) { /* ignore */ }
                        }
                    } catch (err) {
                        console.warn('Header: erro ao buscar total_xp:', err);
                    } finally {
                        setLoadingXp(false);
                    }
                })();

                return (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-200 border-t-transparent animate-spin" aria-hidden="true" />
                )
            }

            return <span className="text-[22px] font-bold text-slate-900">0</span>
        }

        // ensure we display a number (if undefined, show 0)
        const xp = typeof user?.total_xp === 'number' ? user!.total_xp : (user?.total_xp ? Number(user.total_xp) : 0)
        return <span className="text-[22px] font-bold text-slate-900">{xp}</span>
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
                    {renderXp()}
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
