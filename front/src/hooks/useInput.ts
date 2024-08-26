import { Dispatch, SetStateAction, useState, useCallback } from 'react';

type ReturnTypes<T> = [T, Dispatch<SetStateAction<T>>, (e: React.ChangeEvent<HTMLInputElement>) => void];

export const useInput = <T>(initialData: T): ReturnTypes<T> => {
  const [state, setState] = useState(initialData);
  const handler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setState(e.target.value as unknown as T);
    },
    [state],
  );
  return [state, setState, handler];
};
