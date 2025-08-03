import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const predefinedTags = [
  {
    name: "Vegetarian",
    type: "dietary",
    color: "#4CAF50",
    icon: "🥬"
  },
  {
    name: "Non-Vegetarian",
    type: "dietary",
    color: "#FF5722",
    icon: "🍖"
  },
  {
    name: "Egg-Based",
    type: "dietary",
    color: "#FFC107",
    icon: "🥚"
  },
  {
    name: "Dairy-Free",
    type: "dietary",
    color: "#00BCD4",
    icon: "🥛"
  },
  {
    name: "Chef Special",
    type: "highlight",
    color: "#4ECDC4",
    icon: "👨‍🍳"
  }
]

async function main() {
  console.log('🌱 Seeding database with predefined tags...')
  
  // Clear existing tags
  await prisma.tag.deleteMany({})
  
  // Create new tags
  for (const tag of predefinedTags) {
    await prisma.tag.create({
      data: tag
    })
  }
  
  console.log(`✅ Successfully seeded ${predefinedTags.length} tags`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 