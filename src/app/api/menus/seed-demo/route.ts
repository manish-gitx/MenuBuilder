import { NextRequest } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleError, generateShareToken } from '@/lib/utils'

// POST /api/menus/seed-demo
// Creates the Royal Indian Wedding demo menu for a user.
// Idempotent — skips silently if the user already has any menus.
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { 'Content-Type': 'application/json' }
      })
    }

    // Idempotency: skip if user already has menus
    const existing = await prisma.menu.count({ where: { userId } })
    if (existing > 0) {
      return successResponse(null, 'User already has menus — skipped')
    }

    // Resolve email from Clerk
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const userEmail = user.emailAddresses[0]?.emailAddress ?? ''

    // ── 1. Menu ──────────────────────────────────────────────────────────────
    const menu = await prisma.menu.create({
      data: {
        name: 'Royal Indian Wedding Menu',
        description: 'A grand celebration menu inspired by the rich culinary traditions of India — featuring vibrant starters, aromatic mains, indulgent desserts, and refreshing drinks.',
        isPublic: true,
        theme: 'midnight',
        userId,
        userEmail,
        shareToken: generateShareToken(),
      }
    })

    // ── 2. Tags (fetch IDs by name) ───────────────────────────────────────────
    const tagRows = await prisma.tag.findMany({ select: { id: true, name: true } })
    const T: Record<string, string> = {}
    for (const t of tagRows) T[t.name] = t.id

    const VEG  = T['Vegetarian']
    const NON  = T['Non-Vegetarian']
    const SPICY = T['Spicy']
    const CHEF  = T['Chef Special']
    const JAIN  = T['Jain']

    // ── 3. Categories + sub-categories + items ────────────────────────────────
    type ItemSeed = {
      name: string; description: string; ingredients: string
      imageUrl: string; sortOrder: number; tags: string[]
    }
    type SubCatSeed = { name: string; description: string; sortOrder: number; items: ItemSeed[] }
    type CatSeed    = { name: string; description: string; sortOrder: number; subs: SubCatSeed[] }

    const schema: CatSeed[] = [
      {
        name: 'Welcome Drinks', description: 'Refreshing drinks to greet your guests', sortOrder: 1,
        subs: [
          {
            name: 'Cold Drinks', description: 'Chilled beverages to cool and refresh', sortOrder: 1,
            items: [
              { name: 'Rose Sharbat', description: 'A chilled, fragrant rose drink garnished with basil seeds and a hint of cardamom.', ingredients: 'Rose syrup, basil seeds (sabja), chilled water, cardamom, lemon', imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80', sortOrder: 1, tags: [VEG, JAIN] },
              { name: 'Mango Lassi', description: 'Thick, creamy yoghurt blended with ripe Alphonso mangoes and a touch of saffron.', ingredients: 'Alphonso mango pulp, full-fat yoghurt, sugar, saffron, cardamom', imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80', sortOrder: 2, tags: [VEG] },
              { name: 'Jaljeera Cooler', description: 'A tangy, spiced cumin-and-mint cooler served over ice — a beloved North Indian welcome drink.', ingredients: 'Roasted cumin, mint, tamarind water, black salt, chaat masala, lemon', imageUrl: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=600&q=80', sortOrder: 3, tags: [VEG, JAIN] },
            ]
          },
        ]
      },
      {
        name: 'Starters & Chaat', description: 'Street-style snacks and appetizers served at the entrance', sortOrder: 2,
        subs: [
          {
            name: 'Veg Starters', description: 'Tandoor-grilled and fried vegetarian starters', sortOrder: 1,
            items: [
              { name: 'Paneer Tikka', description: 'Succulent cubes of cottage cheese marinated in a smoky yoghurt-spice blend, grilled in the tandoor until charred.', ingredients: 'Paneer, hung curd, ginger-garlic paste, red chilli, garam masala, mustard oil, bell peppers, onion', imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80', sortOrder: 1, tags: [VEG, CHEF] },
              { name: 'Aloo Tikki Chaat', description: 'Golden potato cakes topped with chickpea curry, whipped yoghurt, and a tangle of crispy sev.', ingredients: 'Potato, chickpea curry, yoghurt, tamarind chutney, green chutney, sev, pomegranate seeds', imageUrl: 'https://images.unsplash.com/photo-1626777553635-be342a958a25?w=600&q=80', sortOrder: 2, tags: [VEG] },
            ]
          },
          {
            name: 'Non-Veg Starters', description: 'Succulent meat starters from the tandoor', sortOrder: 2,
            items: [
              { name: 'Chicken Tikka', description: 'Tender chicken pieces marinated overnight in Kashmiri chilli and yoghurt, roasted in a clay tandoor for deep smokiness.', ingredients: 'Chicken thigh, Kashmiri chilli, hung curd, ginger-garlic paste, lemon, carom seeds, mustard oil', imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80', sortOrder: 1, tags: [NON, SPICY] },
              { name: 'Seekh Kebab', description: 'Minced lamb and spices hand-pressed onto skewers and grilled over charcoal — rich, juicy, and aromatic.', ingredients: 'Minced lamb, onion, green chilli, coriander, garam masala, raw papaya, charcoal', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', sortOrder: 2, tags: [NON, SPICY, CHEF] },
            ]
          },
          {
            name: 'Chaat Corner', description: 'Live street-style chaat made fresh to order', sortOrder: 3,
            items: [
              { name: 'Pani Puri', description: 'Crispy hollow puris filled with spiced mashed potato and tamarind water — the ultimate Indian street food experience.', ingredients: 'Semolina puris, boiled potato, chickpeas, tamarind chutney, spiced mint water, chaat masala', imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&q=80', sortOrder: 1, tags: [VEG, SPICY] },
              { name: 'Dahi Bhalla', description: 'Soft lentil dumplings soaked in chilled yoghurt, drizzled with sweet tamarind and spicy mint chutneys.', ingredients: 'Urad dal dumplings, chilled yoghurt, tamarind chutney, mint chutney, cumin powder, pomegranate', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', sortOrder: 2, tags: [VEG, JAIN] },
            ]
          },
        ]
      },
      {
        name: 'Live Counters', description: 'Made fresh in front of you by our expert chefs', sortOrder: 3,
        subs: [
          {
            name: 'Live Stations', description: 'Interactive live cooking stations', sortOrder: 1,
            items: [
              { name: 'Live Dosa Counter', description: 'Thin, crispy South Indian crepes made fresh to order — served with sambar and three chutneys.', ingredients: 'Rice-lentil fermented batter, ghee, sambar, coconut chutney, tomato chutney, peanut chutney', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80', sortOrder: 1, tags: [VEG] },
              { name: 'Pav Bhaji Counter', description: 'Mumbai-style mashed vegetable curry cooked on a large iron tawa, served with buttered and toasted bread rolls.', ingredients: 'Mixed vegetables, tomato, butter, pav bhaji masala, coriander, lemon, pav bread', imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&q=80', sortOrder: 2, tags: [VEG] },
              { name: 'Chaat Counter', description: 'A spread of live chaat — papdi chaat, bhel puri, and sev puri — assembled fresh with chutneys and crispy toppings.', ingredients: 'Papdi, puffed rice, sev, boiled potato, tomato, onion, tamarind chutney, mint chutney, chaat masala', imageUrl: 'https://images.unsplash.com/photo-1626777553635-be342a958a25?w=600&q=80', sortOrder: 3, tags: [VEG] },
            ]
          },
        ]
      },
      {
        name: 'Soups', description: 'Warm and comforting soups to start your meal', sortOrder: 4,
        subs: [
          {
            name: 'Indian Soups', description: 'Spiced and fragrant Indian-style soups', sortOrder: 1,
            items: [
              { name: 'Tomato Shorba', description: 'A velvety Indian-spiced tomato consommé with ginger, cardamom, and fresh cream. Served piping hot.', ingredients: 'Tomatoes, ginger, cardamom, cloves, fresh cream, coriander, butter', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', sortOrder: 1, tags: [VEG] },
              { name: 'Mulligatawny Soup', description: 'A hearty Anglo-Indian lentil and vegetable soup seasoned with curry leaves, coconut milk, and tamarind.', ingredients: 'Red lentils, coconut milk, tamarind, curry leaves, cumin, coriander, vegetables, lemon', imageUrl: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600&q=80', sortOrder: 2, tags: [VEG] },
            ]
          },
        ]
      },
      {
        name: 'Main Course — Vegetarian', description: 'Rich and flavourful vegetarian gravies, dals, and sides', sortOrder: 5,
        subs: [
          {
            name: 'Gravies & Paneer', description: 'Rich, slow-cooked vegetarian gravies', sortOrder: 1,
            items: [
              { name: 'Shahi Paneer', description: 'Royal cottage cheese in a silky cashew-onion gravy perfumed with saffron and kewra water — fit for royalty.', ingredients: 'Paneer, cashew paste, onion, tomato, cream, saffron, kewra water, whole spices', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80', sortOrder: 1, tags: [VEG, CHEF] },
              { name: 'Palak Paneer', description: 'Fresh spinach purée cooked with spices and generously loaded with soft cottage cheese cubes.', ingredients: 'Spinach, paneer, onion, garlic, ginger, tomato, cumin, garam masala, cream', imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80', sortOrder: 2, tags: [VEG] },
              { name: 'Dum Aloo', description: 'Baby potatoes deep-fried and slow-cooked in a fiery Kashmiri-style yoghurt and fennel gravy.', ingredients: 'Baby potatoes, yoghurt, fennel powder, Kashmiri chilli, dried ginger, asafoetida, mustard oil', imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&q=80', sortOrder: 3, tags: [VEG, SPICY] },
            ]
          },
          {
            name: 'Dal & Lentils', description: 'Hearty dals and legume preparations', sortOrder: 2,
            items: [
              { name: 'Dal Makhani', description: 'Slow-cooked black lentils simmered overnight with butter, cream, and a rich tomato-based gravy. The queen of Indian dals.', ingredients: 'Whole black lentil (urad), kidney beans, butter, cream, tomato, ginger, garlic, garam masala', imageUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&q=80', sortOrder: 1, tags: [VEG, CHEF] },
              { name: 'Chana Masala', description: 'Rustic North Indian chickpeas cooked in a tangy, spiced tomato-onion gravy with a squeeze of lemon.', ingredients: 'Chickpeas, onion, tomato, ginger, garlic, chana masala spice blend, coriander, lemon', imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&q=80', sortOrder: 2, tags: [VEG, SPICY] },
            ]
          },
          {
            name: 'Sabzi', description: 'Seasonal vegetable preparations', sortOrder: 3,
            items: [
              { name: 'Mix Vegetable Sabzi', description: 'A colourful medley of seasonal vegetables tossed in a lightly spiced onion-tomato masala.', ingredients: 'Potato, carrot, beans, peas, cauliflower, onion, tomato, turmeric, cumin, coriander', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', sortOrder: 1, tags: [VEG] },
            ]
          },
        ]
      },
      {
        name: 'Main Course — Non Vegetarian', description: 'Classic non-veg curries and preparations', sortOrder: 6,
        subs: [
          {
            name: 'Chicken', description: 'Classic and royal chicken preparations', sortOrder: 1,
            items: [
              { name: 'Butter Chicken', description: "Tender chicken pieces in a velvety, mildly spiced tomato-butter sauce — India's most beloved comfort dish.", ingredients: 'Chicken, tomato, butter, cream, ginger, garlic, Kashmiri chilli, fenugreek leaves, garam masala', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80', sortOrder: 1, tags: [NON, CHEF] },
              { name: 'Hyderabadi Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken, caramelised onions, saffron milk, and sealed with dough — cooked dum style.', ingredients: 'Basmati rice, chicken, fried onion, saffron, yoghurt, whole spices, rose water, kewra, ghee', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d4f7?w=600&q=80', sortOrder: 2, tags: [NON, CHEF] },
            ]
          },
          {
            name: 'Mutton', description: 'Slow-cooked mutton and lamb dishes', sortOrder: 2,
            items: [
              { name: 'Mutton Rogan Josh', description: 'A landmark Kashmiri curry — slow-braised mutton in a deep red gravy of Kashmiri chillies and whole aromatic spices.', ingredients: 'Mutton, Kashmiri red chilli, yoghurt, whole spices (bay leaf, cloves, cinnamon, cardamom), fennel, dried ginger', imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80', sortOrder: 1, tags: [NON, SPICY, CHEF] },
            ]
          },
          {
            name: 'Seafood', description: 'Coastal-inspired seafood specialities', sortOrder: 3,
            items: [
              { name: 'Prawn Masala', description: 'Juicy prawns cooked in a coastal-style coconut-tomato masala with curry leaves and mustard seeds.', ingredients: 'Prawns, coconut milk, tomato, curry leaves, mustard seeds, red chilli, turmeric, coriander', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', sortOrder: 1, tags: [NON, SPICY] },
            ]
          },
        ]
      },
      {
        name: 'Breads & Rice', description: 'Freshly made breads and fragrant rice dishes', sortOrder: 7,
        subs: [
          {
            name: 'Breads', description: 'Freshly baked tandoor and tawa breads', sortOrder: 1,
            items: [
              { name: 'Butter Naan', description: 'Soft, fluffy leavened bread baked in a tandoor, finished with a generous slather of butter and a sprinkle of nigella seeds.', ingredients: 'All-purpose flour, yoghurt, yeast, butter, nigella seeds (kalonji)', imageUrl: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&q=80', sortOrder: 1, tags: [VEG, JAIN] },
              { name: 'Garlic Naan', description: 'Tandoor-baked naan topped with minced garlic and fresh coriander — an irresistible pairing with any curry.', ingredients: 'All-purpose flour, yoghurt, garlic, fresh coriander, butter', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80', sortOrder: 2, tags: [VEG] },
              { name: 'Laccha Paratha', description: 'Multi-layered whole wheat flatbread with a flaky, crispy texture — perfect for scooping up rich gravies.', ingredients: 'Whole wheat flour, ghee, salt', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', sortOrder: 3, tags: [VEG, JAIN] },
            ]
          },
          {
            name: 'Rice & Pulao', description: 'Fragrant rice dishes and biryanis', sortOrder: 2,
            items: [
              { name: 'Vegetable Pulao', description: 'Fragrant basmati rice cooked with whole spices and seasonal vegetables — light, aromatic, and beautifully presented.', ingredients: 'Basmati rice, peas, carrot, beans, onion, whole spices, ghee, saffron', imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80', sortOrder: 1, tags: [VEG] },
              { name: 'Steamed Basmati Rice', description: 'Long-grain aged basmati rice, perfectly steamed and served plain — an ideal companion to all curries and dals.', ingredients: 'Aged basmati rice, water, salt', imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9ef98?w=600&q=80', sortOrder: 2, tags: [VEG, JAIN] },
            ]
          },
        ]
      },
      {
        name: 'Desserts', description: 'Traditional Indian sweets and modern desserts to end on a sweet note', sortOrder: 8,
        subs: [
          {
            name: 'Traditional Sweets', description: 'Timeless Indian mithai and halwa', sortOrder: 1,
            items: [
              { name: 'Gulab Jamun', description: 'Soft milk-solid dumplings soaked in fragrant rose and cardamom sugar syrup — warm and utterly indulgent.', ingredients: 'Khoya (milk solids), flour, rose water, cardamom, saffron, sugar syrup', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', sortOrder: 1, tags: [VEG, JAIN] },
              { name: 'Gajar Halwa', description: 'Slow-cooked grated carrot fudge with milk, ghee, and sugar — topped with pistachios and silver leaf (varak).', ingredients: 'Red carrots, full-fat milk, ghee, sugar, cardamom, pistachios, cashews, silver leaf', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', sortOrder: 2, tags: [VEG, CHEF] },
              { name: 'Moong Dal Halwa', description: 'Rich, ghee-laden split yellow lentil halwa — a North Indian wedding staple with a nutty, buttery depth.', ingredients: 'Yellow moong dal, ghee, sugar, cardamom, milk, almonds, pistachios, saffron', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', sortOrder: 3, tags: [VEG, CHEF, JAIN] },
            ]
          },
          {
            name: 'Chilled Desserts', description: 'Refreshing cold sweets and frozen treats', sortOrder: 2,
            items: [
              { name: 'Rasmalai', description: 'Delicate cottage cheese patties soaked in chilled saffron-flavoured reduced milk, garnished with rose petals and pistachios.', ingredients: 'Chhena (fresh cheese), reduced milk, saffron, cardamom, rose water, pistachios, rose petals', imageUrl: 'https://images.unsplash.com/photo-1564758866811-4780aa1ab61e?w=600&q=80', sortOrder: 1, tags: [VEG, CHEF, JAIN] },
              { name: 'Kulfi Falooda', description: 'Traditional dense Indian ice cream on a stick served over vermicelli noodles, rose syrup, and basil seeds.', ingredients: 'Reduced milk, sugar, cardamom, pistachios, vermicelli, rose syrup, basil seeds (sabja)', imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80', sortOrder: 2, tags: [VEG, JAIN] },
            ]
          },
        ]
      },
    ]

    // ── 4. Persist everything ─────────────────────────────────────────────────
    for (const cat of schema) {
      const parentCat = await prisma.category.create({
        data: {
          menuId: menu.id, name: cat.name, description: cat.description,
          sortOrder: cat.sortOrder, hasSubcategories: true,
        }
      })

      for (const sub of cat.subs) {
        const subCat = await prisma.category.create({
          data: {
            menuId: menu.id, parentCategoryId: parentCat.id,
            name: sub.name, description: sub.description, sortOrder: sub.sortOrder,
          }
        })

        for (const item of sub.items) {
          await prisma.menuItem.create({
            data: {
              categoryId: subCat.id, name: item.name, description: item.description,
              ingredients: item.ingredients, imageUrl: item.imageUrl, sortOrder: item.sortOrder,
              tags: { create: item.tags.filter(Boolean).map(tagId => ({ tagId })) }
            }
          })
        }
      }
    }

    return successResponse({ menuId: menu.id }, 'Demo menu created successfully')
  } catch (error) {
    return handleError(error)
  }
}
