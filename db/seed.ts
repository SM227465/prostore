import {PrismaClient} from '@prisma/client'
import sampleData from './sample-data'

const main = async() => {
const prisma = new PrismaClient()

await prisma.product.deleteMany()
await prisma.product.createMany({data: sampleData.products})
console.log('Products seeded');
}

main()