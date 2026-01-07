import { useState, useEffect } from 'react';
import EvidenceTable, { type EvidenceItem } from '@/components/compliance/EvidenceTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileDown, Shield, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { complianceService } from '@/lib/api';

export default function ComplianceManager() {
    const [frameworks, setFrameworks] = useState<any[]>([]);
    const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
    const [activeTab, setActiveTab] = useState('soc2');

    useEffect(() => {
        const fetchFrameworks = async () => {
            try {
                const response = await complianceService.getFrameworks();
                setFrameworks(response.data);
            } catch (error) {
                console.error("Failed to fetch frameworks:", error);
            }
        };
        fetchFrameworks();
    }, []);

    useEffect(() => {
        const fetchEvidence = async () => {
            try {
                const response = await complianceService.getEvidence(activeTab);
                // Map backend keys if necessary (snake_case to camelCase)
                // Backend sends: evidence_name, last_updated
                // Frontend expects: evidenceName, lastUpdated
                const mappedData = response.data.map((item: any) => ({
                    id: item.id,
                    controlId: item.control_id,
                    description: item.description,
                    evidenceName: item.name,
                    status: item.status,
                    lastUpdated: item.last_updated
                }));
                setEvidence(mappedData);
            } catch (error) {
                console.error("Failed to fetch evidence:", error);
            }
        };
        fetchEvidence();
    }, [activeTab]);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Compliance Manager</h2>
                    <p className="text-muted-foreground">Automate evidence collection for SOC2, ISO27001, and HIPAA.</p>
                </div>
                <div className="flex space-x-2">
                    <Button><FileDown className="mr-2 h-4 w-4" /> Generate Audit Report</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {frameworks.map((fw) => (
                    <Card key={fw.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                                {fw.type === 'SOC2' ? <Shield className="w-4 h-4 mr-2 text-blue-500" /> :
                                    fw.type === 'ISO' ? <Lock className="w-4 h-4 mr-2 text-purple-500" /> :
                                        <Shield className="w-4 h-4 mr-2 text-red-500" />}
                                {fw.name}
                            </CardTitle>
                            <CardDescription>{fw.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between mb-1 text-sm">
                                <span>Readiness</span>
                                <span className="font-bold">{fw.readiness_score}%</span>
                            </div>
                            <Progress value={fw.readiness_score} className="h-2" />
                        </CardContent>
                    </Card>
                ))}
                {frameworks.length === 0 && <div className="col-span-3 text-center text-muted-foreground">Loading frameworks...</div>}
            </div>

            <div className="flex-1 overflow-hidden bg-card rounded-md border border-border flex flex-col">
                <div className="p-4 border-b border-border">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="soc2">SOC 2</TabsTrigger>
                            <TabsTrigger value="iso27001">ISO 27001</TabsTrigger>
                            <TabsTrigger value="hipaa">HIPAA</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    <h3 className="text-lg font-semibold mb-4">
                        Required Evidence ({frameworks.find(f => f.id === activeTab)?.name || 'Loading...'})
                    </h3>
                    <EvidenceTable evidence={evidence} />
                </div>
            </div>
        </div>
    );
}
