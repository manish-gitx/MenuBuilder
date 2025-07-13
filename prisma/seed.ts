import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const predefinedTags = [
  // Dietary Tags
  { name: 'Vegetarian', type: 'dietary', color: '#4CAF50', icon: '🥬' },
  { name: 'Non-Vegetarian', type: 'dietary', color: '#FF5722', icon: '🍖' },
  { name: 'Egg-Based', type: 'dietary', color: '#FFC107', icon: '🥚' },
  { name: 'Vegan', type: 'dietary', color: '#8BC34A', icon: '🌱' },
  { name: 'Gluten-Free', type: 'dietary', color: '#9C27B0', icon: '🌾' },
  { name: 'Dairy-Free', type: 'dietary', color: '#00BCD4', icon: '🥛' },
  { name: 'Nut-Free', type: 'dietary', color: '#795548', icon: '🥜' },

  // Highlight Tags
  { name: 'Signature Dish', type: 'highlight', color: '#FF6B6B', icon: '⭐' },
  { name: 'Chef Special', type: 'highlight', color: '#4ECDC4', icon: '👨‍🍳' },
  { name: 'Popular', type: 'highlight', color: '#45B7D1', icon: '🔥' },
  { name: 'New', type: 'highlight', color: '#96CEB4', icon: '✨' },

  // Spice Level Tags
  { name: 'Mild', type: 'spice_level', color: '#4CAF50', icon: '🌶️' },
  { name: 'Medium', type: 'spice_level', color: '#FF9800', icon: '🌶️🌶️' },
  { name: 'Spicy', type: 'spice_level', color: '#F44336', icon: '🌶️🌶️🌶️' },

  // Cuisine Tags
  { name: 'Indian', type: 'cuisine', color: '#FF5722', icon: '🇮🇳' },
  { name: 'Chinese', type: 'cuisine', color: '#F44336', icon: '🇨🇳' },
  { name: 'Italian', type: 'cuisine', color: '#4CAF50', icon: '🇮🇹' },
  { name: 'Continental', type: 'cuisine', color: '#2196F3', icon: '🍽️' },
  { name: 'Mexican', type: 'cuisine', color: '#FF9800', icon: '🇲🇽' },
  { name: 'Thai', type: 'cuisine', color: '#9C27B0', icon: '🇹🇭' },
  { name: 'Japanese', type: 'cuisine', color: '#607D8B', icon: '🇯🇵' },
  { name: 'Mediterranean', type: 'cuisine', color: '#795548', icon: '🫒' },
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