import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    type Node,
    type Edge,
    type Connection
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '@/components/topology/CustomNode';
import NodeProperties from '@/components/topology/NodeProperties';
import { topologyService } from '@/lib/api';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus, Filter } from 'lucide-react';

const nodeTypes = {
    custom: CustomNode,
};

const initialNodes: Node[] = [
    { id: '1', type: 'custom', position: { x: 250, y: 0 }, data: { label: 'Internet', type: 'internet', status: 'healthy', ip: '0.0.0.0' } },
    { id: '2', type: 'custom', position: { x: 250, y: 100 }, data: { label: 'Corp Firewall', type: 'firewall', status: 'healthy', ip: '10.0.0.1' } },
    { id: '3', type: 'custom', position: { x: 100, y: 200 }, data: { label: 'Web Svr 01', type: 'server', status: 'healthy', ip: '10.0.1.5' } },
    { id: '4', type: 'custom', position: { x: 400, y: 200 }, data: { label: 'Web Svr 02', type: 'server', status: 'warning', ip: '10.0.1.6' } },
    { id: '5', type: 'custom', position: { x: 250, y: 300 }, data: { label: 'Main DB Cluster', type: 'database', status: 'healthy', ip: '10.0.2.10' } },
    { id: '6', type: 'custom', position: { x: 50, y: 350 }, data: { label: 'Dev Workstation', type: 'pce', status: 'critical', ip: '192.168.1.50' } },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#22c55e' } },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e2-4', source: '2', target: '4', animated: true },
    { id: 'e3-5', source: '3', target: '5' },
    { id: 'e4-5', source: '4', target: '5' },
    { id: 'e2-6', source: '2', target: '6', type: 'smoothstep', animated: true, style: { stroke: '#ef4444' } },
];

export default function NetworkTopology() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await topologyService.getGraph();
                setNodes(response.data.nodes);
                setEdges(response.data.edges);
            } catch (error) {
                console.error("Failed to fetch topology:", error);
                setNodes(initialNodes);
                setEdges(initialEdges);
            }
        };
        fetchData();
    }, [setNodes, setEdges]);

    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }, []);

    const handleAddNode = useCallback(() => {
        const id = `${nodes.length + 1}`;
        const newNode: Node = {
            id,
            type: 'custom',
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            data: {
                label: `New Node ${id}`,
                type: 'server',
                status: 'healthy',
                ip: `10.0.99.${id}`
            },
        };
        setNodes((nds) => [...nds, newNode]);
    }, [nodes, setNodes]);

    const handleUpdateNode = (id: string, newData: any) => {
        setNodes((nds) => nds.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    data: { ...node.data, ...newData }
                };
            }
            return node;
        }));
        // Update the selected node reference to reflect changes immediately in the panel
        setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, ...newData } } : null);
    };

    const handleDeleteNode = (id: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== id));
        setSelectedNode(null);
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 relative">
            {/* Properties Panel Overlay */}
            {selectedNode && (
                <NodeProperties
                    node={selectedNode}
                    onUpdate={handleUpdateNode}
                    onDelete={handleDeleteNode}
                    onClose={() => setSelectedNode(null)}
                />
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Network Topology</h2>
                    <p className="text-muted-foreground">Visualize infrastructure, connectivity, and health status.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                    <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
                    <Button onClick={handleAddNode}><Plus className="mr-2 h-4 w-4" /> Add Node</Button>
                </div>
            </div>

            <Card className="flex-1 overflow-hidden border-border bg-card/50 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-background-secondary"
                >
                    <Controls />
                    <MiniMap className="bg-card border border-border" />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>
            </Card>
        </div>
    );
}
