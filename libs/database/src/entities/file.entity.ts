import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '.';

/**
 * CapaFileEntity
 */
@Entity('file')
export class FileEntity extends BaseEntity {
  /**
   * id
   *
   * @description uuid_generate_v4()
   */
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    comment: '파일 고유 아이디',
  })
  id!: string;

  /**
   * seq
   *
   * @description bigserial or nextval('<seq>'::regclass)
   */
  @Column({ name: 'seq', unique: true, comment: '순차 인덱스' })
  @Generated('increment')
  seq!: number;

  /**
   * s3Uri
   */
  @Column({ name: 's3_uri', type: 'varchar', length: 255, comment: 's3 위치' })
  s3Uri!: string;

  /**
   * fileName
   */
  @Column({
    name: 'file_name',
    type: 'varchar',
    nullable: true,
    length: 255,
    comment: '파일 명',
  })
  fileName?: string | null;

  /**
   * fileExtension
   */
  @Column({
    name: 'file_extension',
    type: 'varchar',
    nullable: true,
    length: 255,
    comment: '파일 확장자',
  })
  fileExtension?: string | null;

  /**
   * fileMimetype
   */
  @Column({
    name: 'file_mimetype',
    type: 'varchar',
    nullable: true,
    length: 255,
    comment: '파일 mimetype',
  })
  fileMimetype?: string | null;

  /**
   * filePath
   */
  @Column({
    name: 'file_path',
    type: 'varchar',
    nullable: true,
    length: 255,
    comment: '파일 경로',
  })
  filePath?: string | null;

  /**
   * description
   */
  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
    length: 255,
    comment: '파일 설명',
  })
  description?: string | null;

  /**
   * size
   */
  @Column({
    name: 'size',
    type: 'bigint',
    default: 0,
    comment: '파일 용량 in bytes',
  })
  size!: number;

  /**
   * createdAt
   */
  @CreateDateColumn({
    name: 'created_at',
    comment: '생성일',
    update: false,
  })
  createdAt!: Date;

  /**
   * updatedAt
   */
  @UpdateDateColumn({
    name: 'updated_at',
    comment: '수정일',
  })
  updatedAt!: Date;

  @OneToOne(() => UserEntity, (user) => user.file)
  userFile?: Promise<UserEntity | undefined>;
}
