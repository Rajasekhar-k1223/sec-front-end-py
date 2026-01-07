import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { X, Trash2, Save } from 'lucide-react';
import type { Node } from 'reactflow';

interface NodePropertiesProps {
    node: Node | null;
    onUpdate: (id: string, data: any) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}

export default function NodeProperties({ node, onUpdate, onDelete, onClose }: NodePropertiesProps) {
    const [formData, setFormData] = useState({
        label: '',
        ip: '',
        type: 'server',
        status: 'healthy'
    });

    useEffect(() => {
        if (node) {
            setFormData({
                label: node.data.label || '',
                ip: node.data.ip || '',
                type: node.data.type || 'server',
                status: node.data.status || 'healthy'
            });
        }
    }, [node]);

    if (!node) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(node.id, formData);
        onClose(); // Optional: Close on save, or keep open
    };

    return (
        <Card className="w-[300px] border-l border-border h-full rounded-none absolute right-0 top-0 z-10 shadow-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base">Node Details</CardTitle>
                    <CardDescription className="text-xs truncate">{node.id}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="label">Name</Label>
                        <Input
                            id="label"
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ip">IP Address</Label>
                        <Input
                            id="ip"
                            value={formData.ip}
                            onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <select
                            id="type"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="server">Server</option>
                            <option value="database">Database</option>
                            <option value="firewall">Firewall</option>
                            <option value="internet">Internet</option>
                            <option value="pce">Workstation (PCE)</option>
                            <option value="cloud">Cloud</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Health Status</Label>
                        <select
                            id="status"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="healthy">Healthy 🟢</option>
                            <option value="warning">Warning 🟡</option>
                            <option value="critical">Critical 🔴</option>
                        </select>
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-2">
                        <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(node.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                        <Button type="submit" size="sm">
                            <Save className="h-4 w-4 mr-2" />
                            Save
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
