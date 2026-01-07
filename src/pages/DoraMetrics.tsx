import {
    DeploymentFrequencyChart,
    LeadTimeChart,
    ChangeFailureRateChart,
    MTTRChart,
} from '@/components/devsecops/DoraCharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function DoraMetrics() {
    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">DORA Metrics</h2>
                    <p className="text-muted-foreground">DevOps Research and Assessment (DORA) Key Performance Indicators.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Report</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <DeploymentFrequencyChart />
                <LeadTimeChart />
                <MTTRChart />
                <ChangeFailureRateChart />
            </div>
        </div>
    );
}
