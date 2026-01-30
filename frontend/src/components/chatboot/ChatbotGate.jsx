import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AiChatWidget from "@/components/chatboot/AiChatWidget";
import { getCurrentUserId } from "@/utils/authUtils";

const PRIVATE_PREFIXES = [
  "/dashboard",
  "/profile",
  "/nutrition",
  "/myprograms",
  "/create-nutrition-plan",
  "/nutrition-plans",
  "/workout"
];

export default function ChatbotGate() {
  const location = useLocation();
  const [userId, setUserId] = useState(null);

  const isPrivateRoute = useMemo(() => {
    return PRIVATE_PREFIXES.some((p) => location.pathname.startsWith(p));
  }, [location.pathname]);

useEffect(() => {
  async function load() {
    try {
      const id = await getCurrentUserId();
      setUserId(id);

      // ⚡ Reset conversationId + messages à chaque nouvel utilisateur
      localStorage.removeItem("ai_conversation_id");
      localStorage.removeItem("ai_messages");
    } catch (e) {
      setUserId(null);
    }
  }
  if (isPrivateRoute) load();
}, [isPrivateRoute]);


  if (!isPrivateRoute || !userId) return null;

  return <AiChatWidget userId={userId} />;
}
