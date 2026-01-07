import { useState, useEffect } from 'react';
import { zeroTrustService } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, ShieldCheck, Binary, UserCheck, Smartphone, AlertOctagon } from 'lucide-react';

interface AccessLog {
    id: string;
    user: string;
    resource: string;
    device: string;
    status: 'Allowed' | 'Blocked' | 'Challenge';
    risk: 'Low' | 'Medium' | 'High';
    time: string;
}

interface CryptoAsset {
    id: string;
    algorithm: string;
    usage: string;
    status: 'Quantum-Safe' | 'Vulnerable' | 'Migrating';
}

export default function ZeroTrust() {
    const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
    const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await zeroTrustService.getDashboard();
                if (response.data) {
                    setAccessLogs(response.data.access_logs);
                    setCryptoAssets(response.data.crypto_assets);
                }
            } catch (error) {
                console.error("Failed to fetch Zero Trust data", error);
                // Fallback handled by initial state or could retry
            }
        };
        fetchDashboard();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Zero Trust & Quantum Security</h2>
            <p className="text-muted-foreground">Next-generation identity verification and post-quantum cryptography readiness.</p>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-indigo-500" />
                            Zero Trust Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-indigo-500">92/100</div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Identity-aware proxy enabled. Device posture checks active.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Binary className="h-5 w-5 text-emerald-500" />
                            PQC Readiness
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-emerald-500">Safe</div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Kyber-1024 algorithm deployed for key exchange.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Recent Access Decisions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {accessLogs.map((log) => (
                                <div key={log.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 font-mono text-sm">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{log.user}</span>
                                        <span className="text-xs text-muted-foreground">{log.resource}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="hidden sm:inline text-xs text-muted-foreground">{log.device}</span>
                                        <Badge variant={log.status === 'Allowed' ? 'outline' : log.status === 'Blocked' ? 'destructive' : 'secondary'}>
                                            {log.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Crypto Agility Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {cryptoAssets.map((asset) => (
                                <div key={asset.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 font-mono text-sm">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{asset.algorithm}</span>
                                        <span className="text-xs text-muted-foreground">{asset.usage}</span>
                                    </div>
                                    <Badge className={
                                        asset.status === 'Quantum-Safe' ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30' :
                                            asset.status === 'Vulnerable' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' :
                                                'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                                    }>
                                        {asset.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
