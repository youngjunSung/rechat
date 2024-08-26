import React, { useState, useCallback, useEffect } from 'react';
import { TextField, Button } from '@components';
import { Link, Navigate } from 'react-router-dom';
import { useInput } from '@hooks/useInput';
import { LogoChat } from '@assets/icons/';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const Login = () => {
  // useSWR은 get으로 요청한 데이터를 받아와서 저장한다.
  // mutate : 내가 원할 때 SWR 호출하기
  const { data, error, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 5000, // 주기적으로 호출하지만, dedupingInterval 기간 내에는 캐시에서 불러온다
  });
  const [logInError, setLogInError] = useState(false);
  const [email, setEmail, onChangeEmail] = useInput('');
  const [password, setPassword] = useInput<string>('');

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    [email, password, data],
  );

  const onSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate();
        })
        .catch((error) => {
          setLogInError(error.response?.status === 401);
        });
    },
    [email, password],
  );

  if (data) return <Navigate to="/workspace/sleact/channel/일반" />;

  return (
    <div className="max-w-[400px] mx-auto px-[20px]">
      <h1 className="flex flex-col items-center justify-center pt-[60px] pb-[20px]">
        <LogoChat color="#444791" />
        <span className="mt-[10px] text-primary text-[20px] font-bold">ReChat</span>
        <span className="blind">Slack</span>
      </h1>
      <TextField label="이메일 주소" type="email" value={email} onChange={onChangeEmail} />
      <TextField label="비밀번호" type="password" value={password} onChange={onChangePassword} />
      {logInError && <p className="mb-[20px] mt-[-10px] text-red-500 font-normal">로그인 실패</p>}
      <Button text="로그인" onClick={onSubmit} />
      <p className="mt-[10px] text-center">
        Slack을 처음 사용하시나요?
        <Link to="/sign" className="ml-[4px] text-[#004174]">
          회원가입
        </Link>
      </p>
    </div>
  );
};

export default Login;
