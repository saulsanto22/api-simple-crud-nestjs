import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "generated/prisma";


// @Injectable()

export class UserService {

    constructor(
        protected prismaService: PrismaService
    ) { }

    async createUser(userData: CreateUserDto): Promise<User> {

        const existingUser = await this.getUserByEmail(userData.email)

        if (existingUser) {
            throw new NotFoundException('User already exists')
        }

        const user = await this.prismaService.user.create({
            data: userData
        })

        return user;


    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.prismaService.user.findUnique({ where: { email } })
        return user
    }

    async getAllUsers(): Promise<User[]> {
        const user = await this.prismaService.user.findMany()
        return user
    }

    async getUserById(id: number): Promise<User | null> {
        const user = await this.prismaService.user.findUnique({ where: { id } })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async updateUser(id: number, userData: Partial<CreateUserDto>): Promise<User | null> {

        const userExists = await this.prismaService.user.findUnique({ where: { id } })
        if (!userExists) {

            throw new NotFoundException('User not found')

        }
        const user = await this.prismaService.user.update({ where: { id }, data: userData })
        return user
    }

    async deleteUser(id: number): Promise<User | null> {
        const userExists = await this.prismaService.user.findUnique({ where: { id } })
        if (!userExists) {
            throw new NotFoundException('User not found')
        }
        const user = await this.prismaService.user.delete({ where: { id } })
        return user
    }
}