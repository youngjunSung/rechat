import React, { useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import autosize from 'autosize';
import gravatar from 'gravatar';
import { Mention, MentionsInput, MentionsInputClass, SuggestionDataItem } from 'react-mentions';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { IUser, IDM } from '@typings/db';

interface ChatBoxProps {
  chat: string;
  onSubmit: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder?: string;
}

export const ChatBox = ({ chat, onSubmit, onChangeChat, placeholder }: ChatBoxProps) => {
  const params = useParams();
  const refTextarea = useRef<HTMLTextAreaElement>(null);
  const {
    data: workspaceMembers,
    error: error4,
    mutate: mutate4,
  } = useSWR<IUser[] | undefined>(`/api/workspaces/${params.workspace}/members`, fetcher);
  const onKeyDownChat = (e: React.KeyboardEvent) => {
    // console.log(e);
    if (e.key === 'Enter' && e.shiftKey === false && chat.trim()) {
      // console.log(e);
      onSubmit(e);
    }
  };
  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focused: boolean,
    ): React.ReactNode => {
      if (!workspaceMembers) return;
      return (
        <button type="button" className={`w-full flex ${focused ? `bg-gray-400` : `white`}`}>
          <img src={gravatar.url(workspaceMembers[index].email, { s: '24px', d: 'retro' })} alt="" />
          <span>{highlightedDisplay}</span>
        </button>
      );
    },
    [],
  );
  useEffect(() => {
    if (refTextarea.current) {
      autosize(refTextarea.current);
    }
  }, []);
  return (
    <div className="px-[20px] pb-[20px]">
      <MentionsInput
        rows={1} // autosize 플러그인 사용 시 기본 높이 제어 속성
        inputRef={refTextarea}
        value={chat}
        onChange={onChangeChat}
        onKeyDown={onKeyDownChat}
        placeholder={placeholder}
        allowSuggestionsAboveCursor
        className="resize-none [&_textarea]:!p-[10px] p-[10px] border-[1px] border-gray-300 border-solid w-full rounded-[8px]"
      >
        <Mention
          appendSpaceOnAdd
          trigger="@"
          data={workspaceMembers?.map((v) => ({ id: v.id, display: v.nickname })) || []}
          renderSuggestion={renderSuggestion}
        />
      </MentionsInput>
    </div>
  );
};
