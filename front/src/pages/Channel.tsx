import React, { useEffect, useRef, useState, useCallback } from 'react';
import WorkSpace from '../layouts/WorkSpace';
import { useParams } from 'react-router-dom';
import useSocket from '@hooks/useSocket';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import fetcher from '@utils/fetcher';
import { useInput } from '@hooks/useInput';
import { ChatBox, ChatList, TextField, Button } from '@components';
import { IUser, IDM, IChannel, IChat } from '@typings/db';
import axios from 'axios';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import { Scrollbars, positionValues } from 'react-custom-scrollbars';
import { PersonAdd } from '@mui/icons-material/';
import { Menu, MenuItem, Popover, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import makeSection from '@utils/makeSection';

const Channel = () => {
  const { workspace, channel, id } = useParams();
  const [socket] = useSocket(workspace);

  const refScrollbars = useRef<Scrollbars>(null);
  const [scrollValues, setScrollValues] = useState<positionValues>();
  const [chat, setChat, onChangeChat] = useInput('');
  const [newChannelMember, setNewChannelMember, onChangeNewChannelMember] = useInput('');
  const [openDialogInviteChannel, setOpenDialogInviteChannel] = useState(false);
  const handleDialogInviteChannelOpen = () => {
    setOpenDialogInviteChannel(true);
  };
  const handleDialogInviteChannelClose = () => {
    setOpenDialogInviteChannel(false);
  };
  const handleInviteChannel = () => {
    axios
      .post(
        `/api/workspaces/${workspace}/channels/${channel}/members`,
        { email: newChannelMember },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        setNewChannelMember('');
        handleDialogInviteChannelClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const { data: myData } = useSWR<IUser>('/api/users', fetcher);
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );
  const {
    data: chatData,
    error: error2,
    mutate: mutate2,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const onSubmit = useCallback(() => {
    console.log('메세지 전송');
    if (chat?.trim() && myData && chatData && channelData) {
      const savedChat = chat;
      mutate2((prevChatData) => {
        prevChatData?.[0].unshift({
          id: (chatData[0][0]?.id || 0) + 1,
          content: savedChat,
          UserId: myData.id,
          User: myData,
          ChannelId: channelData.id,
          Channel: channelData,
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
          `/api/workspaces/${workspace}/channels/${channel}/chats`,
          { content: chat },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          setChat('');
          mutate2();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [chat]);
  useEffect(() => {
    socket?.on('message', (data: number[]) => {
      console.log('메세지 수신');
      mutate2();
    });
    return () => {
      socket?.off('message');
    };
  }, []);
  useEffect(() => {
    if (chatData?.length === 1) {
      setTimeout(() => {
        refScrollbars.current?.scrollToBottom();
      }, 100);
    }
  }, [chatData]);
  console.log(chatData);
  const remakedChatData = makeSection(chatData ? [...chatData].flat().reverse() : []);
  console.dir(remakedChatData);
  console.log(scrollValues);
  return (
    <>
      <div className="flex items-center py-[16px] px-[20px] border-b border-b-[#eee]">
        <h3 className="text-[18px] font-bold text-black">{channel}</h3>
        <button type="button" onClick={handleDialogInviteChannelOpen} className="ml-auto center">
          <PersonAdd />
        </button>
        <Dialog
          open={openDialogInviteChannel}
          onClose={handleDialogInviteChannelClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <span className="text-[18px] text-primary font-bold">사용자 초대</span>
          </DialogTitle>
          <DialogContent>
            <TextField label="이메일" type="email" value={newChannelMember} onChange={onChangeNewChannelMember} />
          </DialogContent>
          <DialogActions>
            <Button text="초대하기" onClick={handleInviteChannel} />
          </DialogActions>
        </Dialog>
      </div>
      <div className="flex flex-col-reverse flex-1">
        <ChatList
          chatData={remakedChatData}
          ref={refScrollbars}
          setScrollValues={setScrollValues}
          setSize={setSize}
          isEmpty={isEmpty}
          isReachingEnd={isReachingEnd}
        />
      </div>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmit={onSubmit} />
    </>
  );
};

export default Channel;
