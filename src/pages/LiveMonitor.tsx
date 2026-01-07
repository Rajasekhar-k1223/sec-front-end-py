import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, Play, Pause, RefreshCw, Wifi, MicOff, VideoOff } from 'lucide-react';

export default function LiveMonitor() {
    const [logs, setLogs] = useState<string[]>([]);
    const [isLive, setIsLive] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLive) {
            const interval = setInterval(() => {
                const newLog = `[${new Date().toISOString()}] INFO: Packet intercepted from agent_${Math.floor(Math.random() * 1000)}`;
                setLogs(prev => [...prev.slice(-20), newLog]);
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [isLive]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const toggleLive = () => setIsLive(!isLive);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Live Monitor</h2>
                    <p className="text-muted-foreground">Real-time situational awareness and command center.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant={isLive ? "destructive" : "default"} onClick={toggleLive}>
                        {isLive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                        {isLive ? 'Stop Feed' : 'Start Feed'}
                    </Button>
                    <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Video/Stream Area */}
                <Card className="lg:col-span-2 h-[500px] flex flex-col relative overflow-hidden bg-black border-zinc-800">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/40 via-transparent to-transparent"></div>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        {isLive ? (
                            <div className="text-green-500 flex flex-col items-center animate-pulse">
                                <Wifi className="h-16 w-16 mb-4" />
                                <span className="font-mono text-lg">ESTABLISHING SECURE CONNECTION...</span>
                                <span className="text-xs text-green-700 mt-2">ENCRYPTION: AES-256-GCM</span>
                            </div>
                        ) : (
                            <div className="text-zinc-600 flex flex-col items-center">
                                <VideoOff className="h-16 w-16 mb-4" />
                                <span className="font-mono">FEED OFFLINE</span>
                            </div>
                        )}
                    </div>

                    {/* HUD Overlays */}
                    <div className="absolute top-4 left-4 flex space-x-2">
                        <span className="bg-red-900/80 text-red-200 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">REC</span>
                        <span className="bg-zinc-900/80 text-zinc-400 text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-700">CAM-01</span>
                    </div>
                </Card>

                {/* Side Logs/Controls */}
                <div className="space-y-6">
                    <Card className="h-[240px] flex flex-col">
                        <CardHeader className="py-3">
                            <CardTitle className="text-sm">System Logs</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 bg-black/50 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
                            {logs.length === 0 ? (
                                <div className="text-muted-foreground italic">Waiting for stream...</div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className="text-green-400/80 mb-1 break-all border-l-2 border-transparent hover:border-green-500 pl-2">
                                        {log}
                                    </div>
                                ))
                            )}
                            <div ref={logsEndRef} />
                        </CardContent>
                    </Card>

                    <Card className="h-[235px]">
                        <CardHeader className="py-3">
                            <CardTitle className="text-sm">Active Agents Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Desktop-alpha</span>
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Server-prod-01</span>
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Gateway-Ext</span>
                                    <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
