import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Webhook as WebhookIcon, Trash2, Edit } from 'lucide-react';
import { webhooksService } from '@/lib/api';

interface Webhook {
    id: string;
    name: string;
    url: string;
    events: string[];
    status: string;
}

export default function Webhooks() {
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);

    useEffect(() => {
        const mockWebhooks: Webhook[] = [
            { id: '1', name: 'Slack Alerts - #prod-ops', url: 'https://example.com/hooks/slack-placeholder', events: ['alert.critical', 'deployment.failed'], status: 'active' },
            { id: '2', name: 'PagerDuty', url: 'https://events.pagerduty.com/v2/enqueue', events: ['incident.triggered'], status: 'active' },
            { id: '3', name: 'Jira Integration', url: 'https://automation.atlassian.com/pro/hooks/xxxxxxxx', events: ['issue.created'], status: 'inactive' },
            { id: '4', name: 'Splunk Ingest', url: 'https://http-inputs-acme.splunkcloud.com/hec', events: ['audit.log', 'security.event'], status: 'active' },
            { id: '5', name: 'Jenkins Trigger', url: 'https://jenkins.internal/generic-webhook-trigger/invoke', events: ['repo.push'], status: 'active' },
        ];

        const fetchWebhooks = async () => {
            try {
                const response = await webhooksService.getWebhooks();
                if (response.data && response.data.length > 0) {
                    setWebhooks(response.data);
                } else {
                    setWebhooks(mockWebhooks);
                }
            } catch (error) {
                console.warn("Using mock webhooks:", error);
                setWebhooks(mockWebhooks);
            }
        };
        fetchWebhooks();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Webhooks</h2>
                    <p className="text-muted-foreground">Configure outbound event notifications.</p>
                </div>
                <Button>+ New Webhook</Button>
            </div>

            <div className="rounded-md border border-border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-medium text-sm text-muted-foreground">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-4">Target URL</div>
                    <div className="col-span-3">Subscribed Events</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>

                {webhooks.map((wh) => (
                    <div key={wh.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/10 items-center text-sm transition-colors">
                        <div className="col-span-3 font-medium flex items-center space-x-2">
                            <WebhookIcon className="h-4 w-4 text-primary" />
                            <span>{wh.name}</span>
                        </div>
                        <div className="col-span-4 font-mono text-xs truncate" title={wh.url}>{wh.url}</div>
                        <div className="col-span-3 flex flex-wrap gap-1">
                            {wh.events.map(ev => <Badge key={ev} variant="secondary" className="text-[10px]">{ev}</Badge>)}
                        </div>
                        <div className="col-span-2 text-right">
                            <Badge variant={wh.status === 'active' ? 'outline' : 'destructive'} className="uppercase">
                                {wh.status}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
