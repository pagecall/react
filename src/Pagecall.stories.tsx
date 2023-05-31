import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import Pagecall from "./Pagecall";
import type { PagecallMode } from "./Pagecall";

function PagecallExample() {
  const [roomId, setRoomId] = useState("");
  const [enteredMode, setEnteredMode] = useState<PagecallMode | null>(null);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!enteredMode) setLoaded(false);
  }, [enteredMode]);

  if (!enteredMode) {
    return (
      <div>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID"
        />
        <div style={{ display: "flex", marginTop: 8 }}>
          <button type="button" onClick={() => setEnteredMode("meet")}>
            Meet
          </button>
          <button
            type="button"
            style={{ marginLeft: 8 }}
            onClick={() => setEnteredMode("replay")}
          >
            Replay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <Pagecall
        roomId={roomId}
        mode={enteredMode}
        style={{ width: "100%", height: "100%" }}
        onLoad={() => {
          console.log("Loaded");
          setLoaded(true);
        }}
        onTerminate={(reason) => {
          console.log("Terminated with reason", reason);
          setEnteredMode(null);
        }}
      />
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "yellow",
            color: "navy",
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
}

storiesOf("Pagecall", module).add("Example", () => <PagecallExample />);
