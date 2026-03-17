
import { useEffect, useState } from 'react';
import { forensicsService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { FileText, Database, ShieldAlert, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ForensicArtifact {
    id: string;
    agent_id: string;
    artifact_type: string;
    file_path: string;
    size_bytes: number;
    checksum: string;
    captured_at: string;
    analysis_result?: any;
}

interface AgentForensicsViewerProps {
    agentId: string;
}

export default function AgentForensicsViewer({ agentId }: AgentForensicsViewerProps) {
    const [artifacts, setArtifacts] = useState<ForensicArtifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArtifact, setSelectedArtifact] = useState<ForensicArtifact | null>(null);

    useEffect(() => {
        const fetchArtifacts = async () => {
            try {
                const response = await forensicsService.getArtifacts(agentId);
                setArtifacts(response.data);
            } catch (error) {
                console.error("Failed to fetch artifacts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtifacts();
        // Refresh every 10s to see new dumps appear
        const interval = setInterval(fetchArtifacts, 10000);
        return () => clearInterval(interval);
    }, [agentId]);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) return <div className="text-sm text-muted-foreground p-4">Loading forensics data...</div>;

    if (artifacts.length === 0) {
        return (
            <div className="text-center p-8 border rounded-md border-dashed border-muted-foreground/30">
                <Database className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No forensic artifacts captured yet. Request a memory dump to begin.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium">Captured Artifacts</h3>
            <div className="grid grid-cols-1 gap-2">
                {artifacts.map((artifact) => (
                    <div key={artifact.id} className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                                <div className="text-sm font-medium">{artifact.artifact_type.toUpperCase()}</div>
                                <div className="text-xs text-muted-foreground text-mono">{artifact.id.slice(0, 8)} • {new Date(artifact.captured_at).toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-xs text-muted-foreground">{formatBytes(artifact.size_bytes)}</span>

                            {artifact.analysis_result ? (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className={artifact.analysis_result.verdict === 'suspicious' ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-green-500 text-green-500 hover:bg-green-50'}
                                    onClick={() => setSelectedArtifact(artifact)}
                                >
                                    {artifact.analysis_result.verdict === 'suspicious' ? <ShieldAlert className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                                    Analysis
                                </Button>
                            ) : (
                                <Badge variant="secondary">Pending Analysis</Badge>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Modal for Analysis Result */}
            {selectedArtifact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedArtifact(null)}>
                    <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="text-lg font-bold">Forensics Analysis Report</h3>
                                <Button size="sm" variant="ghost" onClick={() => setSelectedArtifact(null)}>Close</Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Verdict</div>
                                    <div className="text-lg font-bold uppercase">{selectedArtifact.analysis_result?.verdict}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Checksum</div>
                                    <div className="text-xs font-mono break-all">{selectedArtifact.checksum}</div>
                                </div>
                            </div>

                            {selectedArtifact.analysis_result?.malware_signatures?.length > 0 && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                                    <div className="text-sm font-bold text-red-500 mb-2">Detected Signatures</div>
                                    <ul className="list-disc list-inside text-sm">
                                        {selectedArtifact.analysis_result.malware_signatures.map((sig: string, i: number) => (
                                            <li key={i}>{sig}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-2">Network Connections</div>
                                <div className="bg-muted p-2 rounded-md text-xs font-mono">
                                    {selectedArtifact.analysis_result?.network_connections?.map((conn: string, i: number) => (
                                        <div key={i}>{conn}</div>
                                    )) || "No connections analyzed"}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-2">Suspicious PIDs</div>
                                <div className="text-sm">
                                    {selectedArtifact.analysis_result?.suspicious_pids?.join(', ') || "None"}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
