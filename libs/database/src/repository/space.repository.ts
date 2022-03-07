import { EntityRepository, Repository } from 'typeorm';
import { SpaceEntity } from '../entities/space.entity';

@EntityRepository(SpaceEntity)
export class SpaceRepository extends Repository<SpaceEntity> {}
