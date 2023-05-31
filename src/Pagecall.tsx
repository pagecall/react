import type { ReactElement, HTMLProps } from "react";
import React, { useMemo, useEffect } from "react";

export type PagecallMode = "meet" | "replay";

type PagecallOptions = {
  /**
   * Skip the initial page
   */
  autoproduce?: boolean;

  /**
   * DO NOT use this,
   * Only for debug
   */
  build?: string;
};

export interface PagecallProps
  extends Omit<HTMLProps<HTMLIFrameElement>, "name" | "src" | "allow"> {
  roomId: string;
  accessToken?: string;
  mode?: PagecallMode;
  onLoad?: () => void;
  onMessage?: (message: string) => void;
  onTerminate?: (reason: string) => void;
  options?: PagecallOptions;
}

const baseUrl = "https://app.pagecall.com";

export function Pagecall({
  roomId,
  accessToken,
  mode = "meet",
  onLoad,
  onMessage,
  onTerminate,
  options,
  ...props
}: PagecallProps): ReactElement {
  const url = useMemo(() => {
    const url = new URL([baseUrl, mode].join("/"));
    url.searchParams.set("room_id", roomId);
    if (accessToken) url.searchParams.set("access_token", accessToken);
    url.searchParams.set("iframe", "true");
    if (options) {
      Object.keys(options).forEach((key) => {
        const value = options[key as keyof PagecallOptions];
        if (value == null) return;
        url.searchParams.set(key, String(value));
      });
    }
    return url.toString();
  }, [mode, roomId, accessToken, options]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type !== "PagecallEvent") return;
      if (e.data.action === "loaded") onLoad?.();
      if (e.data.action === "message") onMessage?.(e.data.payload?.message);
      if (e.data.action === "terminated") onTerminate?.(e.data.payload?.reason);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onLoad, onMessage, onTerminate]);

  return (
    <iframe
      {...props}
      name="pagecall"
      src={url}
      allow="camera;microphone;display-capture"
    />
  );
}

export default Pagecall;
