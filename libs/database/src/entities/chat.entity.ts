import { ChatStatus } from '@libs/common/constant';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('chat')
export class ChatEntity extends BaseEntity {
  /**
   * id
   *
   * @description uuid_generate_v4()
   */
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'Chat 아이디',
  })
  id!: string;

  @Column({ name: 'seq', unique: true, comment: '순차 인덱스' })
  @Generated('increment')
  seq!: number;

  @Column({ name: 'user_id', comment: '작성한 user의 id' })
  userId!: string;

  @Column({ name: 'post_id', comment: '게시글 id', type: 'uuid' })
  postId: string;

  @Column({ name: 'anonymous', default: false, comment: '익명 여부' })
  anonymous: boolean;

  @Column({ name: 'content', comment: '댓글 내용' })
  content: string;

  @Column({
    nullable: true,
    name: 'parents_chat_id',
    comment: '부모 댓글의 답글',
    type: 'uuid',
  })
  parentsChatId?: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 255,
    comment: 'Chat status',
  })
  status: ChatStatus;

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

  @ManyToOne(() => PostEntity, (post) => post.chats, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Promise<PostEntity>;
}
