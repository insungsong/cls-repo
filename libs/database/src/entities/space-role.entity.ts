import { SpaceRoleStatus } from '@libs/common/constant/space-role-status.type';
import { SpaceRoleType } from '@libs/common/constant/space-role.type';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SpaceEntity } from './space.entity';

@Entity('space_role')
export class SpaceRoleEntity extends BaseEntity {
  /**
   * id
   *
   * @description uuid_generate_v4()
   */
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: '유저 아이디',
  })
  id!: string;

  @Column({ name: 'seq', unique: true, comment: '순차 인덱스' })
  @Generated('increment')
  seq!: number;

  @Column({
    name: 'space_id',
    type: 'uuid',
  })
  spaceId!: string;

  @Column({
    name: 'role',
    type: 'varchar',
    length: 255,
    comment: '해당 침여자의 역할',
  })
  role: SpaceRoleType;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 255,
    comment: 'role 상태',
  })
  status: SpaceRoleStatus;

  @ManyToOne(() => SpaceEntity, (space) => space.spaceRole, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'space_id', referencedColumnName: 'id' })
  space: SpaceEntity;
}
