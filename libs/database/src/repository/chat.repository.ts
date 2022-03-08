import { EntityRepository, Repository } from 'typeorm';
import { ChatEntity } from '../entities/chat.entity';

@EntityRepository(ChatEntity)
export class ChatRepository extends Repository<ChatEntity> {
  async fetchChats(postId: string): Promise<ChatEntity[]> {
    return await this.query(
      `
      SELECT 
      	u.email as email,
      	u.first_name as firstName,
      	u.last_name as lastName,
      	u.file_id as fileId,
      	chat.content as content,
      	chat.created_at as createdAt
      FROM root.chat chat
      INNER JOIN root.post post ON post.id = chat.post_id
      INNER JOIN root.space space ON space.id = post.space_id
      INNER JOIN root.user u ON u.id = space.user_id
      WHERE post.id = '${postId}'
      ORDER BY IF(ISNULL(chat.parents_chat_id), chat.seq, chat.parents_chat_id);
        `,
      [],
    );
  }
  async fetchNotAnonymousChats(
    postId: string,
    userId: string,
  ): Promise<ChatEntity[]> {
    return await this.query(
      `
      SELECT
        CASE WHEN chat.anonymous IS TRUE
          AND chat.user_id != '${userId}' THEN
          NULL
        ELSE
          u.email
        END AS email,
        CASE WHEN chat.anonymous IS TRUE
          AND chat.user_id != '${userId}' THEN
          NULL
        ELSE
          u.first_name
        END AS firstName,
        CASE WHEN chat.anonymous IS TRUE
          AND chat.user_id != '${userId}' THEN
          NULL
        ELSE
          u.last_name
        END AS lastName,
        CASE WHEN chat.anonymous IS TRUE
          AND chat.user_id != '${userId}' THEN
          NULL
        ELSE
          u.file_id
        END AS fileId,
        CASE WHEN chat.anonymous IS TRUE
          AND chat.user_id != '${userId}' THEN
          NULL
        ELSE
          chat.content
        END AS content,
        CASE WHEN chat.anonymous IS TRUE
          AND chat.user_id != '${userId}' THEN
          NULL
        ELSE
          chat.created_at
        END AS createdAt
    FROM
      root.chat chat
      INNER JOIN root.post post ON post.id = chat.post_id
      INNER JOIN root.space space ON space.id = post.space_id
      INNER JOIN root.user u ON u.id = space.user_id
    WHERE
      post.id = '${postId}'
    ORDER BY
      IF(ISNULL(chat.parents_chat_id), chat.seq, chat.parents_chat_id);
    `,
      [],
    );
  }
}
