import React, { useState, useCallback, useEffect, ReactNode } from 'react';
import { useLocation, Navigate, Link, NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { Outlet } from 'react-router-dom';
import * as Icon from '@assets/icons';
import gravatar from 'gravatar';
import { Menu, MenuItem, Popover, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { TextField, Button } from '@components';
import { useInput } from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { IUser, IWorkspace } from '@typings/db';
import { KeyboardArrowDown, Logout } from '@mui/icons-material';

const WorkSpace = () => {
  const params = useParams();
  const [socket, disconnet] = useSocket(params.workspace);
  const { data: myLoginData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { data: myWorkspaces, error: error2, mutate: mutate2 } = useSWR<IWorkspace[]>('/api/workspaces', fetcher);
  const {
    data: channelData,
    error: error3,
    mutate: mutate3,
  } = useSWR<IWorkspace[]>(`/api/workspaces/${params.workspace}/channels`, fetcher);
  const {
    data: workspaceMembers,
    error: error4,
    mutate: mutate4,
  } = useSWR<IUser[] | undefined>(`/api/workspaces/${params.workspace}/members`, fetcher);
  const {
    data: channelMembers,
    error: error5,
    mutate: mutate6,
  } = useSWR<IUser[] | undefined>(
    params.channel ? `/api/workspaces/${params.workspace}/channels/${params.channel}/members` : null,
    fetcher,
  );
  const [newWorkspaceMember, setNewWorkspaceMember, onChangeNewWorkspaceMember] = useInput('');
  const [newChannelMember, setNewChannelMember, onChangeNewChannelMember] = useInput('');
  const [channelName, setChannelName, onChangeChannelName] = useInput('');
  const [wsName, setWsName, onChangeWsName] = useInput('');
  const [wsUrl, setWsUrl, onChangeWsUrl] = useInput('');
  const [onLineList, setOnLineList] = useState<number[]>([]);

  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
  const openMenuProfile = Boolean(anchorElProfile);

  const handleMemuProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleMenuProfileClose = () => {
    setAnchorElProfile(null);
  };

  const [anchorElWorkspace, setAnchorElWorkspace] = useState<null | HTMLElement>(null);
  const openMenuWorkspace = Boolean(anchorElWorkspace);

  const handleMemuWorkspaceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElWorkspace(event.currentTarget);
  };

  const handleMenuWorkspaceClose = () => {
    setAnchorElWorkspace(null);
  };

  const [openDialogNewWorkspace, setOpenDialogNewWorkspace] = useState(false);

  const handleDialogNewWorkspaceOpen = () => {
    setOpenDialogNewWorkspace(true);
  };

  const handleDialogNewWorkspaceClose = () => {
    setOpenDialogNewWorkspace(false);
  };

  const [openDialogInviteWorkspace, setOpenDialogInviteWorkspace] = useState(false);

  const handleDialogInviteWorkspaceOpen = () => {
    setOpenDialogInviteWorkspace(true);
  };

  const handleDialogInviteWorkspaceClose = () => {
    setOpenDialogInviteWorkspace(false);
  };

  const [openDialogNewChannel, setOpenDialogNewChannel] = useState(false);

  const handleDialogNewChannelOpen = () => {
    setOpenDialogNewChannel(true);
  };

  const handleDialogNewChannelClose = () => {
    setOpenDialogNewChannel(false);
  };

  const handleCreateWorkspace = useCallback(() => {
    if (!wsName || !wsName.trim()) return;
    if (!wsUrl || !wsUrl.trim()) return;
    axios
      .post(
        '/api/workspaces',
        { workspace: wsName, url: wsUrl },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        mutate();
        handleDialogNewWorkspaceClose();
        setWsName('');
        setWsUrl('');
      })
      .catch((error) => {
        console.log(error);
      });
  }, [wsName, wsUrl]);

  const handleInviteWorkspace = useCallback(() => {
    if (!newWorkspaceMember || !newWorkspaceMember.trim()) return;
    axios
      .post(
        `/api/workspaces/${params.workspace}/members`,
        { email: newWorkspaceMember },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        mutate4();
        handleMenuWorkspaceClose();
        handleDialogInviteWorkspaceClose();
        setNewWorkspaceMember('');
      })
      .catch((error) => {
        console.log(error);
      });
  }, [newWorkspaceMember]);

  const handleCreateChannel = useCallback(() => {
    if (!channelName || !channelName.trim()) return;
    axios
      .post(
        `/api/workspaces/${params.workspace}/channels`,
        { name: channelName },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        mutate3();
        handleMenuWorkspaceClose();
        handleDialogNewChannelClose();
        setChannelName('');
      })
      .catch((error) => {
        console.log(error);
      });
  }, [channelName]);

  const handleLogout = useCallback((e: React.MouseEvent<HTMLElement>) => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate();
      });
  }, []);

  useEffect(() => {
    if (channelData && myLoginData && socket) {
      socket.emit('login', { id: myLoginData.id, channels: channelData });
    }
  }, [channelData, myLoginData, socket]);

  useEffect(() => {
    return () => {
      disconnet();
    };
  }, [params.workspace, disconnet]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnLineList(data);
    });
    return () => {
      socket?.off('onLineList');
    };
  }, [socket]);

  console.log(socket);
  // console.log(onLineList);
  // console.log(myLoginData);
  // console.log(myWorkspaces);
  // console.log(workspaceMembers);
  // console.log(channelData);
  // console.log(channelMembers);

  if (!myLoginData) return <Navigate to="/" />;

  return (
    <div className="flex flex-col h-full bg-primary">
      <header className="flex items-center min-h-[50px] py-[6px] px-[15px]">
        <button type="button" onClick={handleLogout} className="ml-auto center p-[6px]">
          <Logout className="text-white" />
        </button>
      </header>
      <main className="flex flex-1 min-h-0">
        <div className="flex flex-col shrink-0 items-center py-[14px] px-[6px] w-[70px]">
          {myLoginData.Workspaces.map((ws) => {
            return (
              <Link
                key={ws.id}
                to={`/workspace/${ws.name}/channel/일반`}
                type="button"
                className="flex justify-center items-center rounded-[6px] bg-[#ababad] text-black text-[20px] font-bold w-[36px] h-[36px] [&:not(:last-child)]:mb-[20px]"
              >
                {ws.name.slice(0, 1).toUpperCase()}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleDialogNewWorkspaceOpen}
            className="flex justify-center items-center rounded-[6px] text-black text-[20px] font-bold w-[36px] h-[36px] [&:not(:last-child)]:mb-[20px]"
          >
            <Icon.Plus width={20} height={20} color="#fff" />
          </button>
          <Dialog
            open={openDialogNewWorkspace}
            onClose={handleDialogNewWorkspaceClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <span className="text-[18px] text-primary font-bold">워크스페이스 생성</span>
            </DialogTitle>
            <DialogContent>
              <TextField label="워크스페이스 이름" type="email" value={wsName} onChange={onChangeWsName} />
              <TextField label="워크스페이스 URL" value={wsUrl} onChange={onChangeWsUrl} />
            </DialogContent>
            <DialogActions>
              <Button text="생성하기" onClick={handleCreateWorkspace} />
            </DialogActions>
          </Dialog>
          <button
            type="button"
            onClick={handleMemuProfileClick}
            className="flex items-center justify-center mt-auto rounded-[4px] overflow-hidden"
          >
            <img src={gravatar.url(myLoginData.email, { s: '36px', d: 'retro' })} alt="" />
          </button>
          <Menu
            anchorEl={anchorElProfile}
            open={openMenuProfile}
            onClose={handleMenuProfileClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: -10,
            }}
            sx={{
              '& .MuiPaper-root': {
                width: 300,
              },
            }}
          >
            <MenuItem>
              <img src={gravatar.url(myLoginData.email, { s: '36px', d: 'retro' })} alt="" className="rounded-[4px]" />
              <div className="pl-[10px]">
                <p>{myLoginData.nickname}</p>
                <p>Active</p>
              </div>
            </MenuItem>
            <Divider />
            <MenuItem>Profile</MenuItem>
            <MenuItem>Setting</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <p>Logout</p>
            </MenuItem>
          </Menu>
        </div>
        <article className="flex flex-1 mb-[5px] mr-[5px] rounded-[8px] overflow-hidden">
          <div className="flex flex-col bg-[#f9edff1c] w-[320px]">
            <div className="py-[16px] px-[20px]">
              <button type="button" onClick={handleMemuWorkspaceClick} className="text-[18px] font-bold text-white">
                Work Space <KeyboardArrowDown />
              </button>
              <Menu
                anchorEl={anchorElWorkspace}
                open={openMenuWorkspace}
                onClose={handleMenuWorkspaceClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: -10,
                  horizontal: 'left',
                }}
                sx={{
                  '& .MuiPaper-root': {
                    width: 280,
                  },
                }}
              >
                <MenuItem>Sleact</MenuItem>
                <MenuItem onClick={handleDialogInviteWorkspaceOpen}>워크스페이스에 사용자 초대하기</MenuItem>
                <Dialog
                  open={openDialogInviteWorkspace}
                  onClose={handleDialogInviteWorkspaceClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    <span className="text-[18px] text-primary font-bold">사용자 초대</span>
                  </DialogTitle>
                  <DialogContent>
                    <TextField
                      label="이메일"
                      type="email"
                      value={newWorkspaceMember}
                      onChange={onChangeNewWorkspaceMember}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button text="초대하기" onClick={handleInviteWorkspace} />
                  </DialogActions>
                </Dialog>
                <MenuItem onClick={handleDialogNewChannelOpen}>채널 만들기</MenuItem>
                <Dialog
                  open={openDialogNewChannel}
                  onClose={handleDialogNewChannelClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    <span className="text-[18px] text-primary font-bold">채널 생성</span>
                  </DialogTitle>
                  <DialogContent>
                    <TextField
                      label="워크스페이스 이름"
                      type="text"
                      value={channelName}
                      onChange={onChangeChannelName}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button text="생성하기" onClick={handleCreateChannel} />
                  </DialogActions>
                </Dialog>
              </Menu>
            </div>
            <div className="flex-1 overflow-auto pb-[16px] px-[20px]">
              <details className="group" open>
                <summary className="flex items-center cursor-pointer py-[6px] text-[14px] text-white font-normal pl-[6px]">
                  <Icon.TriangleDown
                    width={10}
                    height={10}
                    color="#fff"
                    className="mr-[8px] rotate-[-90deg] group-open:rotate-[0deg] transition-all"
                  />{' '}
                  Channels
                </summary>
                <div className="flex flex-col ml-[26px]">
                  {channelData?.map((e, idx) => {
                    return (
                      <NavLink
                        key={e.id}
                        to={`channel/${e.name}`}
                        className={({ isActive }: { isActive: boolean }): string | undefined =>
                          isActive
                            ? 'py-[4px] text-[14px] text-white text-left font-bold underline'
                            : 'py-[4px] text-[14px] text-white text-left font-normal'
                        }
                      >
                        # {e.name}
                      </NavLink>
                    );
                  })}
                </div>
              </details>
              <details className="group" open>
                <summary className="flex items-center cursor-pointer py-[6px] text-[14px] text-white font-normal pl-[6px]">
                  <Icon.TriangleDown
                    width={10}
                    height={10}
                    color="#fff"
                    className="mr-[8px] rotate-[-90deg] group-open:rotate-[0deg] transition-all"
                  />{' '}
                  Direct Messages
                </summary>
                <div className="flex flex-col ml-[26px]">
                  {workspaceMembers?.map((member, idx) => {
                    return (
                      <Link
                        key={member.id}
                        to={`dm/${member.id}`}
                        className={`flex items-center py-[4px] text-[14px] text-white font-normal text-left`}
                      >
                        <span
                          className={`w-[8px] h-[8px] mr-[4px] rounded-full border border-white ${
                            onLineList.includes(member.id) && `bg-[#69ff37] border-none`
                          }`}
                        ></span>
                        {member.nickname}
                      </Link>
                    );
                  })}
                </div>
              </details>
            </div>
          </div>
          <div className="flex flex-col flex-1 overflow-auto bg-white">
            <Outlet />
          </div>
        </article>
      </main>
    </div>
  );
};

export default WorkSpace;
