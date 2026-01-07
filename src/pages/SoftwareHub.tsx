import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, Search, AlertTriangle, ShieldCheck, Download, Filter } from 'lucide-react';
import { softwareService } from '@/lib/api';

export default function SoftwareHub() {
    const [searchTerm, setSearchTerm] = useState('');
    const [inventory, setInventory] = useState<any[]>([]);

    const mockSoftware = [
        { id: '1', name: 'Google Chrome', version: '120.0.6099.109', vendor: 'Google', install_count: 450, vulnerabilities: 2, risk_level: 'High' },
        { id: '2', name: 'Zoom Client', version: '5.17.0', vendor: 'Zoom Video Communications', install_count: 320, vulnerabilities: 0, risk_level: 'Low' },
        { id: '3', name: 'Docker Desktop', version: '4.26.1', vendor: 'Docker Inc.', install_count: 85, vulnerabilities: 5, risk_level: 'Critical' },
        { id: '4', name: 'Visual Studio Code', version: '1.85.1', vendor: 'Microsoft', install_count: 120, vulnerabilities: 0, risk_level: 'Low' },
        { id: '5', name: 'Node.js', version: '18.19.0', vendor: 'OpenJS Foundation', install_count: 60, vulnerabilities: 1, risk_level: 'Medium' },
        { id: '6', name: '7-Zip', version: '23.01', vendor: 'Igor Pavlov', install_count: 200, vulnerabilities: 0, risk_level: 'Low' },
    ];

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await softwareService.getInventory();
                if (response.data && response.data.length > 0) {
                    setInventory(response.data);
                } else {
                    setInventory(mockSoftware);
                }
            } catch (error) {
                console.warn("Using mock software inventory:", error);
                setInventory(mockSoftware);
            }
        };
        fetchInventory();
    }, []);

    const filteredSoftware = inventory.filter(sw =>
        sw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sw.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Software Hub</h2>
                    <p className="text-muted-foreground">Inventory, vulnerability management, and patch status.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export SBOM</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Stats cards would logically go here */}
            </div>

            <Card className="border-border bg-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Installed Software Inventory</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search software..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-md">Software Name</th>
                                    <th className="px-4 py-3">Version</th>
                                    <th className="px-4 py-3">Vendor</th>
                                    <th className="px-4 py-3">Installs</th>
                                    <th className="px-4 py-3">Vulnerabilities</th>
                                    <th className="px-4 py-3 rounded-r-md">Risk Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredSoftware.map((sw) => (
                                    <tr key={sw.id} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-4 py-3 font-medium text-foreground flex items-center">
                                            <Package className="mr-2 h-4 w-4 text-primary" />
                                            {sw.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{sw.version}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{sw.vendor}</td>
                                        <td className="px-4 py-3 text-foreground">{sw.install_count}</td>
                                        <td className="px-4 py-3">
                                            {sw.vulnerabilities > 0 ? (
                                                <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-0">
                                                    {sw.vulnerabilities} CVEs
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5">
                                                    Clean
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary" className={
                                                sw.risk_level === 'Critical' ? 'bg-red-500 text-white' :
                                                    sw.risk_level === 'High' ? 'bg-orange-500 text-white' :
                                                        sw.risk_level === 'Medium' ? 'bg-yellow-500 text-white' :
                                                            'bg-green-500 text-white'
                                            }>
                                                {sw.risk_level}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredSoftware.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                No software found matching your search.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
