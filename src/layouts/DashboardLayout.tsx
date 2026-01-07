import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    Shield,
    AlertTriangle,
    Activity,
    Settings,
    LogOut,
    Menu,
    User,
    Search,
    Bell,
    CheckSquare,
    LineChart,
    FileText,
    List,
    Network,
    Package,
    Server,
    GitBranch, // Job Orchestration
    RefreshCw, // Patching
    Cloud,
    ShieldAlert,
    Crosshair,
    Globe,
    Zap,
    Lock,
    Map,
    Code,
    BarChart,
    BookOpen,
    Bomb,
    Terminal,
    FileCheck,
    Cpu, // LLMOps
    Bot, // Automation
    DollarSign,
    Tag,
    ClipboardList,
    Webhook,
    Users, // Tenants
    Leaf,
    Rocket,
    Share2,
    Brain,
    Home,
    Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';

// Define Navigation Structure
type NavItem = {
    icon: any;
    label: string;
    path: string;
};

type NavGroup = {
    title?: string;
    items: NavItem[];
};

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navGroups: (NavGroup & { roles?: string[] })[] = [
        {
            title: "MAIN",
            items: [
                { icon: LayoutDashboard, label: 'CXOs Dashboard', path: '/cxo-dashboard' },
                { icon: Home, label: 'Dashboard', path: '/dashboard' },
                { icon: CheckSquare, label: 'My Tasks', path: '/tasks' },
            ]
        },
        {
            title: "OBSERVABILITY",
            items: [
                { icon: LineChart, label: 'Insights', path: '/insights' },
                { icon: Activity, label: 'Tracing', path: '/tracing' },
                { icon: FileText, label: 'Reporting', path: '/reporting' },
                { icon: List, label: 'Log Explorer', path: '/logs' },
                { icon: Network, label: 'Network', path: '/network' },
                { icon: Shield, label: 'Agents', path: '/agents' },
                { icon: Activity, label: 'Live Monitor', path: '/monitor' }, // Keeping this active
                { icon: Package, label: 'Software Hub', path: '/software' },
                { icon: Server, label: 'Assets', path: '/assets' },
                { icon: GitBranch, label: 'Job Orchestration', path: '/jobs' },
            ]
        },
        {
            title: "SECURITY",
            items: [
                { icon: RefreshCw, label: 'Patching', path: '/patching' },
                { icon: Cloud, label: 'Cloud Security', path: '/cloud-security' },
                { icon: Layers, label: 'IaC Manager', path: '/iac' },
                { icon: ShieldAlert, label: 'Security Ops', path: '/sec-ops' },
                { icon: Crosshair, label: 'Threat Hunting', path: '/threat-hunting' },
                { icon: Globe, label: 'Threat Intelligence', path: '/threat-intel' },
                { icon: Zap, label: 'Incident Impact', path: '/incidents' },
                { icon: Lock, label: 'Data Security', path: '/data-security' },
                { icon: Map, label: 'Attack Paths', path: '/attack-paths' },
                { icon: AlertTriangle, label: 'Alerts', path: '/alerts' }, // Keeping this active
            ]
        },
        {
            title: "DEV & PLATFORM",
            items: [
                { icon: Code, label: 'DevSecOps', path: '/devsecops' },
                { icon: BarChart, label: 'DORA Metrics', path: '/dora' },
                { icon: BookOpen, label: 'Service Catalog', path: '/catalog' },
                { icon: Bomb, label: 'Chaos Engineering', path: '/chaos' },
                { icon: Terminal, label: 'Developer Hub', path: '/dev-hub' },
            ]
        },
        {
            title: "GOVERNANCE",
            items: [
                { icon: FileCheck, label: 'Compliance', path: '/compliance' },
                { icon: Brain, label: 'AI Governance', path: '/ai-gov' },
                { icon: Cpu, label: 'LLMOps & Knowledge', path: '/llmops' },
                { icon: Bot, label: 'Automation', path: '/automation' },
            ]
        },
        {
            title: "ADMINISTRATION",
            roles: ['admin'],
            items: [
                { icon: DollarSign, label: 'FinOps & Billing', path: '/finops' },
                { icon: Tag, label: 'Service Pricing', path: '/pricing' },
                { icon: ClipboardList, label: 'Audit Log', path: '/audit-logs' },
                { icon: Webhook, label: 'Webhooks', path: '/webhooks' },
                { icon: Settings, label: 'Settings', path: '/settings' },
                { icon: Users, label: 'Tenants', path: '/tenants' },
            ]
        },
        {
            title: "2030 VISION",
            roles: ['admin', 'analyst', 'viewer'], // Everyone
            items: [
                { icon: Leaf, label: 'Sustainability', path: '/sustainability' },
                { icon: Lock, label: 'Zero Trust & Quantum', path: '/zero-trust' },
                { icon: Rocket, label: 'Future Ops', path: '/future-ops' },
                { icon: Share2, label: 'Swarm Intelligence', path: '/swarm' },
            ]
        }
    ];

    // Filter Navigation based on Role
    const filteredNavGroups = navGroups.filter(group => {
        // Special Case: Administration Group requires Superuser
        if (group.title === "ADMINISTRATION") {
            return user?.is_superuser === true;
        }

        if (!group.roles) return true; // No restriction
        return group.roles.includes(user?.role || 'viewer'); // Default to viewer if no role
    });

    return (
        <div className="min-h-screen bg-background flex overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col",
                    isSidebarOpen ? "w-72" : "w-20"
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
                    <Shield className="h-8 w-8 text-primary shrink-0" />
                    {isSidebarOpen && (
                        <span className="ml-3 font-bold text-xl tracking-tight text-foreground animate-in fade-in duration-300 whitespace-nowrap">
                            Omni-Agent AI
                        </span>
                    )}
                </div>

                {/* Navigation (Scrollable) */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8 custom-scrollbar">
                    {filteredNavGroups.map((group, groupIndex) => (
                        <div key={group.title || groupIndex} className="space-y-2">
                            {/* Group Title */}
                            {isSidebarOpen && group.title && (
                                <h3 className="px-3 text-xs font-semibold text-muted-foreground tracking-wider mb-2">
                                    {group.title}
                                </h3>
                            )}

                            {/* Group Items */}
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => cn(
                                        "flex items-center px-3 py-2 rounded-lg transition-colors group relative",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                                        !isSidebarOpen && "justify-center"
                                    )}
                                    title={!isSidebarOpen ? item.label : undefined}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {isSidebarOpen && (
                                        <span className="ml-3 font-medium truncate animate-in fade-in duration-200 text-sm">
                                            {item.label}
                                        </span>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* User Footer (Fixed at bottom) */}
                <div className="p-4 border-t border-border bg-card shrink-0">
                    <div className={cn("flex items-center", isSidebarOpen ? "justify-between" : "justify-center")}>
                        {isSidebarOpen && (
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{user?.full_name || user?.email || 'Admin'}</p>
                                    <p className="text-xs text-muted-foreground truncate uppercase">{user?.role || 'Viewer'}</p>
                                </div>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="text-muted-foreground hover:text-destructive shrink-0"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn(
                "flex-1 transition-all duration-300 flex flex-col h-screen overflow-hidden",
                isSidebarOpen ? "ml-72" : "ml-20"
            )}>
                {/* Header */}
                <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="mr-4"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Search Placeholder */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="h-9 w-64 rounded-md border border-input bg-secondary/50 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"></span>
                        </Button>

                        <ModeToggle />
                    </div>
                </header>

                {/* Page Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
