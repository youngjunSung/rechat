import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { LogoSlack } from '@assets/icons/';
import loadable from '@loadable/component';

// 코드 스플리팅
const Login = loadable(() => import('@pages/Login'));
const Sign = loadable(() => import('@pages/Sign'));
const WorkSpace = loadable(() => import('@layouts/WorkSpace'));
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign" element={<Sign />} />
      <Route path="/workspace/:workspace" element={<WorkSpace />}>
        <Route path="channel/:channel" element={<Channel />} />
        <Route path="dm/:id" element={<DirectMessage />} />
      </Route>
    </Routes>
  );
};

export default App;
