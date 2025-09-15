"use client";

import { useState, useEffect, Suspense } from "react";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useSearchParams } from 'next/navigation';

// Placeholder for the form preview component
const FormPreview = () => {
    return (
        <div className="flex-1 glass-card p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 gradient-text text-center">Innovate & Create Hackathon</h2>
                <div className="space-y-6 bg-black/10 p-8 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Your Name</label>
                        <input type="text" className="w-full bg-black/20 p-2 rounded-md border border-white/10 focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Your Email</label>
                        <input type="email" className="w-full bg-black/20 p-2 rounded-md border border-white/10 focus:ring-primary focus:border-primary" />
                    </div>
                    <Button className="w-full bg-primary/90">Register</Button>
                </div>
            </div>
        </div>
    );
};

// Main Chat Panel Component
const ChatPanel = ({ messages, onSendMessage, isLoading }: { messages: any[], onSendMessage: (msg: string) => void, isLoading: boolean }) => {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput("");
    };

    return (
        <div className="w-full md:w-[400px] glass-card flex flex-col">
            <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-bold gradient-text">Conversation</h2>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-primary/20 text-right' : 'bg-black/20'}`}>
                        <p className={`font-bold mb-1 ${msg.role === 'user' ? '' : 'text-primary'}`}>
                            {msg.role === 'user' ? 'You' : 'AI Assistant'}
                        </p>
                        <p>{msg.parts[0].text}</p>
                    </div>
                ))}
                {isLoading && <div className="p-3 rounded-lg bg-black/20 text-sm"><p className="font-bold text-primary mb-1">AI Assistant</p><p>Typing...</p></div>}
            </div>
            <div className="p-4 border-t border-white/10">
                <div className="relative">
                    <Textarea
                        placeholder="Ask a follow-up or provide more details..."
                        className="w-full bg-black/20 pr-12 rounded-lg border-white/20"
                        rows={2}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <Button size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary/90" onClick={handleSend} disabled={isLoading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Main Build Page Component
function BuildPageContent() {
    const searchParams = useSearchParams();
    const initialPrompt = searchParams.get('prompt') || "Create a generic contact form.";

    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Start the conversation with the initial prompt from the home page
        sendMessage(initialPrompt, []);
    }, [initialPrompt]);

    const sendMessage = async (message: string, currentMessages?: any[]) => {
        setIsLoading(true);
        const history = currentMessages || messages;
        const newMessages = [...history, { role: 'user', parts: [{ text: message }] }];
        setMessages(newMessages);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    history: history,
                    message: message
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();

            setMessages([...newMessages, { role: 'model', parts: [{ text: data.text }] }]);

        } catch (error) {
            console.error("Error communicating with the AI:", error);
            setMessages([...newMessages, { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting. Please check the console for errors." }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full relative p-4 gap-4 flex-col md:flex-row">
            <GradientBackground />
            <ChatPanel messages={messages} onSendMessage={sendMessage} isLoading={isLoading} />
            <FormPreview />
        </div>
    );
}

// Suspense Boundary for useSearchParams
export default function BuildPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BuildPageContent />
        </Suspense>
    );
}
