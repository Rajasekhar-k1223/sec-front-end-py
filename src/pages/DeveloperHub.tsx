import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Hammer, LifeBuoy, ExternalLink } from 'lucide-react';
import { developerHubService } from '@/lib/api';

interface Resource {
    id: string;
    title: string;
    type: string;
    url: string;
    description: string;
}

export default function DeveloperHub() {
    const [resources, setResources] = useState<Resource[]>([]);

    useEffect(() => {
        const mockResources: Resource[] = [
            { id: '1', title: 'API Documentation', type: 'doc', url: '#', description: 'Comprehensive reference for all internal Microservices APIs.' },
            { id: '2', title: 'CLI Tool (acme-cli)', type: 'tool', url: '#', description: 'Command line interface for managing cloud resources and deployments.' },
            { id: '3', title: 'Onboarding Guide', type: 'guide', url: '#', description: 'Step-by-step setup for new engineers joining the team.' },
            { id: '4', title: 'Design System', type: 'tool', url: '#', description: 'React UI component library and visual style guide.' },
            { id: '5', title: 'Security Principles', type: 'guide', url: '#', description: 'Best practices for writing secure code and handling PII.' },
            { id: '6', title: 'Python SDK', type: 'doc', url: '#', description: 'Client library for interacting with the main platform via Python.' },
        ];

        const fetchResources = async () => {
            try {
                const response = await developerHubService.getResources();
                if (response.data && response.data.length > 0) {
                    setResources(response.data);
                } else {
                    setResources(mockResources);
                }
            } catch (error) {
                console.warn("Using mock developer resources:", error);
                setResources(mockResources);
            }
        };
        fetchResources();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'doc': return <Book className="h-6 w-6 text-blue-500" />;
            case 'tool': return <Hammer className="h-6 w-6 text-purple-500" />;
            case 'guide': return <LifeBuoy className="h-6 w-6 text-green-500" />;
            default: return <Book className="h-6 w-6" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center py-10">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Developer Hub</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Everything you need to build, ship, and scale at Acme Corp.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((res) => (
                    <Card key={res.id} className="hover:shadow-lg transition-shadow cursor-pointer border-dashed hover:border-solid">
                        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                            <div className="mr-4 bg-secondary/20 p-2 rounded-full">
                                {getIcon(res.type)}
                            </div>
                            <CardTitle className="text-lg">{res.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4 h-10">{res.description}</p>
                            <Button variant="link" className="px-0">
                                Open Resource <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
