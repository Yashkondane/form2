import { GradientBackground } from "@/components/ui/gradient-background";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Camera,
    Figma,
    Upload,
    FileText,
    Plus,
    ArrowUp,
    SlidersHorizontal,
} from "lucide-react";

function MainHeader() {
    return (
        <header className="flex items-center justify-end p-4 gap-2">
            <Button variant="outline" className="glass-button">
                Upgrade
            </Button>
            <Button variant="outline" className="glass-button">
                Feedback
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary/80 flex items-center justify-center font-bold text-sm text-primary-foreground">
                Y
            </div>
        </header>
    );
}

export default function Home() {
    return (
        <div className="flex min-h-screen w-full relative">
            <GradientBackground />
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <MainHeader />
                <main className="flex flex-1 items-center justify-center p-4">
                    <div className="w-full max-w-3xl text-center">
                        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl gradient-text">
                            What do you want to create?
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Start building with a single prompt. No coding needed.
                        </p>
                        <div className="relative mt-8">
                            <Textarea
                                placeholder="Ask v0 to build..."
                                className="w-full resize-none rounded-xl border-white/20 bg-white/10 p-4 pr-16 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary/50 glass-effect"
                                rows={2}
                            />
                            <div className="absolute bottom-3.5 left-4 flex items-center gap-3">
                                <button className="text-muted-foreground transition-colors hover:text-primary">
                                    <Plus className="h-5 w-5" />
                                    <span className="sr-only">Add</span>
                                </button>
                                <button className="text-muted-foreground transition-colors hover:text-primary">
                                    <SlidersHorizontal className="h-5 w-5" />
                                    <span className="sr-only">Settings</span>
                                </button>
                            </div>
                            <Button
                                size="icon"
                                className="absolute bottom-2.5 right-2.5 h-9 w-9 bg-white/20 hover:bg-white/30"
                            >
                                <ArrowUp className="h-5 w-5" />
                                <span className="sr-only">Submit</span>
                            </Button>
                        </div>
                        <div className="mt-4 p-3 rounded-lg border border-white/20 bg-white/10 flex justify-between items-center text-sm glass-card">
                            <p>
                                Upgrade to Team to unlock all of v0's features and more credits
                            </p>
                            <Button size="sm" className="bg-primary/90 backdrop-blur-sm">
                                Upgrade Plan
                            </Button>
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <Button variant="outline" className="glass-button">
                                <Camera className="mr-2 h-4 w-4" />
                                Clone a Screenshot
                            </Button>
                            <Button variant="outline" className="glass-button">
                                <Figma className="mr-2 h-4 w-4" />
                                Import from Figma
                            </Button>
                            <Button variant="outline" className="glass-button">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload a Project
                            </Button>
                            <Button variant="outline" className="glass-button">
                                <FileText className="mr-2 h-4 w-4" />
                                Landing Page
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}