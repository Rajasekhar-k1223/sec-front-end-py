import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Github, Server, Code } from 'lucide-react';
import { serviceCatalogService } from '@/lib/api';

interface Service {
    id: string;
    name: string;
    description: string;
    owner: string;
    language: string;
    framework: string;
    status: string;
    repo_url: string;
}

export default function ServiceCatalog() {
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        const mockServices: Service[] = [
            { id: '1', name: 'user-auth-service', description: 'Centralized authentication and authorization provider via OIDC.', owner: 'Identity Team', language: 'Go', framework: 'Gin', status: 'active', repo_url: '#' },
            { id: '2', name: 'payment-gateway', description: 'Handles credit card processing and transactional emails.', owner: 'FinTech Squad', language: 'Node.js', framework: 'Express', status: 'active', repo_url: '#' },
            { id: '3', name: 'data-processor', description: 'Async ETL jobs for log ingestion and aggregation.', owner: 'Data Eng', language: 'Python', framework: 'FastAPI', status: 'maintenance', repo_url: '#' },
            { id: '4', name: 'frontend-dashboard', description: 'Main React application for the Omni-Agent platform.', owner: 'Frontend Guild', language: 'TypeScript', framework: 'React', status: 'active', repo_url: '#' },
            { id: '5', name: 'audit-logger', description: 'Immutable ledger for all system update events.', owner: 'Security Team', language: 'Java', framework: 'Spring Boot', status: 'deprecated', repo_url: '#' },
        ];

        const fetchServices = async () => {
            try {
                const response = await serviceCatalogService.getServices();
                if (response.data && response.data.length > 0) {
                    setServices(response.data);
                } else {
                    setServices(mockServices);
                }
            } catch (error) {
                console.warn("Using mock services:", error);
                setServices(mockServices);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Service Catalog</h2>
                    <p className="text-muted-foreground">Internal microservices registry and ownership.</p>
                </div>
                <Button>+ Register Service</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <Card key={service.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl flex items-center">
                                    <Server className="mr-2 h-5 w-5 text-primary" />
                                    {service.name}
                                </CardTitle>
                                <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                                    {service.status}
                                </Badge>
                            </div>
                            <CardDescription className="line-clamp-2">
                                {service.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-sm text-muted-foreground space-y-2">
                                <div className="flex items-center">
                                    <span className="font-semibold w-24">Owner:</span>
                                    <span>{service.owner}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-24">Tech Stack:</span>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-xs">{service.language}</Badge>
                                        <Badge variant="outline" className="text-xs">{service.framework}</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-4 bg-secondary/10 mt-auto">
                            <Button variant="ghost" size="sm" className="h-8">
                                <BookOpen className="h-4 w-4 mr-1" /> Docs
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8">
                                <Github className="h-4 w-4 mr-1" /> Repo
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
