import React, { useState } from "react";
import { Category } from "../../lib/api";
import { ChevronDown, ChevronUp } from "lucide-react";
import PreviewMenuItemCard from "./PreviewMenuItemCard";

const CategorieCard = ({ category }: { category: Category }) => {
  const [isOpen, setIsOpen] = useState(true);

  const renderMenuItems = (items: any[]) => {
    return items.map((item, index) => (
      <React.Fragment key={item.id}>
        <PreviewMenuItemCard item={item} />
        {index < items.length - 1 && (
          <div
            className="my-6 border-t-1 w-full mx-0"
            style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}
          ></div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <>
      <div className="px-6 py-2">
        <div className="flex justify-between mb-4">
          <div className="font-bold text-xl">{category.name}</div>
          {category.childCategories && category.childCategories.length > 0 ? null : (
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </div>
          )}
        </div>

        {isOpen && (
          <div>
            {category.menuItems && category.menuItems.length > 0 && renderMenuItems(category.menuItems)}

            {category.childCategories &&
              category.childCategories.map((childCategory, index) => (
                <div key={childCategory.id}>
                  <SubCategoryCard category={childCategory} />
                  {index < category.childCategories.length - 1 && (
                     <div
                     className="my-5 border-t-1 w-full mx-0"
                     style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}
                   ></div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="h-4  border-b-[16px] border-b-[rgba(2,6,12,0.05)]"></div>
    </>
  );
};

const SubCategoryCard = ({ category }: { category: Category }) => {
  const [isOpen, setIsOpen] = useState(true);

  const renderMenuItems = (items: any[]) => {
    return items.map((item, index) => (
      <React.Fragment key={item.id}>
        <PreviewMenuItemCard item={item} />
        {index < items.length - 1 && (
          <div
            className="my-4 border-t-1 w-full mx-0"
            style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}
          ></div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="text-base font-bold">{category.name}</div>
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {isOpen && <div>{renderMenuItems(category.menuItems || [])}</div>}
    </div>
  );
};

export default CategorieCard;
