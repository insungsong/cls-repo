import { PostStatus } from '@libs/common/constant/post-status.type';
import { PostType } from '@libs/common/constant/post.type';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  JoinColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatEntity } from './chat.entity';
import { SpaceEntity } from './space.entity';

@Entity('post')
export class PostEntity extends BaseEntity {
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

  @Column({ name: 'user_id', comment: '작성한 user의 id' })
  userId!: string;

  @Column({ name: 'anonymous', default: false, comment: '익명 여부' })
  anonymous: boolean;

  @Column({ name: 'space_id', type: 'uuid' })
  spaceId!: string;

  @Column({ name: 'type', type: 'varchar', length: 255, comment: 'post 타입' })
  type: PostType;

  @Column({ name: 'content', comment: '게시글 내용' })
  content: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 255,
    comment: 'Post status',
  })
  status: PostStatus;

  @CreateDateColumn({
    name: 'created_at',
    comment: '생성일',
    update: false,
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: '수정일',
  })
  updatedAt!: Date;

  @ManyToOne(() => SpaceEntity, (space) => space.posts, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'space_id', referencedColumnName: 'id' })
  space: Promise<SpaceEntity>;

  @OneToMany(() => ChatEntity, (chat) => chat.post)
  chats: Promise<ChatEntity[]>;
}
