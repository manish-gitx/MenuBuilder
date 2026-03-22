"use client"
import React, { useState } from "react";
import Script from "next/script";
import { Category, MenuItem } from "@/lib/api";
import { themes } from "@/lib/themes";
import MidnightCategorieCard from "@/components/preview/themes/midnight/CategorieCard";

const nonVegTag = { id: "t1", name: "Non-Vegetarian", type: "dietary" as const, color: "#FF5722", icon: "🍖", createdAt: "" };
const vegTag   = { id: "t2", name: "Vegetarian",     type: "dietary" as const, color: "#4CAF50", icon: "🥬", createdAt: "" };
const chefsChoice = { id: "t3", name: "Chef's Choice", type: "highlight" as const, color: "#4ECDC4", icon: "👨‍🍳", createdAt: "" };
const spicy    = { id: "t4", name: "Spicy",           type: "highlight" as const, color: "#FF5722", icon: "🌶️", createdAt: "" };
const mild     = { id: "t5", name: "Mild",            type: "highlight" as const, color: "#4CAF50", icon: "🌿", createdAt: "" };

const now = new Date().toISOString();

function item(id: string, catId: string, name: string, desc: string, tags: typeof nonVegTag[], order: number): MenuItem {
  return { id, categoryId: catId, name, description: desc, ingredients: null, imageUrl: null, sortOrder: order, isActive: true, createdAt: now, updatedAt: now, tags };
}

const CATEGORIES: Category[] = [
  {
    id: "cat1", menuId: "m1", parentCategoryId: null, name: "Signature Biryanis",
    description: null, sortOrder: 1, isActive: true, hasSubcategories: true, createdAt: now, updatedAt: now,
    childCategories: [
      {
        id: "sub1", menuId: "m1", parentCategoryId: "cat1", name: "Non-Vegetarian Selection",
        description: null, sortOrder: 1, isActive: true, hasSubcategories: false, createdAt: now, updatedAt: now,
        menuItems: [
          item("i1",  "sub1", "Awadhi Mutton Biryani",   "Slow-cooked tender mutton layered with long-grain Basmati rice, infused with saffron, rose water, and whole spices.", [nonVegTag, chefsChoice], 1),
          item("i2",  "sub1", "Zaffrani Chicken Biryani", "Boneless chicken marinated in yogurt and spices, char-grilled and layered with saffron-kissed Basmati rice.", [nonVegTag], 2),
          item("i3",  "sub1", "Hyderabadi Dum Gosht",    "Tender lamb slow-cooked dum-style with caramelised onions, dried plums, and fragrant whole spices.", [nonVegTag, spicy], 3),
          item("i4",  "sub1", "Coastal Prawn Biryani",   "Fresh tiger prawns tossed in a coconut-chilli masala, layered with Jeera rice and curry leaves.", [nonVegTag, spicy], 4),
          item("i5",  "sub1", "Lucknowi Seekh Biryani",  "Minced lamb seekh kebabs rested over delicate Basmati, finished with crispy fried onions and mint chutney.", [nonVegTag, chefsChoice], 5),
        ],
      },
      {
        id: "sub2", menuId: "m1", parentCategoryId: "cat1", name: "Vegetarian Delights",
        description: null, sortOrder: 2, isActive: true, hasSubcategories: false, createdAt: now, updatedAt: now,
        menuItems: [
          item("i6",  "sub2", "Royal Subz Biryani",      "Seasonal exotic vegetables simmered in a rich gravy, served with aromatic Basmati and crispy onions.", [vegTag], 1),
          item("i7",  "sub2", "Paneer Makhani Biryani",  "Soft cottage cheese cubes in a velvety tomato-cream sauce, layered with saffron rice and toasted cashews.", [vegTag, mild], 2),
          item("i8",  "sub2", "Mushroom & Truffle Dum",  "Button and portobello mushrooms infused with truffle oil, layered with aromatic Basmati in a sealed handi.", [vegTag, chefsChoice], 3),
        ],
      },
    ],
  },
  {
    id: "cat2", menuId: "m1", parentCategoryId: null, name: "Kebabs & Grills",
    description: null, sortOrder: 2, isActive: true, hasSubcategories: false, createdAt: now, updatedAt: now,
    menuItems: [
      item("i9",  "cat2", "Seekh Kebab",         "Hand-minced lamb mixed with herbs and raw papaya, skewered on iron rods over live charcoal.", [nonVegTag, chefsChoice], 1),
      item("i10", "cat2", "Murgh Malai Tikka",   "Boneless chicken marinated overnight in cream cheese, saffron, and green cardamom — grilled to silky perfection.", [nonVegTag, mild], 2),
      item("i11", "cat2", "Galouti Kebab",       "Melt-in-the-mouth minced mutton patties, Lucknawi style, with over 100 ground spices, served with warqi paratha.", [nonVegTag, chefsChoice], 3),
      item("i12", "cat2", "Tandoori Jhinga",     "King-size prawns marinated in yogurt, turmeric, and ajwain — roasted in a clay tandoor until just charred.", [nonVegTag, spicy], 4),
      item("i13", "cat2", "Hara Bhara Kebab",    "Green pea and spinach patties bound with chana dal, pan-seared golden, served with mint-coriander chutney.", [vegTag, mild], 5),
      item("i14", "cat2", "Dahi ke Kebab",       "Hung yogurt and cottage cheese croquettes with cashew stuffing — crisp outside, cloud-soft inside.", [vegTag], 6),
    ],
  },
  {
    id: "cat3", menuId: "m1", parentCategoryId: null, name: "Curries & Gravies",
    description: null, sortOrder: 3, isActive: true, hasSubcategories: true, createdAt: now, updatedAt: now,
    childCategories: [
      {
        id: "sub3", menuId: "m1", parentCategoryId: "cat3", name: "Non-Vegetarian Selection",
        description: null, sortOrder: 1, isActive: true, hasSubcategories: false, createdAt: now, updatedAt: now,
        menuItems: [
          item("i15", "sub3", "Butter Chicken",        "Tender tandoor-roasted chicken in a velvety tomato-cream sauce, finished with dried fenugreek leaves.", [nonVegTag, mild], 1),
          item("i16", "sub3", "Nihari Gosht",          "Slow-braised lamb shank simmered overnight with bone marrow and whole spices — a Mughal breakfast classic.", [nonVegTag, chefsChoice], 2),
          item("i17", "sub3", "Rogan Josh",            "Kashmiri slow-cooked lamb in a scarlet sauce of dried Kashmiri chillies and whole spices, no onion no garlic.", [nonVegTag, spicy], 3),
          item("i18", "sub3", "Chettinad Chicken",     "Fiery Chettinad masala with kalpasi, marathi mokku, and freshly ground pepper — served with appam.", [nonVegTag, spicy], 4),
        ],
      },
      {
        id: "sub4", menuId: "m1", parentCategoryId: "cat3", name: "Vegetarian Delights",
        description: null, sortOrder: 2, isActive: true, hasSubcategories: false, createdAt: now, updatedAt: now,
        menuItems: [
          item("i19", "sub4", "Dal Makhani",           "Black lentils slow-cooked for 18 hours on a wood fire with butter and cream — the original Bukhara style.", [vegTag, mild], 1),
          item("i20", "sub4", "Shahi Paneer",          "Cottage cheese in a cashew and saffron gravy, subtly sweet with cardamom and rose water.", [vegTag, chefsChoice], 2),
          item("i21", "sub4", "Sarson ka Saag",        "Mustard greens slow-cooked with ginger and green chilli, topped with a pool of cultured white butter.", [vegTag], 3),
        ],
      },
    ],
  },
  {
    id: "cat4", menuId: "m1", parentCategoryId: null, name: "Breads & Accompaniments",
    description: null, sortOrder: 4, isActive: true, hasSubcategories: false, createdAt: now, updatedAt: now,
    menuItems: [
      item("i22", "cat4", "Warqi Paratha",    "Flaky, layered Mughlai bread made with refined flour, rested overnight and cooked on a hot tawa with ghee.", [vegTag], 1),
      item("i23", "cat4", "Roomali Roti",     "Tissue-thin handkerchief bread tossed high on an inverted kadai — delicate, soft, and slightly smoky.", [vegTag], 2),
      item("i24", "cat4", "Garlic Naan",      "Leavened bread studded with roasted garlic and fresh coriander, blistered in a clay tandoor at 900°C.", [vegTag, mild], 3),
      item("i25", "cat4", "Sheermal",         "Saffron-glazed mildly sweet bread baked in the tandoor — a traditional accompaniment to rich Mughal curries.", [vegTag, chefsChoice], 4),
    ],
  },
];

