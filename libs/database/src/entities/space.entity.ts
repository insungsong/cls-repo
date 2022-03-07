import { SpaceStatusType } from '@libs/common/constant/space-status.type';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToMany,
  JoinColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '.';
import { PostEntity } from './post.entity';
import { SpaceRoleEntity } from './space-role.entity';

@Entity('space')
export class SpaceEntity extends BaseEntity {
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

  @Column({ name: 'name', comment: 'space 이름', nullable: true })
  name?: string;

  @Column({ name: 'logo', comment: 'logo 이름', type: 'uuid', nullable: true })
  logo?: string;

  @PrimaryColumn({
    name: 'user_id',
    type: 'uuid',
    comment: 'userId',
  })
  userId?: string;

  @Column({
    name: 'manager_code',
    comment: '관리자용 입장 코드',
    nullable: true,
  })
  managerCode?: string;

  @Column({
    name: 'participant_code',
    comment: '참가자들 입장 코드',
    nullable: true,
  })
  participantCode?: string;

  @Column({
    name: 'status',
    type: 'varchar',
    comment: 'Space 생성자와 연결된 채팅방인지, Space 채팅방의 참여자인지',
  })
  status: SpaceStatusType;

  @Column({
    name: 'parents_space_id',
    type: 'uuid',
    nullable: true,
  })
  parentsSpaceId: string;

  @Column({
    name: 'space_role_id',
    type: 'uuid',
    nullable: true,
  })
  spaceRoleId: string;

  @ManyToMany(() => UserEntity, (user) => user.spaces, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  spaceUser: Promise<UserEntity>;

  @OneToMany(() => SpaceRoleEntity, (spaceRole) => spaceRole.space)
  spaceRole: Promise<SpaceRoleEntity[]>;

  @OneToMany(() => PostEntity, (post) => post.space)
  posts: Promise<PostEntity[]>;
}
