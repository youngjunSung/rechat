import React, { useState, useCallback } from 'react';
import { TextField, Button } from '@components';
import { Link, Navigate } from 'react-router-dom';
import { useInput } from '@hooks/useInput';
import { LogoChat } from '@assets/icons/';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const Sign = () => {
  const { data, error, mutate } = useSWR('/api/users', fetcher);
  const [email, setEmail, onChangeEmail] = useInput('');
  const [nickname, setNickname, onChangeNickname] = useInput<string>('');
  const [password, setPassword] = useInput<string>('');
  const [passwordCheck, setPasswordCheck] = useInput<string>('');
  const [missmatchError, setMissmatchError] = useInput(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setMissmatchError(e.target.value !== passwordCheck);
    },
    [password, passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
      setMissmatchError(e.target.value !== password);
    },
    [password, passwordCheck],
  );

  const onSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!missmatchError && nickname) {
        console.log('회원가입 시도');
        setSignUpError('');
        setSignUpSuccess(false);
        // localhost 3090(프론트)가 3095(백엔드)로 보내는 요청
        axios
          .post('/api/users', {
            email,
            nickname,
            password,
          })
          .then(() => {
            setSignUpSuccess(true);
          })
          .catch((error) => {
            console.log(error.response);
            setSignUpError(error.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, passwordCheck, missmatchError],
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
      <TextField label="닉네임" value={nickname} onChange={onChangeNickname} />
      <TextField label="비밀번호" type="password" value={password} onChange={onChangePassword} />
      <TextField label="비밀번호 확인" type="password" value={passwordCheck} onChange={onChangePasswordCheck} />
      {missmatchError && <p className="mb-[20px] mt-[-10px] text-red-500 font-normal">비밀번호가 일치하지 않습니다.</p>}
      {signUpError && <p className="mb-[20px] mt-[-10px] text-red-500 font-normal">{signUpError}</p>}
      {signUpSuccess && <p className="mb-[20px] mt-[-10px] text-blue-500 font-normal">회원가입 완료!</p>}
      <Button text="회원가입" onClick={onSubmit} />
      <p className="mt-[10px] text-center">
        이미 계정이 있으신가요?
        <Link to="/login" className="ml-[4px] text-blue-600">
          로그인
        </Link>
      </p>
    </div>
  );
};

export default Sign;
