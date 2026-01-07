import { useEffect, useState } from 'react';
import { agentsService } from '@/lib/api';
import { Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Software {
    id: string;
    name: string;
    version: string;
    vendor: string;
    matched_cve?: string;
}

interface AgentSoftwareTableProps {
    agentId: string;
}

export default function AgentSoftwareTable({ agentId }: AgentSoftwareTableProps) {
    const [software, setSoftware] = useState<Software[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchSoftware = async () => {
            try {
                setLoading(true);
                const response = await agentsService.getSoftware(agentId);
                setSoftware(response.data);
            } catch (error) {
                console.error("Failed to fetch software", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSoftware();
    }, [agentId]);

    const filteredSoftware = software.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.vendor?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading inventory...</div>;
    }

    if (software.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">No software inventory found. (Scan pending?)</div>;
    }

    return (
        <div className="mt-4 bg-card/50 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-foreground flex items-center">
                    <Package className="mr-2 h-4 w-4 text-primary" />
                    Installed Software ({software.length})
                </h4>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search software..."
                        className="pl-8 h-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-border bg-background">
                <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 sticky top-0">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Version</th>
                                <th className="px-4 py-2">Vendor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSoftware.map((item) => (
                                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/10">
                                    <td className="px-4 py-2 font-medium">
                                        {item.name}
                                        {item.matched_cve && (
                                            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500 border border-red-500/30">
                                                {item.matched_cve}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-muted-foreground">{item.version}</td>
                                    <td className="px-4 py-2 text-muted-foreground">{item.vendor || '-'}</td>
                                </tr>
                            ))}
                            {filteredSoftware.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-4 text-center text-muted-foreground">No matches found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
