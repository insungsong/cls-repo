import { PostStatus } from '@libs/common/constant/post-status.type';
import { EntityRepository, Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  async fetchSpacePosts(spaceId: string): Promise<PostEntity[]> {
    return await this.query(
      `
    select
	    root.user.email as email,
	    root.user.first_name as firstName,
	    root.user.last_name as lastName,
	    root.user.file_id as fileId,
	    post.id as postId,
	    post.space_id as spaceId,
	    post.content as content
    from
    	root.post post
    inner join root.space on root.space.id = post.space_id
    inner join root.user on root.user.id = root.post.user_id 
    left outer join root.file on root.file.id = root.user.file_id
    where post.space_id = '${spaceId}'
    and post.status != '${PostStatus.DELETED}'
    `,
      [],
    );
  }
  async fetchNotAnonymousPosts(
    spaceId: string,
    userId: string,
  ): Promise<PostEntity[]> {
    return await this.query(
      `
    select
	    case when p.anonymous is true and p.user_id != '${userId}' then null else u.email end as email,
	    case when p.anonymous is true and p.user_id != '${userId}' then null else u.first_name end as firstName,
	    case when p.anonymous is true and p.user_id != '${userId}' then null else u.last_name end as lastName,
	    case when p.anonymous is true and p.user_id != '${userId}' then null else u.file_id end as fileId,
	    case when p.anonymous is true and p.user_id != '${userId}' then null else p.id end as postId,
	    p.space_id as spaceId,
	    p.content as content
    from
    	root.post p
    inner join root.space s on s.id = p.space_id 
    inner join root.user u on u.id = p.user_id 
    left outer join root.file f on f.id = u.file_id
    where p.space_id = '${spaceId}'
    and post.status != '${PostStatus.DELETED}
`,
      [],
    );
  }
}
