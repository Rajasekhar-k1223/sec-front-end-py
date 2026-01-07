import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, Plus, Loader2, FileSpreadsheet } from 'lucide-react';
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
    download_url: string;
}

export default function Reporting() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newType, setNewType] = useState('pdf');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await reportingService.getReports();
            setReports(response.data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        }
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
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Reporting</h2>
                    <p className="text-muted-foreground">Generate and download security and compliance reports.</p>
                </div>
                <div className="flex space-x-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> Generate Report</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Generate New Report</DialogTitle>
                                <DialogDescription>
                                    Create a new report from current data.
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
                                        placeholder="e.g. Weekly Scan"
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
                                            <SelectItem value="pdf">PDF Document</SelectItem>
                                            <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleGenerate} disabled={isGenerating}>
                                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Generate
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="rounded-md border border-border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-medium text-sm text-muted-foreground">
                    <div className="col-span-4">Report Name</div>
                    <div className="col-span-2">Format</div>
                    <div className="col-span-2">Created At</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {reports.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No generated reports.</div>
                ) : (
                    reports.map((report) => (
                        <div key={report.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/10 items-center text-sm transition-colors">
                            <div className="col-span-4 font-medium flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span>{report.title}</span>
                            </div>
                            <div className="col-span-2">
                                {report.type === 'pdf' ?
                                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">PDF</Badge> :
                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">CSV</Badge>
                                }
                            </div>
                            <div className="col-span-2 text-muted-foreground">
                                {new Date(report.created_at).toLocaleDateString()}
                            </div>
                            <div className="col-span-2">
                                {report.status === 'generating' ? (
                                    <span className="text-yellow-500 flex items-center text-xs">
                                        <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Generating...
                                    </span>
                                ) : (
                                    <span className="text-green-500 text-xs">Completed</span>
                                )}
                            </div>
                            <div className="col-span-2 text-right">
                                <Button variant="ghost" size="sm" disabled={report.status !== 'completed'}>
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
