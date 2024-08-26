import { useState } from 'react';

export function useRefresher() {
  const [counter, setCounter] = useState(0);

  const refresh = () => {
    setCounter((counter) => counter + 1);
  };

  return { refresh, refreshCounter: counter };
}
