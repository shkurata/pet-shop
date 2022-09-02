import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { Pet } from './models/pet.model';

@Injectable()
export class PetsService {
  petRepository: Repository<Pet>;

  constructor(private dataSource: DataSource) {
    this.petRepository = this.dataSource.getRepository(Pet);
  }

  create(createPetInput: CreatePetInput) {
    return this.petRepository.save(createPetInput);
  }

  findAll() {
    return this.petRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} pet`;
  }

  update(id: number, updatePetInput: UpdatePetInput) {
    return `This action updates a #${id} pet`;
  }

  remove(id: number) {
    return `This action removes a #${id} pet`;
  }
}
