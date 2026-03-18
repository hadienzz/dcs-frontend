// "use client";

// import type React from "react";
// import { useState, useRef, useEffect } from "react";
// import { MessageCircle, X, Send, Bot, User } from "lucide-react";

// interface Message {
//   id: string;
//   text: string;
//   sender: "user" | "bot";
//   timestamp: Date;
// }

// export function FloatingChatbot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "welcome",
//       text: "Halo! Saya adalah asisten virtual SDG Telkom University. Bagaimana saya bisa membantu Anda hari ini?",
//       sender: "bot",
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     const text = inputMessage.trim();
//     if (!text) return;

//     // tampilkan pesan user
//     const userMessage: Message = {
//       id: `u-${Date.now()}`,
//       text,
//       sender: "user",
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setInputMessage("");
//     setIsTyping(true);

//     try {
//       // panggil API internal -> nerusin ke upstream
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         cache: "no-store",
//         body: JSON.stringify({ question: text }),
//       });

//       if (!res.ok) {
//         const detail = await res.text();
//         throw new Error(detail || `HTTP ${res.status}`);
//       }

//       const data = await res.json();
//       const reply: string =
//         typeof data?.answer === "string"
//           ? data.answer
//           : typeof data?.reply === "string"
//             ? data.reply
//             : "Maaf, saya mengalami kendala memproses pesan Anda.";

//       const botMessage: Message = {
//         id: `b-${Date.now()}`,
//         text: reply,
//         sender: "bot",
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (e) {
//       const botMessage: Message = {
//         id: `b-${Date.now()}`,
//         text: "Maaf, terjadi kendala saat menghubungi server chatbot. Silakan coba lagi.",
//         sender: "bot",
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <>
//       {/* Floating Chat Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`fixed bottom-6 right-6 z-[800] w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
//           isOpen
//             ? "bg-gray-600 hover:bg-gray-700"
//             : "bg-[#b6252a] hover:bg-[#a01e23]"
//         }`}
//       >
//         {isOpen ? (
//           <X className="w-6 h-6 text-white mx-auto" />
//         ) : (
//           <MessageCircle className="w-6 h-6 text-white mx-auto" />
//         )}
//       </button>

//       {/* Chat Interface */}
//       {isOpen && (
//         <div className="fixed bottom-24 right-6 z-[10000] w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-2 duration-300">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-[#b6252a] to-[#ED1E28] text-white p-4 rounded-t-lg">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//                 <Bot className="w-4 h-4" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-sm">SDG Assistant</h3>
//                 <p className="text-xs opacity-90">Online sekarang</p>
//               </div>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${
//                   message.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`flex items-start gap-2 max-w-[80%] ${
//                     message.sender === "user" ? "flex-row-reverse" : ""
//                   }`}
//                 >
//                   <div
//                     className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
//                       message.sender === "user"
//                         ? "bg-[#b6252a] text-white"
//                         : "bg-gray-100 text-gray-600"
//                     }`}
//                   >
//                     {message.sender === "user" ? (
//                       <User className="w-3 h-3" />
//                     ) : (
//                       <Bot className="w-3 h-3" />
//                     )}
//                   </div>
//                   <div
//                     className={`rounded-lg p-3 text-sm ${
//                       message.sender === "user"
//                         ? "bg-[#b6252a] text-white rounded-br-none"
//                         : "bg-gray-100 text-gray-800 rounded-bl-none"
//                     }`}
//                   >
//                     {message.text}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="flex items-start gap-2">
//                   <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
//                     <Bot className="w-3 h-3 text-gray-600" />
//                   </div>
//                   <div className="bg-gray-100 rounded-lg rounded-bl-none p-3">
//                     <div className="flex space-x-1">
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                       <div
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.1s" }}
//                       ></div>
//                       <div
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.2s" }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <div className="p-4 border-t border-gray-200">
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 placeholder="Ketik pesan Anda..."
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b6252a] focus:border-transparent text-sm"
//               />
//               <button
//                 onClick={handleSendMessage}
//                 disabled={!inputMessage.trim() || isTyping}
//                 className="px-3 py-2 bg-[#b6252a] text-white rounded-lg hover:bg-[#a01e23] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <Send className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
