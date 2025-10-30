import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserDocument, UserModel } from './user.schema';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async save(user: User): Promise<User> {
    const primitives = user.toPrimitives();
    
    const existingUser = await this.userModel.findOne({ id: primitives.id });
    
    if (existingUser) {
      await this.userModel.updateOne(
        { id: primitives.id },
        { $set: primitives },
      );
    } else {
      await this.userModel.create(primitives);
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ id }).exec();
    
    if (!doc) {
      return null;
    }

    return this.toDomain(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    
    if (!doc) {
      return null;
    }

    return this.toDomain(doc);
  }

  async findAll(): Promise<User[]> {
    const docs = await this.userModel.find().exec();
    return docs.map(doc => this.toDomain(doc));
  }

  async delete(id: string): Promise<void> {
    await this.userModel.deleteOne({ id }).exec();
  }

  private toDomain(doc: UserDocument): User {
    return User.reconstitute(
      doc.id,
      doc.email,
      doc.password,
      doc.name,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}