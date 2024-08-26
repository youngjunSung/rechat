import React, { useRef, useCallback, useMemo, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { IUser, IChat, IDM } from '@typings/db';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import { Scrollbars, positionValues } from 'react-custom-scrollbars';
import regexifyString from 'regexify-string';
import { Chat } from '@components';

interface ChatListProps {
  chatData: { [key: string]: (IDM | IChat)[] };
  setScrollValues: React.Dispatch<React.SetStateAction<positionValues | undefined>>;
  setSize: (size: number | ((_size: number) => number)) => Promise<(IDM[] | IChat[])[] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

export const ChatList = forwardRef(
  ({ chatData, setScrollValues, setSize, isEmpty, isReachingEnd }: ChatListProps, ref: React.LegacyRef<Scrollbars>) => {
    const refScrollbars = useRef<Scrollbars>(null);
    // const result = regexifyString({
    //   input: chatData?.content,
    //   pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
    //   decorator(match, index) {
    //     const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
    //     if (arr) {
    //       return (
    //         <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
    //           @{arr[1]}
    //         </Link>
    //       );
    //     }
    //     return <br key={index} />;
    //   },
    // });
    const handleScroll = useCallback(
      (values: positionValues) => {
        // setScrollValues(values);
        if (values.scrollTop === 0 && !isReachingEnd) {
          setSize((prevSize) => prevSize + 1).then(() => {
            const current = (refScrollbars as React.MutableRefObject<Scrollbars>)?.current;
            if (current) {
              current.scrollTop(current.getScrollHeight() - values.scrollHeight);
            }
          });
        }
        console.log(values);
      },
      [refScrollbars, isReachingEnd, setSize],
    );
    return (
      <Scrollbars ref={ref} onScrollFrame={handleScroll} autoHide>
        <div className="flex flex-col flex-1 py-[16px] px-[20px]">
          {Object.entries(chatData).map(([date, chats]) => {
            return (
              <div key={date}>
                <div className="center sticky top-[6px]">
                  <p className="px-[10px] py-[4px] border-[#eee] border-[1px] rounded-full text-[#777] text-[12px]">
                    {date}
                  </p>
                </div>
                {chats.map((chat: any, idx: number) => {
                  return <Chat key={chat.id} chat={chat} />;
                })}
              </div>
            );
          })}
        </div>
      </Scrollbars>
    );
  },
);