const tokens = themes.midnight;

export default function DemoPage() {
  const [cart, setCart] = useState<MenuItem[]>([]);
  const addToCart = (item: MenuItem) => setCart(prev => [...prev, item]);
  const removeFromCart = (item: MenuItem) => setCart(prev => prev.filter(c => c.id !== item.id));
  const isInCart = (item: MenuItem) => cart.some(c => c.id === item.id);

  return (
    <>
    <Script src="https://mcp.figma.com/mcp/html-to-design/capture.js" strategy="afterInteractive" />
    {/* Outer bg fills full viewport */}
    <div style={{ backgroundColor: "var(--preview-bg)", ...(tokens as React.CSSProperties), minHeight: "100vh", fontFamily: "var(--preview-font-family)" }}>
      {/* Mobile frame — 390px centered, full natural height */}
      <div style={{ width: 390, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{ backgroundColor: "var(--preview-surface-muted)", borderBottom: "1px solid var(--preview-border)", padding: "16px 24px" }}
        >
          <span className="text-[19px] font-bold tracking-[-0.5px] gold-shine">L&apos;ATELIER</span>
        </div>

        {/* All categories fully expanded — no scroll clipping */}
        <div style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 80 }}>
          {CATEGORIES.map((cat, i) => (
            <div key={cat.id} id={`category-${cat.id}`}>
              <MidnightCategorieCard
                category={cat}
                isLast={i === CATEGORIES.length - 1}
                isOpen={true}
                onToggle={() => {}}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                isInCart={isInCart}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
