import React from "react";
import { Category } from "../../lib/api";
import { ChevronDown, ChevronUp } from "lucide-react";

const CategorieCard = ({ category }: { category: Category }) => {
  return (
    <>
      <div>
        <div className="flex justify-between px-6 py-2">
          <div className="font-bold text-lg"> No parnet Categorie Name</div>
          <div onClick={() => console.log("open")}>
            <ChevronDown />
          </div>
        </div>
        <div className="h-4 border-b-[16px] border-b-[rgba(2,6,12,0.05)]"></div>
      </div>
      

      <div>
        <div className="px-6 py-2">
          <div className="flex justify-between mb-4">
            <div className="font-bold text-xl">Parent Categorie Name</div>
            {/* <div onClick={() => console.log("open")}>
            <ChevronDown />
          </div> doesnt exiist cuz there are child category */}
          </div>

        

          <div className="">
            <div>
              <div>
                <div className="flex justify-between mb-4">
                  <div className="text-base font-bold">Non-Veg</div>
                  <div>
                    <ChevronUp />
                  </div>
                </div>

                <div
                  className="my-6 border-t-1 w-full mx-0"
                  style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}
                ></div>

                <div className="flex justify-between">
                  <div>
                    <div className="mb-1">
                      <img
                        src="/non-veg-icon.svg"
                        alt="Non-Vegetarian"
                        className="w-6 h-6"
                      />
                    </div>

                    <div className="text-base font-bold">B.M.T Sandwich</div>

                    <div>
                      Serves 1 | Protein-enriched classic Italian B.M.T. sub
                      with a mix of tasty chicken pepperoni,
                    </div>
                  </div>

                  <div>
                    <div className="rounded-md">
                      <img
                        src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/3/11/068d3da5-df84-43f8-9cff-505b3ab924f6_e38c202f-fe77-4703-a593-e15e0b5a8e68.png_compressed"
                        alt="B.M.T Sandwich"
                        width="156px"
                        height="144px"
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <button
                        className="
          font-semibold
          text-lg
          leading-[22px]
          tracking-tight
          text-[#1ba672]
          w-[120px]
          text-center
          p-3
          rounded-lg
          bg-white
          shadow-md
        "
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="my-6 border-t-1 w-full mx-0"
                  style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}
                ></div>
                <div className="flex justify-between">
                  <div>
                    <div className="mb-1">
                      <img
                        src="/veg-icon.svg"
                        alt="Non-Vegetarian"
                        className="w-6 h-6"
                      />
                    </div>

                    <div className="text-base font-bold">B.M.T Sandwich</div>

                    <div>
                      Serves 1 | Protein-enriched classic Italian B.M.T. sub
                      with a mix of tasty chicken pepperoni,
                    </div>
                  </div>

                  <div>
                    <div className="rounded-md">
                      <img
                        src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/3/11/068d3da5-df84-43f8-9cff-505b3ab924f6_e38c202f-fe77-4703-a593-e15e0b5a8e68.png_compressed"
                        alt="B.M.T Sandwich"
                        width="156px"
                        height="144px"
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <button
                        className="
font-semibold
text-lg
leading-[22px]
tracking-tight
text-[#1ba672]
w-[120px]
text-center
p-3
rounded-lg
bg-white
shadow-md
"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
                  className="my-7 border-t-1 w-full mx-0"
                  style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}
                ></div>

          
          <div>
              <div>
                <div className="flex justify-between mb-4">
                  <div className="text-base font-bold">Veg</div>
                  <div>
                    <ChevronUp />
                  </div>
                </div>

                <div
                  className="my-6 border-t-1 w-full mx-0"
                  style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}
                ></div>

                <div className="flex justify-between">
                  <div>
                    <div className="mb-1">
                      <img
                        src="/non-veg-icon.svg"
                        alt="Non-Vegetarian"
                        className="w-6 h-6"
                      />
                    </div>

                    <div className="text-base font-bold">B.M.T Sandwich</div>

                    <div>
                      Serves 1 | Protein-enriched classic Italian B.M.T. sub
                      with a mix of tasty chicken pepperoni,
                    </div>
                  </div>

                  <div>
                    <div className="rounded-md">
                      <img
                        src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/3/11/068d3da5-df84-43f8-9cff-505b3ab924f6_e38c202f-fe77-4703-a593-e15e0b5a8e68.png_compressed"
                        alt="B.M.T Sandwich"
                        width="156px"
                        height="144px"
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <button
                        className="
          font-semibold
          text-lg
          leading-[22px]
          tracking-tight
          text-[#1ba672]
          w-[120px]
          text-center
          p-3
          rounded-lg
          bg-white
          shadow-md
        "
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="my-6 border-t-1 w-full mx-0"
                  style={{ borderColor: "rgba(2, 6, 12, 0.15)" }}
                ></div>
                <div className="flex justify-between">
                  <div>
                    <div className="mb-1">
                      <img
                        src="/veg-icon.svg"
                        alt="Non-Vegetarian"
                        className="w-6 h-6"
                      />
                    </div>

                    <div className="text-base font-bold">B.M.T Sandwich</div>

                    <div>
                      Serves 1 | Protein-enriched classic Italian B.M.T. sub
                      with a mix of tasty chicken pepperoni,
                    </div>
                  </div>

                  <div>
                    <div className="rounded-md">
                      <img
                        src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2024/3/11/068d3da5-df84-43f8-9cff-505b3ab924f6_e38c202f-fe77-4703-a593-e15e0b5a8e68.png_compressed"
                        alt="B.M.T Sandwich"
                        width="156px"
                        height="144px"
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <button
                        className="
font-semibold
text-lg
leading-[22px]
tracking-tight
text-[#1ba672]
w-[120px]
text-center
p-3
rounded-lg
bg-white
shadow-md
"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        
        

        

        <div className="h-4 border-b-[16px] border-b-[rgba(2,6,12,0.05)]"></div>
      </div>

      
      
    </>
  );
};

export default CategorieCard;
