import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, Plus, Loader2, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { reportingService } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Report {
    id: string;
    title: string;
    type: string;
    status: string;
    created_at: string;
    file_path: string | null;
}

export default function Reporting() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newType, setNewType] = useState('pdf');

    useEffect(() => {
        fetchReports();
        const interval = setInterval(fetchReports, 5000); // Polling for generation status
        return () => clearInterval(interval);
    }, []);

    const fetchReports = async () => {
        try {
            const response = await reportingService.getReports();
            setReports(response.data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        }
    };

    const handleDownload = (filePath: string) => {
        const baseUrl = 'http://localhost:8002'; // In prod this should be dynamic
        window.open(`${baseUrl}${filePath}`, '_blank');
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            await reportingService.generateReport({ title: newTitle, type: newType });
            setOpen(false);
            setNewTitle('');
            fetchReports();
        } catch (error) {
            console.error("Failed to generate report", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Security Reporting Hub</h2>
                    <p className="text-muted-foreground">Download comprehensive security and telemetry exports.</p>
                </div>
                <div className="flex space-x-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> New Export</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] border-border bg-card">
                            <DialogHeader>
                                <DialogTitle>Generate Security Export</DialogTitle>
                                <DialogDescription>
                                    Aggregate live telemetry into a portable document.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="col-span-3"
                                        placeholder="e.g. Monthly Inventory"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-right">
                                        Format
                                    </Label>
                                    <Select value={newType} onValueChange={setNewType}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select format" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pdf">PDF Document (High Fidelity)</SelectItem>
                                            <SelectItem value="csv">CSV Spreadsheet (Raw Data)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleGenerate} disabled={isGenerating || !newTitle}>
                                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Generate Report
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card/50 overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-semibold text-xs text-muted-foreground tracking-wider uppercase">
                    <div className="col-span-4">Report Description</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Created On</div>
                    <div className="col-span-2">Process State</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {reports.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No reports found</h3>
                        <p className="text-sm text-muted-foreground">Click "New Export" to generate your first document.</p>
                    </div>
                ) : (
                    reports.map((report) => (
                        <div key={report.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/10 items-center text-sm transition-colors group">
                            <div className="col-span-4 font-medium flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${report.type === 'pdf' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                                    {report.type === 'pdf' ? <FileText className="h-4 w-4 text-red-500" /> : <FileSpreadsheet className="h-4 w-4 text-green-500" />}
                                </div>
                                <span className="truncate">{report.title}</span>
                            </div>
                            <div className="col-span-2">
                                <Badge variant="secondary" className="font-mono text-[10px] uppercase">
                                    {report.type}
                                </Badge>
                            </div>
                            <div className="col-span-2 text-muted-foreground text-xs">
                                {new Date(report.created_at).toLocaleString()}
                            </div>
                            <div className="col-span-2">
                                {report.status === 'generating' ? (
                                    <Badge variant="outline" className="animate-pulse bg-yellow-500/5 text-yellow-500 border-yellow-500/20 text-[10px]">
                                        <Loader2 className="mr-1 h-3 w-3 animate-spin inline" /> PREPARING
                                    </Badge>
                                ) : report.status === 'failed' ? (
                                    <Badge variant="destructive" className="text-[10px]">FAILED</Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20 text-[10px]">
                                        <CheckCircle2 className="mr-1 h-3 w-3 inline" /> READY
                                    </Badge>
                                )}
                            </div>
                            <div className="col-span-2 text-right">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={report.status !== 'completed' || !report.file_path}
                                    onClick={() => handleDownload(report.file_path!)}
                                    className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                >
                                    <Download className="h-4 w-4 mr-2" /> Download
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
