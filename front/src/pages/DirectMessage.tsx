import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar';
import { useInput } from '@hooks/useInput';
import { ChatBox, ChatList } from '@components';
import axios from 'axios';
import useSocket from '@hooks/useSocket';
import dayjs from 'dayjs';
import { Scrollbars, positionValues } from 'react-custom-scrollbars';
import { IUser, IChat, IDM } from '@typings/db';
import makeSection from '@utils/makeSection';

const DirectMessage = () => {
  const { workspace, id } = useParams();
  const [socket] = useSocket(workspace);

  const refScrollbars = useRef<Scrollbars>(null);
  const [scrollValues, setScrollValues] = useState<positionValues>();
  const { data: userData, error, mutate } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  // const {
  //   data: chatList,
  //   error: error2,
  //   mutate: mutate2,
  // } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  // const {
  //   data: chatData,
  //   error: error2,
  //   mutate: mutate2,
  // } = useSWR<IDM[] | undefined>(`/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`, fetcher);
  const { data: myData } = useSWR('/api/users', fetcher);
  const {
    data: chatData,
    error: error2,
    mutate: mutate2,
    setSize, // pape 수는 바꿔주는 역할
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`, // page를 가지고 있는 함수
    fetcher,
  );
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const [chat, setChat, onChangeChat] = useInput('');
  const onSubmit = useCallback(() => {
    console.log('메세지 전송');
    if (chat?.trim() && chatData) {
      const savedChat = chat;
      mutate2((prevChatData) => {
        prevChatData?.[0].unshift({
          id: (chatData[0][0]?.id || 0) + 1,
          content: savedChat,
          SenderId: myData.id,
          Sender: myData,
          ReceiverId: userData.id,
          Receiver: userData,
          createdAt: new Date(),
        });
        return prevChatData;
      }, false).then(() => {
        setChat('');
        setTimeout(() => {
          console.log('스크롤 이동2222');
          refScrollbars.current?.scrollToBottom();
        }, 100);
      });
      axios
        .post(
          `/api/workspaces/${workspace}/dms/${id}/chats`,
          { content: chat },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          setChat('');
          mutate2();
          refScrollbars.current?.scrollToBottom();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [chat]);
  useEffect(() => {
    socket?.on('dm', (data: number[]) => {
      // data 새로 온 DM 데이터
      console.log('메세지 수신');
      mutate2();
    });
    return () => {
      socket?.off('dm');
    };
  }, []);
  useEffect(() => {
    if (chatData?.length === 1) {
      setTimeout(() => {
        console.log('스크롤 이동111');
        refScrollbars.current?.scrollToBottom();
      }, 100);
    }
  }, [chatData]);
  console.log(chatData);
  const remakedChatData = makeSection(chatData ? [...chatData].flat().reverse() : []);
  return (
    <>
      <div className="flex items-center py-[16px] px-[20px] border-b border-b-[#eee]">
        <h3 className="flex items-center text-[18px] font-bold text-black">
          <button type="button" className="mt-[4px] flex items-center justify-center rounded-[4px] overflow-hidden">
            <img src={gravatar.url(userData?.email, { s: '24px', d: 'retro' })} alt="" />
          </button>
          <span className="ml-[10px]">{userData?.email}</span>
        </h3>
      </div>
      <ChatList
        chatData={remakedChatData}
        ref={refScrollbars}
        setScrollValues={setScrollValues}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmit={onSubmit} />
    </>
  );
};

export default DirectMessage;
