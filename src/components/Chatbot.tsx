"use client";

import Image from "next/image";
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type ApiItem = Record<string, unknown>;
type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

const API_BASE_URL = "https://quantum.tonyicon.com.ng";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

function fieldValue(item: ApiItem, keys: string[]) {
  for (const key of keys) {
    const value = item[key];
    if (value) return escapeHtml(String(value));
  }

  return escapeHtml(String(item[keys[keys.length - 1]]));
}

async function arrayFromResponse(response: Response) {
  const data: unknown = await response.json();
  return Array.isArray(data) ? (data as ApiItem[]) : [];
}

function getReply(
  msg: string,
  packages: ApiItem[],
  visas: ApiItem[],
  cars: ApiItem[],
) {
  const l = msg.toLowerCase();

  if (l.includes("hi") || l.includes("hello"))
    return "Hi! I'm Aisha 👋 Your Quantum Travels assistant. How can I help you today?";

  if (l.includes("package") || l.includes("cruise") || l.includes("holiday")) {
    if (packages.length > 0) {
      let str = "Current Packages:<br><br>";
      packages
        .slice(0, 8)
        .forEach((p) => (str += `• ${fieldValue(p, ["title", "name"])}<br>`));
      return str + "<br>Which one interests you?";
    }
  }

  if (l.includes("car") || l.includes("rental") || l.includes("hire")) {
    if (cars.length > 0) {
      let str = "Available Car Services:<br><br>";
      cars
        .slice(0, 8)
        .forEach((c) => (str += `• ${fieldValue(c, ["name", "type"])}<br>`));
      return str + "<br>Contact 0700 782 6886 for booking.";
    }
  }

  if (l.includes("visa")) {
    if (visas.length > 0) {
      let str = "Visa Packages:<br><br>";
      visas
        .slice(0, 6)
        .forEach((v) => (str += `• ${fieldValue(v, ["name", "title"])}<br>`));
      return str;
    }
  }

  return "Thank you! I can help with tour packages, visas, car rentals, flights, hotels, and more.<br><br>For immediate assistance, call <strong>0700 782 6886</strong> or email <strong>info@quantumtravelsng.com</strong>.";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [packages, setPackages] = useState<ApiItem[]>([]);
  const [visas, setVisas] = useState<ApiItem[]>([]);
  const [cars, setCars] = useState<ApiItem[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  const addMessage = useCallback((text: string, isUser: boolean) => {
    setMessages((current) => [
      ...current,
      { id: ++messageIdRef.current, text, isUser },
    ]);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadLiveData() {
      try {
        const [pRes, vRes, cRes] = await Promise.all([
          fetch(`${API_BASE_URL}/v1/site/tour-packages/holiday`),
          fetch(`${API_BASE_URL}/v1/site/visa-packages`),
          fetch(`${API_BASE_URL}/v1/site/car-services/cars`),
        ]);

        if (cancelled) return;
        if (pRes.ok) setPackages(await arrayFromResponse(pRes));
        if (vRes.ok) setVisas(await arrayFromResponse(vRes));
        if (cRes.ok) {
          const data: unknown = await cRes.json();
          const list =
            data &&
            typeof data === "object" &&
            "data" in data &&
            Array.isArray(data.data)
              ? data.data
              : data;
          setCars(Array.isArray(list) ? (list as ApiItem[]) : []);
        }
      } catch {}
    }

    loadLiveData();
    const timer = window.setTimeout(() => {
      addMessage("Hi! I'm Aisha 👋 How can I assist with your travel plans today?", false);
    }, 800);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [addMessage]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  function toggleChat() {
    setIsOpen((open) => !open);
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    addMessage(text, true);
    setInputText("");

    window.setTimeout(() => {
      addMessage(getReply(text, packages, visas, cars), false);
    }, 700);
  }

  return (
    <>
      <button
        id="chat-toggle"
        type="button"
        onClick={toggleChat}
        aria-label="Open Aisha chat"
        className="fixed right-5 bottom-5 z-[9999] h-16 w-16 cursor-pointer overflow-hidden rounded-full border-0 p-0 shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
      >
        <Image
          src="https://res.cloudinary.com/dxxavgea1/image/upload/v1782938464/quantum/images/ke4lvx4slzwlbjkyeutm.jpg"
          alt="Aisha avatar"
          fill
          sizes="64px"
          className="object-cover"
        />
      </button>

      <div
        id="chat-window"
        className={`${isOpen ? "" : "hidden "}fixed right-4 bottom-28 z-50 flex h-[520px] w-[calc(100vw-2rem)] max-w-96 flex-col rounded-3xl border bg-white shadow-2xl sm:right-8 sm:w-96`}
      >
        <div className="flex items-center gap-3 rounded-t-3xl bg-purple-700 p-4 text-white">
          <Image
            src="https://res.cloudinary.com/dxxavgea1/image/upload/v1782938464/quantum/images/ke4lvx4slzwlbjkyeutm.jpg"
            alt="Aisha"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full border-2 border-white object-cover"
          />
          <div>
            <p className="text-lg font-bold">Aisha</p>
            <p className="text-sm opacity-90">Quantum Travels Assistant</p>
          </div>
          <button
            type="button"
            onClick={toggleChat}
            aria-label="Close Aisha chat"
            className="ml-auto text-3xl leading-none"
          >
            ✕
          </button>
        </div>

        <div
          id="messages"
          ref={messagesRef}
          className="flex-1 overflow-y-auto bg-gray-50 p-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${message.isUser ? "text-right" : "text-left"}`}
            >
              <div
                className={`${message.isUser ? "bg-purple-600 text-white" : "border bg-white"} inline-block max-w-[85%] rounded-2xl px-4 py-3 text-left`}
                {...(message.isUser
                  ? { children: message.text }
                  : { dangerouslySetInnerHTML: { __html: message.text } })}
              />
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <form onSubmit={sendMessage}>
            <div className="flex gap-2">
              <input
                id="input"
                type="text"
                placeholder="Ask about packages, visas, cars..."
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                className="min-w-0 flex-1 rounded-full border border-gray-300 px-5 py-3"
              />
              <button
                type="submit"
                className="rounded-full bg-purple-600 px-8 text-white"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
