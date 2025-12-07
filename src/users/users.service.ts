import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/users.schema';
import { faker } from '@faker-js/faker';
import { UserQueryDto } from './dto/user-query.dto';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async onModuleInit() {
        const usersCount = await this.userModel.countDocuments();
        console.log(`Current user count: ${usersCount}`);

        if (usersCount === 0) {
            console.log('Starting seeding process...');
            const BATCH_SIZE = 5000;
            let dataToInsert: any[] = [];

            for (let i = 0; i < 30_000; i++) {
                dataToInsert.push({
                    fullName: faker.person.fullName(),
                    email: `${i}-${faker.internet.email()}`,
                    age: faker.number.int({ min: 15, max: 90 }),
                    gender: faker.helpers.arrayElement(['m', 'f']),
                });

                if (dataToInsert.length === BATCH_SIZE) {
                    await this.userModel.insertMany(dataToInsert);
                    console.log(`Inserted batch of ${BATCH_SIZE}`);
                    dataToInsert = [];
                }
            }
            console.log('Finished inserting 30,000 users');
        }
    }

    async getTotalUsers() {
        const count = await this.userModel.countDocuments();
        return { totalUsers: count };
    }

    async findAll(query: UserQueryDto) {
        const { name, age, ageFrom, ageTo, gender, page, limit } = query;

        const filter: any = {};

        if (name) {
            filter.fullName = new RegExp(name, 'i');
        }

        if (gender) {
            filter.gender = gender;
        }

        if (age) {
            filter.age = age;
        } else if (ageFrom || ageTo) {
            filter.age = {};
            if (ageFrom) filter.age.$gte = ageFrom;
            if (ageTo) filter.age.$lte = ageTo;
        }

        const skip = (page - 1) * limit;

        const users = await this.userModel
            .find(filter)
            .skip(skip)
            .limit(limit)
            .exec();

        return users;
    }
}