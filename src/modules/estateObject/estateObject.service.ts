import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateEstateObjectDto } from './dto/create-estateObject.dto'
import { FilterEstateObjectDto } from './dto/filter-estateObject.dto'
import { UpdateEstateObjectDto } from './dto/update-estateObject.dto'

@Injectable()
export class EstateObjectService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateEstateObjectDto) {
		// Перевірка унікальності назви в межах parent
		const exists = await this.prisma.estateObject.findFirst({
			where: { name: dto.name, parentId: dto.parentId ?? null },
		})
		if (exists)
			throw new ConflictException(
				'Назва вже існує в межах цього рівня ієрархії'
			)
		return this.prisma.estateObject.create({ data: { ...dto } })
	}

	async findAll(filter: FilterEstateObjectDto) {
		return this.prisma.estateObject.findMany({
			where: {
				name: filter.name
					? { contains: filter.name, mode: 'insensitive' }
					: undefined,
				type: filter.type,
				societyId: filter.societyId,
				ownerIds: filter.ownerId ? { has: filter.ownerId } : undefined,
			},
			orderBy: { name: 'asc' },
		})
	}

	async findOne(id: string) {
		const object = await this.prisma.estateObject.findUnique({ where: { id } })
		if (!object) throw new NotFoundException()
		return object
	}

	async update(id: string, dto: UpdateEstateObjectDto) {
		return this.prisma.estateObject.update({ where: { id }, data: { ...dto } })
	}

	async remove(id: string) {
		return this.prisma.estateObject.delete({ where: { id } })
	}
}
