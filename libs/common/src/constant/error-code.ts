import { registerEnumType } from '@nestjs/graphql';

/**
 * CAPAErrorCode
 */

export enum ErrorCode {
  SUCCESS = 'SUCCESS',
  QUERY_ERROR = 'QUERY_ERROR',
  ERROR = 'ERROR',
  NOT_ALLOWED_USER = 'NOT_ALLOWED_USER',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  NOT_DUPLICATE_PASSWORD = 'NOT_DUPLICATE_PASSWORD',
  NOT_FOUND_USER = 'NOT_FOUND_USER',
  PASSWORD_INCORRECT = 'PASSWORD_INCORRECT',
  PROFILE_NOT_FOUNT = 'PROFILE_NOT_FOUNT',
  NOT_REGISTER_SPACE = 'NOT_REGISTER_SPACE',
  NOT_FOUND_SPACE = 'NOT_FOUND_SPACE',
  NOT_COMPARE_MANAGER_CODE = 'NOT_COMPARE_MANAGER_CODE',
  NOT_COMPARE_PARTICIPANT_CODE = 'NOT_COMPARE_PARTICIPANT_CODE',
  IS_EXIST_SPACE = 'IS_EXIST_SPACE',
  NOT_MATCHING_ADMIN_USER = 'NOT_MATCHING_ADMIN_USER',
  ADMIN_ROLE_CANNOT_BE_DELETED = 'ADMIN_ROLE_CANNOT_BE_DELETED',
  NOT_FOUND_SPACE_ROLE = 'NOT_FOUND_SPACE_ROLE',
  YOU_DO_NOT_HAVE_PERMISSION = 'YOU_DO_NOT_HAVE_PERMISSION',
  ADMINS_CAN_NOT_ANONYMOUSLY_POST_QUESTIONS = 'ADMINS_CAN_NOT_ANONYMOUSLY_POST_QUESTIONS',
  NOT_FOUND_PARTNER_SPACE = 'NOT_FOUND_PARTNER_SPACE',
  NOT_MATCHING_AUTHOR = 'NOT_MATCHING_AUTHOR',
  NOT_FOUND_POST = 'NOT_FOUND_POST',
  NOT_FOUND_PARENT_CHAT = 'NOT_FOUND_PARENT_CHAT',
  NOT_DELETE_CHAT = 'NOT_DELETE_CHAT',
}

registerEnumType(ErrorCode, {
  name: 'ErrorCode',
  description: '에러코드',
  valuesMap: {
    SUCCESS: { description: '성공' },
    QUERY_ERROR: { description: 'QUERY_ERROR' },
    ERROR: { description: '에러' },
    NOT_ALLOWED_USER: { description: '가입된 유저가 아님' },
    INVALID_TOKEN: { description: '유효하지 않은 토큰' },
    TOKEN_EXPIRED: { description: '만료된 토큰' },
    UNAUTHORIZED: { description: '허가 되지 않은 접근' },
    DUPLICATE_EMAIL: { description: '이미 존재하는 이메일' },
    NOT_DUPLICATE_PASSWORD: { description: '패스워드가 일치하지 않습니다.' },
    NOT_FOUND_USER: { description: '유저를 찾을 수 없습니다.' },
    PASSWORD_INCORRECT: { description: '올바르지 않은 비밀번호 입니다.' },
    PROFILE_NOT_FOUNT: { description: '프로필이 존재하지 않습니다.' },
    NOT_REGISTER_SPACE: { description: 'Space가 생성되지 않았습니다.' },
    NOT_FOUND_SPACE: { description: 'Space가 존재하지 않습니다.' },
    NOT_COMPARE_MANAGER_CODE: {
      description: '관리자 코드가 일치하지 않습니다.',
    },
    NOT_COMPARE_PARTICIPANT_CODE: {
      description: '참여자 코드가 일치하지 않습니다.',
    },
    IS_EXIST_SPACE: {
      description: '이미 관리자 또는 참여자로 존재합니다.',
    },
    NOT_MATCHING_ADMIN_USER: {
      description: '해당 space 생성자와 유저 정보가 일치하지 않습니다.',
    },
    ADMIN_ROLE_CANNOT_BE_DELETED: {
      description: '어드민 Role은 삭제할 수 없습니다.',
    },
    NOT_FOUND_SPACE_ROLE: {
      description: 'Space Role이 존재하지 않습니다.',
    },
    YOU_DO_NOT_HAVE_PERMISSION: {
      description: '관리자 권한이 없습니다.',
    },
    ADMINS_CAN_NOT_ANONYMOUSLY_POST_QUESTIONS: {
      description: '관리자는 질문 게시글을 익명으로 작성할 수 없습니다',
    },
    NOT_FOUND_PARTNER_SPACE: {
      description: '개설된 공간이 없습니다.',
    },
    NOT_MATCHING_AUTHOR: {
      description: '게시글을 작성한 유저가 아닙니다.',
    },
    NOT_DELETE_CHAT: {
      description: '채팅을 지울 권한이 없습니다.',
    },
  },
});
