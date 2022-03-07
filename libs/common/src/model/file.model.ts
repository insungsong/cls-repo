import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Many, One } from '.';

/**
 * CAPAFile
 *
 * @TODO fill description
 */
@ObjectType({ description: 'File' })
export class File {
  @ApiProperty()
  @Field(() => ID, { nullable: false, description: '' })
  fileId!: string;

  @ApiProperty()
  @Field(() => String, { nullable: true, description: '' })
  fileName?: string | null;

  @ApiProperty()
  @Field(() => String, { nullable: true, description: '' })
  fileExtension?: string | null;

  @ApiProperty()
  @Field(() => String, { nullable: true, description: '' })
  fileMimetype?: string | null;

  @ApiProperty()
  @Field(() => Number, { nullable: true, description: '파일 용량 in bytes' })
  fileSize?: number | null;
}

@ObjectType({ description: '' })
export class FileOutput extends One(File) {}

@ObjectType({ description: '' })
export class FilesOutput extends Many(File) {}
