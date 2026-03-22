import { PrismaClient } from '@prisma/client'
import { PREDEFINED_TAGS } from '../src/lib/constants/tags'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with predefined tags...')

  await prisma.tag.deleteMany({})

  for (const tag of PREDEFINED_TAGS) {
    await prisma.tag.create({
      data: {
        name: tag.name,
        type: tag.type,
        color: tag.color,
      }
    })
  }

  console.log(`✅ Successfully seeded ${PREDEFINED_TAGS.length} tags`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
