import { useState } from "react";
import { useAsync } from "react-use";

export default function useLoadMetadata(path: string) {
  const [metadata, setMetadata] = useState<any>()

  useAsync(async () => {
    if (!path) return;

    setMetadata(await import(path));
  }, [path]);

  return metadata;
}
