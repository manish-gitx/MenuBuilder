"use client"

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { menuApi, Menu } from "../../../lib/api";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";

const Page = () => {
    const params = useParams();
    const id = params.id as string;
    const [menu, setMenu] = useState<Menu | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await menuApi.getMenuByShareToken(id);
                setMenu(response.data);
            } catch (err) {
                console.error('Failed to fetch menu:', err);
                setError('Failed to load menu. Please check the share link.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMenu();
        }
    }, [id]);

    if (loading) {
        return <LoadingScreen variant="light" />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Error</h1>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    if (!menu) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Menu Not Found</h1>
                    <p className="text-muted-foreground">The menu youre looking for doesnt exist or the share link is invalid.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">{menu.name}</h1>
                    {menu.description && (
                        <p className="text-lg text-muted-foreground">{menu.description}</p>
                    )}
                </div>
                
                {/* Menu content will go here */}
                <div className="text-center text-muted-foreground">
                    Menu content will be displayed here...
                </div>
            </div>
        </div>
    );
};

export default Page;