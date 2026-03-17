import axios from 'axios';

// Map to Python Backend
const getBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        // Ensure it always starts with https in production unless localhost
        if (envUrl.includes('monitorix.co.in') && envUrl.startsWith('http:')) {
            return envUrl.replace('http:', 'https:');
        }
        return envUrl;
    }
    return 'https://sentinelx-api.monitorix.co.in/api/v1';
};

const BASE_URL = getBaseUrl();

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // window.location.href = '/login'; // Optional: Redirect
        }
        return Promise.reject(error);
    }
);

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        ME: '/users/me',
    },
    DASHBOARD: {
        STATS: '/dashboard/stats',
    },
    AGENTS: {
        LIST: '/agents/',
    },
    ALERTS: {
        LIST: '/alerts/',
    },
    TOPOLOGY: {
        GRAPH: '/topology/graph',
        NODES: '/topology/nodes',
    }
};

export const topologyService = {
    getGraph: async () => {
        return api.get(ENDPOINTS.TOPOLOGY.GRAPH);
    },
    createNode: async (nodeData: any) => {
        return api.post(ENDPOINTS.TOPOLOGY.NODES, nodeData);
    },
    updateNode: async (id: string, nodeData: any) => {
        return api.put(`${ENDPOINTS.TOPOLOGY.NODES}/${id}`, nodeData);
    },
    deleteNode: async (id: string) => {
        return api.delete(`${ENDPOINTS.TOPOLOGY.NODES}/${id}`);
    }
};

export const ENDPOINTS_CLOUD = {
    STATS: '/cloud/stats',
};

export const ENDPOINTS_THREAT = {
    LOGS: '/threat-hunting/logs',
};

export const ENDPOINTS_SOFTWARE = {
    INVENTORY: '/software/inventory',
};

export const ENDPOINTS_COMPLIANCE = {
    FRAMEWORKS: '/compliance/frameworks',
    EVIDENCE: '/compliance/evidence',
};

export const ENDPOINTS_AUDIT = {
    LOGS: '/audit/logs',
};

export const ENDPOINTS_TENANTS = {
    LIST: '/tenants/',
};

export const ENDPOINTS_DEVSECOPS = {
    METRICS: '/devsecops/metrics',
    PIPELINES: '/devsecops/pipelines',
};

export const cloudService = {
    getStats: async () => {
        return api.get(ENDPOINTS_CLOUD.STATS);
    }
};

export const threatHuntingService = {
    searchLogs: async (query?: string, timeRange?: string) => {
        return api.get(ENDPOINTS_THREAT.LOGS, { params: { query, time_range: timeRange } });
    }
};

export const softwareService = {
    getInventory: async () => {
        return api.get(ENDPOINTS_SOFTWARE.INVENTORY);
    }
};

export const complianceService = {
    getFrameworks: async () => {
        return api.get(ENDPOINTS_COMPLIANCE.FRAMEWORKS);
    },
    getEvidence: async (frameworkId: string) => {
        return api.get(`${ENDPOINTS_COMPLIANCE.EVIDENCE}/${frameworkId}`);
    },
    runScan: async (frameworkId: string) => {
        return api.post(`/compliance/scan/${frameworkId}`);
    }
};

export const auditService = {
    getLogs: async (query?: string) => {
        return api.get(ENDPOINTS_AUDIT.LOGS, { params: { query } });
    }
};

export const tenantsService = {
    getTenants: async () => {
        return api.get(ENDPOINTS_TENANTS.LIST);
    },
    createTenant: async (data: any) => {
        return api.post(ENDPOINTS_TENANTS.LIST, data);
    },
    updateTenant: async (id: string, data: any) => {
        return api.patch(`${ENDPOINTS_TENANTS.LIST}${id}/`, data);
    },
    deleteTenant: async (id: string) => {
        return api.delete(`${ENDPOINTS_TENANTS.LIST}${id}/`);
    }
};

export const devSecOpsService = {
    getMetrics: async () => {
        return api.get(ENDPOINTS_DEVSECOPS.METRICS);
    },
    getPipelines: async () => {
        return api.get(ENDPOINTS_DEVSECOPS.PIPELINES);
    }
};

export const alertsService = {
    getAlerts: async () => {
        return api.get(ENDPOINTS.ALERTS.LIST);
    }
};

export const agentsService = {
    getAgents: async (tenantId?: string) => {
        return api.get(ENDPOINTS.AGENTS.LIST, { params: { tenant_id: tenantId } });
    },
    getMetrics: async (agentId: string) => {
        return api.get(`${ENDPOINTS.AGENTS.LIST}/${agentId}/metrics`);
    },
    getSoftware: async (agentId: string) => {
        return api.get(`${ENDPOINTS.AGENTS.LIST}/${agentId}/software`);
    },
    getLogs: async (agentId: string) => {
        return api.get(`${ENDPOINTS.AGENTS.LIST}/${agentId}/logs`);
    }
};

export const insightsService = {
    getMetrics: async () => {
        return api.get('/insights/metrics');
    }
};

export const tracingService = {
    getTraces: async () => {
        return api.get('/tracing/');
    }
};

export const reportingService = {
    getReports: async () => {
        return api.get('/reports/');
    },
    generateReport: async (data: { title: string, type: string }) => {
        return api.post('/reports/generate', data);
    }
};

