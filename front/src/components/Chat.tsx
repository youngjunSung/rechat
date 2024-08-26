import React, { useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IUser, IChat, IDM } from '@typings/db';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import Scrollbars from 'react-custom-scrollbars';
import regexifyString from 'regexify-string';

export const Chat = ({ chat }: { chat: IChat | IDM }) => {
  const user = 'Sender' in chat ? chat.Sender : chat.User;
  return (
    <div className="flex items-start">
      <button type="button" className="mt-[4px] flex items-center justify-center rounded-[4px] overflow-hidden">
        <img src={gravatar.url(user.email, { s: '24px', d: 'retro' })} alt="" />
      </button>
      <div className="ml-[6px]">
        <div className="flex items-center mb-[4px]">
          <p className="text-[16px] text-black font-[600] mr-[4px]">{user.nickname}</p>
          <p className="text-[12px] text-gray-500 font-[400]">{dayjs(chat.createdAt).format('h:mm A')}</p>
        </div>
        <p>{chat.content}</p>
      </div>
    </div>
  );
};
