import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { FileEntity } from './file.entity';
import { SpaceEntity } from './space.entity';

/**
 * CapaReferralEntity
 */
@Entity('user')
@ObjectType()
export class UserEntity extends BaseEntity {
  /**
   * id
   *
   * @description uuid_generate_v4()
   */
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: '유저 아이디',
  })
  @Field()
  id!: string;

  @Column({ name: 'seq', unique: true, comment: '순차 인덱스' })
  @Generated('increment')
  @Field()
  seq!: number;

  /**
   * email
   */
  @Column({
    name: 'email',
    type: 'varchar',
    length: 320,
    comment: '이메일 (로그인 아이디)',
  })
  @Index({
    unique: true,
  })
  email!: string;

  @Field()
  @Column({
    name: 'first_name',
    type: 'varchar',
    comment: '성',
  })
  firstName!: string;

  @Field()
  @Column({
    name: 'last_name',
    type: 'varchar',
    comment: '이름',
  })
  lastName!: string;

  /**
   * password
   */
  @Field()
  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    comment: '패스워드 argon2',
  })
  password!: string;

  @Field({ nullable: true })
  @Column({
    name: 'file_id',
    type: 'uuid',
    nullable: true,
    comment: 'fk FileEntity#id',
  })
  fileId?: string;

  /**
   * createdAt
   */
  @Field()
  @CreateDateColumn({
    name: 'created_at',
    comment: '생성일',
    update: false,
  })
  createdAt!: Date;

  /**
   * updatedAt
   */
  @Field()
  @UpdateDateColumn({
    name: 'updated_at',
    comment: '수정일',
  })
  updatedAt!: Date;

  @OneToOne(() => FileEntity, (file) => file.userFile, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'file_id', referencedColumnName: 'id' })
  file: Promise<FileEntity>;

  @ManyToMany(() => SpaceEntity, (space) => space.spaceUser)
  spaces: Promise<SpaceEntity[]>;
}
