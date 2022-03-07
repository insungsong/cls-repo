import { EntityRepository, Repository } from 'typeorm';
import { SpaceRoleEntity } from '../entities/space-role.entity';

@EntityRepository(SpaceRoleEntity)
export class SpaceRoleRepository extends Repository<SpaceRoleEntity> {}
