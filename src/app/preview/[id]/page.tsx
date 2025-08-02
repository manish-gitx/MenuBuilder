"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { menuApi, Menu, categoryApi, Category } from "../../../lib/api";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import { ArrowTurnDownLeftIcon } from "@heroicons/react/24/outline";
import CategorieCard from "@/components/preview/CategorieCard";

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const [menu, setMenu] = useState<Menu | null>(null);
const[categories,setCategories]=useState<Category[] | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const getCategories = async (menuId: string) => {
      try {
        const response = await categoryApi.getCategories({
          menuId: menuId,
          includeItems: true,
        })
        setCategories(response.data)
        console.log(response.data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories(null)
      }
    }


    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await menuApi.getMenuByShareToken(id);
        await getCategories(response.data.id)
        setMenu(response.data);
        console.log(response.data)
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setError("Failed to load menu. Please check the share link.");
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
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Menu Not Found
          </h1>
          <p className="text-muted-foreground">
            The menu youre looking for doesnt exist or the share link is
            invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto ">
        <div className="px-6 py-8">
        <div className="text-start  mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {menu.name}
          </h1>
          {menu.description && <p className="text-lg ">{menu.description}</p>}
        </div>

        {/* Menu content will go here */}
        <div className="">

          <div className="flex flex-col gap-4">
            <div className="text-muted-foreground text-center text-base">
              MENU
            </div>

            <div>
              <input
                type="text"
                className="h-14 w-full rounded text-center z-0 shadow bg-[rgba(2,6,12,0.05)]"
                placeholder="Search for dishes"
              />
            </div>
          </div>
          <div className="">

          </div>



        </div>
        </div>

        <div >
          
        </div>

<div className="my-2 border-t-1 w-[calc(100%-32px)] mx-2" style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}></div>

        <div>
          <CategorieCard category={null}/>
          
        </div>
      </div>
    </div>
  );
};

export default Page;
