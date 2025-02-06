// src/app/dashboard/page.js
"use client";
import { useState } from 'react';
import { 
  BarChart, Target, Layout, PenTool, Library, 
  Palette, BrainCircuit, Settings, LogOut,
  TrendingUp, Users, DollarSign, Activity,
  MessageSquare, Send, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Function untuk detect code type
function detectCodeType(text) {
  if (text.includes("```html")) return "salespage";
  if (text.includes("```css")) return "styles";
  if (text.includes("```js")) return "script";
  return null;
}

// Function untuk extract & apply code
function handleCodeResponse(response) {
  const codeType = detectCodeType(response);
  if (!codeType) return response;

  const codeMatch = response.match(/```(?:html|css|js)([\s\S]*?)```/);
  if (codeMatch) {
    const code = codeMatch[1].trim();
    switch (codeType) {
      case "salespage":
        // Route to Sales Page Builder with code
        router.push({
          pathname: '/dashboard/sales-page-builder',
          query: { code: btoa(code) }
        });
        break;
      case "styles":
        // Apply styles
        break;
      case "script":
        // Apply scripts
        break;
    }
  }
  return response;
}

// Move OpenAI logic to separate function
async function getChatResponse(messages) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });
    
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Chat API Error:', error);
    return "Sorry, I encountered an error. Please try again.";
  }
}

export default function Dashboard() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your AI marketing assistant. How can I help you today?", isAi: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleLogout = () => {
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push('/');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), text: newMessage, isAi: false };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Format messages for API
    const messageHistory = messages.map(msg => ({
      role: msg.isAi ? "assistant" : "user",
      content: msg.text
    }));

    try {
      const aiResponse = await getChatResponse([
        ...messageHistory,
        { role: "user", content: newMessage }
      ]);
      
      // Handle code if present
      const processedResponse = handleCodeResponse(aiResponse);

      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: processedResponse, 
        isAi: true 
      }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "Sorry, I encountered an error. Please try again.", 
        isAi: true 
      }]);
    }

    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">AdsGuru AI360</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Campaigns" 
            value="12" 
            trend="+2.5%" 
            Icon={Activity}
            color="text-blue-600"
          />
          <StatCard 
            title="Active Ads" 
            value="48" 
            trend="+12%" 
            Icon={TrendingUp}
            color="text-green-600"
          />
          <StatCard 
            title="Total Spend" 
            value="$2,456" 
            trend="+8.2%" 
            Icon={DollarSign}
            color="text-purple-600"
          />
          <StatCard 
            title="Reach" 
            value="124.8k" 
            trend="+18.4%" 
            Icon={Users}
            color="text-orange-600"
          />
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard 
            title="Campaign Manager" 
            description="Create and manage FB & TikTok ad campaigns"
            Icon={BarChart}
            color="bg-blue-500"
          />
          <ToolCard 
            title="Advanced Tracking" 
            description="MadGro-style analytics & tracking"
            Icon={Target}
            color="bg-purple-500"
          />
          <ToolCard 
            title="Sales Page Builder" 
            description="Create high-converting landing pages"
            Icon={Layout}
            color="bg-green-500"
          />
          <ToolCard 
            title="Content Creator" 
            description="AI-powered ad copy & creative generator"
            Icon={PenTool}
            color="bg-orange-500"
          />
          <ToolCard 
            title="Content Bank" 
            description="Store & organize your marketing assets"
            Icon={Library}
            color="bg-red-500"
          />
          <ToolCard 
            title="Creative Studio" 
            description="Design tools & templates"
            Icon={Palette}
            color="bg-pink-500"
          />
        </div>
      </div>

      {/* Chat Interface */}
      <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-xl ${isChatOpen ? '' : 'hidden'}`}>
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">AdsGuru AI Assistant</h3>
              <p className="text-sm text-gray-500">Always here to help</p>
            </div>
          </div>
          <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4">
          {messages.map(message => (
            <div key={message.id} className={`mb-4 flex ${message.isAi ? '' : 'justify-end'}`}>
              <div className={`rounded-lg p-3 max-w-[80%] ${
                message.isAi ? 'bg-gray-100' : 'bg-blue-600 text-white'
              }`}>
                {message.text}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex space-x-2 p-3 bg-gray-100 rounded-lg max-w-[80%]">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Chat Toggle Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

function StatCard({ title, value, trend, Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          <p className="text-sm text-green-600 mt-1">{trend}</p>
        </div>
        <div className={`${color} bg-opacity-10 rounded-full p-3`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}

function ToolCard({ title, description, Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className={`${color} text-white rounded-xl w-12 h-12 flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}