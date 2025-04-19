import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
}
const Agent = ({ username, type, userId }: AgentProps) => {
  const isSpeaking = true;
  const callStatus = CallStatus.FINISHED;
  const messages = [
    "What's your name?",
    "What is your experience with React?",
    "Can you explain the concept of state in React?",
    "How do you handle component lifecycle in React?",
  ];
  const lastMessage = messages[messages.length - 1];

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src={"/ai-avatar.png"}
              width={65}
              height={54}
              className="object-cover"
              alt="vapi"
            />
            {isSpeaking && <span className="animate-speak"></span>}
          </div>
          <h3>Ai Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image
              src={"/user-avatar.png"}
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{username}</h3>
          </div>
        </div>
      </div>
{messages.length > 0 && 
<div className="transcript-border">
    <div className="transcript">
        <p key={lastMessage}>
            {lastMessage}
        </p>
    </div>
    </div>}      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call">
            <span
              className={cn(
                "absolute rounded-full opacity-75 animate-ping",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span>
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . . "}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div>
    </>
  );
};

export default Agent;
