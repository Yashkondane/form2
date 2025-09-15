"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Code, Eye, Copy } from "lucide-react";
import { useSearchParams } from 'next/navigation';

// --- HELPER FUNCTION TO GENERATE REACT CODE STRING ---
const generateReactCode = (blueprint: any): string => {
    if (!blueprint || !blueprint.fields) return "<p>Start the conversation to generate code.</p>";

    const fieldsJsx = blueprint.fields.map((field: any) => {
        const requiredProp = field.required ? ' required' : '';
        if (field.type === 'select') {
            const optionsJsx = field.options.map((opt: string) => `            <option value="${opt}">${opt}</option>`).join('\n');
            return `
      <div className="mb-4">
        <label htmlFor="${field.id}" className="block text-sm font-medium text-gray-300">
          ${field.label}${field.required ? ' *' : ''}
        </label>
        <select
          id="${field.id}"
          name="${field.id}"${requiredProp}
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        >
${optionsJsx}
        </select>
      </div>`;
        }
        return `
      <div className="mb-4">
        <label htmlFor="${field.id}" className="block text-sm font-medium text-gray-300">
          ${field.label}${field.required ? ' *' : ''}
        </label>
        <input
          type="${field.type}"
          id="${field.id}"
          name="${field.id}"${requiredProp}
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>`;
    }).join('');

    const componentName = blueprint.formTitle.replace(/\s+/g, '') || 'MyForm';

    return `import React from 'react';

export default function ${componentName}() {
  return (
    <form className="p-8 bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6">${blueprint.formTitle}</h2>
      ${fieldsJsx}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
}
`;
};

// --- DYNAMIC FORM PREVIEW COMPONENT ---
const FormPreview = ({ formBlueprint }: { formBlueprint: any }) => {
    if (!formBlueprint || !formBlueprint.fields) {
        return (
            <div className="text-center text-muted-foreground">
                <p>Your form preview will appear here.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 gradient-text text-center">{formBlueprint.formTitle}</h2>
            <form className="space-y-6 bg-black/10 p-8 rounded-lg">
                {formBlueprint.fields.map((field: any) => (
                    <div key={field.id}>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            {field.label} {field.required && <span className="text-primary">*</span>}
                        </label>
                        {field.type === 'select' ? (
                            <select className="w-full bg-black/20 p-2 rounded-md border border-white/10 focus:ring-primary focus:border-primary">
                                {field.options?.map((option: string) => <option key={option} value={option}>{option}</option>)}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                required={field.required}
                                className="w-full bg-black/20 p-2 rounded-md border border-white/10 focus:ring-primary focus:border-primary"
                            />
                        )}
                    </div>
                ))}
                <Button type="submit" className="w-full bg-primary/90">Submit</Button>
            </form>
        </div>
    );
};

// --- CODE PREVIEW COMPONENT ---
const CodePreview = ({ code }: { code: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-black/20 rounded-lg h-full w-full p-4 relative text-sm">
            <Button
                size="sm"
                onClick={handleCopy}
                className="absolute top-4 right-4 glass-button z-10"
            >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Code'}
            </Button>
            <pre className="h-full w-full overflow-auto text-left"><code className="language-jsx">{code}</code></pre>
        </div>
    )
}

// --- CHAT PANEL COMPONENT ---
const ChatPanel = ({ messages, onSendMessage, isLoading }: { messages: any[], onSendMessage: (msg: string) => void, isLoading: boolean }) => {
    const [input, setInput] = useState("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput("");
    };

    return (
        <div className="w-full md:w-[450px] glass-card flex flex-col h-[calc(100vh-2rem)]">
            <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-bold gradient-text">Form Builder Assistant</h2>
            </div>
            <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role !== 'user' && <Bot className="w-6 h-6 text-primary flex-shrink-0" />}
                        <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary/20' : 'bg-black/20'}`}>
                            <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                        </div>
                        {msg.role === 'user' && <User className="w-6 h-6 text-primary flex-shrink-0" />}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3 text-sm justify-start">
                        <Bot className="w-6 h-6 text-primary flex-shrink-0 animate-pulse" />
                        <div className="p-3 rounded-lg bg-black/20">
                            <p className="whitespace-pre-wrap">Typing...</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-white/10">
                <div className="relative">
                    <Textarea
                        placeholder="e.g., 'Add a field for T-shirt size'"
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

// --- MAIN BUILD PAGE COMPONENT ---
function BuildPageContent() {
    const searchParams = useSearchParams();
    const initialPrompt = searchParams.get('prompt') || "I want to create a contact form.";

    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formBlueprint, setFormBlueprint] = useState<any>(null);
    const [generatedCode, setGeneratedCode] = useState("");
    const [view, setView] = useState<'preview' | 'code'>('preview');

    useEffect(() => {
        if (initialPrompt && messages.length === 0) {
            sendMessage(initialPrompt, []);
        }
    }, [initialPrompt]);

    const parseJsonFromText = (text: string) => {
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            try { return JSON.parse(jsonMatch[1]); } catch (e) { return null; }
        }
        try { return JSON.parse(text); } catch(e) { return null; }
    };

    const sendMessage = async (message: string, currentMessages?: any[]) => {
        setIsLoading(true);
        const history = currentMessages || messages;
        const newMessages = [...history, { role: 'user', parts: [{ text: message }] }];
        setMessages(newMessages);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: history, message: message }),
            });

            if (!response.ok) throw new Error(`API error: ${response.statusText}`);
            const data = await response.json();
            const aiResponseText = data.text;
            const blueprint = parseJsonFromText(aiResponseText);

            if (blueprint) {
                setFormBlueprint(blueprint);
                setGeneratedCode(generateReactCode(blueprint));
                setMessages([...newMessages, { role: 'model', parts: [{ text: "Great! I've generated the form blueprint. You can see the preview and the code on the right." }] }]);
            } else {
                setMessages([...newMessages, { role: 'model', parts: [{ text: aiResponseText }] }]);
            }

        } catch (error) {
            console.error("Error communicating with the AI:", error);
            const errorMsg = [...newMessages, { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting. Please check your API key and the server console for errors." }] }];
            setMessages(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full relative p-4 gap-4 flex-col md:flex-row">
            <GradientBackground />
            <ChatPanel messages={messages} onSendMessage={sendMessage} isLoading={isLoading} />
            <div className="flex-1 glass-card flex flex-col">
                <div className="p-2 border-b border-white/10 flex items-center gap-2 flex-shrink-0">
                    <Button variant={view === 'preview' ? 'secondary' : 'ghost'} onClick={() => setView('preview')} className="glass-button"><Eye className="h-4 w-4 mr-2" />Preview</Button>
                    <Button variant={view === 'code' ? 'secondary' : 'ghost'} onClick={() => setView('code')} className="glass-button"><Code className="h-4 w-4 mr-2" />Code</Button>
                </div>
                <div className="flex-1 p-8 flex items-center justify-center overflow-auto">
                    {view === 'preview' ? <FormPreview formBlueprint={formBlueprint} /> : <CodePreview code={generatedCode} />}
                </div>
            </div>
        </div>
    );
}

export default function BuildPage() {
    return (
        <Suspense fallback={<div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white z-50">Loading your build session...</div>}>
            <BuildPageContent />
        </Suspense>
    );
}