import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Server, Laptop, Smartphone, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { assetsService } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface Asset {
    id: string;
    name: string;
    type: 'server' | 'workstation' | 'mobile' | 'iot';
    owner: string;
    location: string;
    status: 'active' | 'maintenance' | 'retired';
    ip_address: string;
}

export default function Assets() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockAssets: Asset[] = [
            { id: '1', name: 'DB-Prod-01', type: 'server', owner: 'DevOps Team', location: 'US-East-1', status: 'active', ip_address: '10.0.1.15' },
            { id: '2', name: 'K8s-Worker-04', type: 'server', owner: 'Platform Eng', location: 'EU-West-2', status: 'active', ip_address: '10.0.2.108' },
            { id: '3', name: 'Workstation-Dev-88', type: 'workstation', owner: 'Alice Smith', location: 'HQ - Floor 3', status: 'active', ip_address: '192.168.10.45' },
            { id: '4', name: 'MacBook-Pro-CEO', type: 'workstation', owner: 'John Doe', location: 'Remote', status: 'active', ip_address: '192.168.1.101' },
            { id: '5', name: 'IoT-Sensor-WareHouse', type: 'iot', owner: 'Facilities', location: 'Warehouse A', status: 'maintenance', ip_address: '172.16.0.44' },
            { id: '6', name: 'iPad-Sales-Kiosk', type: 'mobile', owner: 'Sales', location: 'Lobby', status: 'active', ip_address: '10.5.0.22' },
        ];

        const fetchAssets = async () => {
            try {
                const response = await assetsService.getAssets();
                if (response.data && response.data.length > 0) {
                    setAssets(response.data);
                } else {
                    setAssets(mockAssets);
                }
            } catch (error) {
                console.warn("Using mock assets:", error);
                setAssets(mockAssets);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'server': return <Database className="h-4 w-4" />;
            case 'workstation': return <Laptop className="h-4 w-4" />;
            case 'mobile': return <Smartphone className="h-4 w-4" />;
            default: return <Server className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Asset Management</h2>
                    <p className="text-muted-foreground">CMDB: Track all IT assets and devices.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                    <Button>+ Add Asset</Button>
                </div>
            </div>

            <div className="rounded-md border border-border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-medium text-sm text-muted-foreground">
                    <div className="col-span-3">Asset Name</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">IP Address</div>
                    <div className="col-span-2">Owner</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-1 text-right">Status</div>
                </div>

                {assets.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">Loading assets...</div>
                ) : (
                    assets.map((asset) => (
                        <div key={asset.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/10 items-center text-sm transition-colors">
                            <div className="col-span-3 font-medium flex items-center space-x-2">
                                {getIcon(asset.type)}
                                <span>{asset.name}</span>
                            </div>
                            <div className="col-span-2 capitalize text-muted-foreground">{asset.type}</div>
                            <div className="col-span-2 font-mono text-xs">{asset.ip_address}</div>
                            <div className="col-span-2 text-muted-foreground">{asset.owner}</div>
                            <div className="col-span-2 text-muted-foreground">{asset.location}</div>
                            <div className="col-span-1 text-right">
                                <Badge variant="outline" className={
                                    asset.status === 'active' ? 'text-green-500 border-green-500/20' : 'text-yellow-500 border-yellow-500/20'
                                }>
                                    {asset.status}
                                </Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