export const assetsService = {
    getAssets: async () => {
        return api.get('/assets/');
    }
};

export const jobsService = {
    getJobs: async () => {
        return api.get('/scheduler/jobs');
    }
};

export const patchingService = {
    getPatches: async () => {
        return api.get('/vuln');
    }
};

export const threatIntelService = {
    getIOCs: async () => {
        return api.get('/threat-intel-feed/');
    }
};

export const incidentsService = {
    getIncidents: async () => {
        return api.get('/incidents');
    },
    createIncident: async (incident: any) => {
        return api.post('/incidents', incident);
    },
    analyzeIncident: async (incidentId: string) => {
        return api.post(`/incidents/${incidentId}/analyze`);
    }
};

export const dataSecurityService = {
    getStats: async () => {
        return api.get('/data-security/stats');
    }
};

export const serviceCatalogService = {
    getServices: async () => {
        return api.get('/service-catalog/');
    }
};

export const chaosService = {
    getExperiments: async () => {
        return api.get('/chaos/');
    }
};

export const developerHubService = {
    getResources: async () => {
        return api.get('/developer-hub/');
    }
};

export const aiGovernanceService = {
    getModels: async () => {
        return api.get('/ai-governance/');
    }
};

export const llmOpsService = {
    getUsage: async () => {
        return api.get('/llmops/usage');
    }
};

export const policiesService = {
    getPolicies: async () => {
        return api.get('/policies/');
    },
    generatePolicy: async (prompt: string) => {
        return api.post('/policies/generate', { prompt });
    }
};

export const finOpsService = {
    getCosts: async () => {
        return api.get('/finops/costs');
    }
};

export const webhooksService = {
    getWebhooks: async () => {
        return api.get('/webhooks/');
    }
};

export const settingsService = {
    getSettings: async () => {
        return api.get('/settings/');
    },
    updateSettings: async (data: any) => {
        return api.post('/settings/', data);
    }
};

export const ENDPOINTS_IAC = {
    STACKS: '/iac/stacks',
    CONNECT: '/iac/connect',
    SYNC: '/iac/sync',
};

export const iacService = {
    getStacks: async () => {
        return api.get(ENDPOINTS_IAC.STACKS);
    },
    connectCloud: async (data: { provider: string, credentials: any }) => {
        return api.post(ENDPOINTS_IAC.CONNECT, data);
    },
    syncStacks: async () => {
        return api.post(ENDPOINTS_IAC.SYNC);
    }
};

export const zeroTrustService = {
    getDashboard: async () => {
        return api.get('/zero-trust/dashboard');
    }
};

export const sustainabilityService = {
    getDashboard: async () => {
        return api.get('/sustainability/dashboard');
    }
};

export const tasksService = {
    getTasks: async () => {
        return api.get('/tasks/');
    },
    createTask: async (task: any) => {
        return api.post('/tasks/', task);
    }
};

export const attackPathsService = {
    getPath: async () => {
        return api.get('/attack-paths/current');
    }
};

export const doraService = {
    getMetrics: async () => {
        return api.get('/dora/metrics');
    }
};

export const pricingService = {
    getPlans: async () => {
        return api.get('/pricing/plans');
    },
    createPlan: async (plan: any) => {
        return api.post('/pricing/plans', plan);
    }
};

export const futureOpsService = {
    getPredictions: async () => {
        return api.get('/future-ops/predictions');
    },
    getActions: async () => {
        return api.get('/future-ops/actions');
    },
    runMitigation: async (predictionId: string) => {
        return api.post(`/future-ops/run-action/${predictionId}`);
    },
    getHealth: async () => {
        return api.get('/future-ops/doctor/health');
    },
    healSystem: async (systemId: string, issue: string) => {
        return api.post(`/future-ops/doctor/heal/${systemId}?issue=${issue}`);
    }
};

export const swarmService = {
    getMissions: async () => {
        return api.get('/swarm/missions');
    },
    createMission: async (mission: any) => {
        return api.post('/swarm/missions', mission);
    },
    getEvents: async () => {
        return api.get('/swarm/events');
    }
};

export const forensicsService = {
    triggerDump: async (agentId: string) => {
        return api.post(`/forensics/dump/${agentId}`);
    },
    getArtifacts: async (agentId?: string) => {
        return api.get('/forensics/artifacts', { params: { agent_id: agentId } });
    }
};

export const soarService = {
    getPlaybooks: async () => {
        return api.get('/soar/playbooks');
    },
    getExecutions: async () => {
        return api.get('/soar/executions');
    },
    createPlaybook: async (data: any) => {
        return api.post('/soar/playbooks', data);
    },
    runPlaybook: async (id: string) => {
        return api.post(`/soar/run/${id}`);
    }
};

export const billingService = {
    getPlans: async () => {
        return api.get('/billing/plans');
    },
    getPaymentMethods: async () => {
        return api.get('/billing/payment-methods');
    },
    addPaymentMethod: async (data: any) => {
        return api.post('/billing/payment-methods', data);
    },
    subscribe: async (planId: string) => {
        return api.post(`/billing/subscribe?plan_id=${planId}`);
    }
};
