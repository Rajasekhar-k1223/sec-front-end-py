import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import type { JSX } from 'react';

// Pages
import Dashboard from '@/pages/Dashboard';
import CxoDashboard from '@/pages/CxoDashboard';
import Agents from '@/pages/Agents';
import Alerts from '@/pages/Alerts';
import LiveMonitor from '@/pages/LiveMonitor';
import Settings from '@/pages/Settings';
import NetworkTopology from '@/pages/NetworkTopology';
import SecurityOps from '@/pages/SecurityOps';
import CloudSecurity from '@/pages/CloudSecurity';
import ThreatHunting from '@/pages/ThreatHunting';
import SoftwareHub from '@/pages/SoftwareHub';
import ComplianceManager from '@/pages/ComplianceManager';
import AuditLogs from '@/pages/AuditLogs';
import TenantsManagement from '@/pages/TenantsManagement';
import DevSecOps from '@/pages/DevSecOps';
import DoraMetrics from '@/pages/DoraMetrics';
import Tasks from '@/pages/Tasks';

// New Pages (Observability)
import Insights from '@/pages/Insights';
import Tracing from '@/pages/Tracing';
import Reporting from '@/pages/Reporting';
import LogExplorer from '@/pages/LogExplorer';
import Assets from '@/pages/Assets';
import Jobs from '@/pages/Jobs';

// New Pages (Security)
import Patching from '@/pages/Patching';
import ThreatIntel from '@/pages/ThreatIntel';
import Incidents from '@/pages/Incidents';
import DataSecurity from '@/pages/DataSecurity';
import AttackPaths from '@/pages/AttackPaths';

// New Pages (Dev & Platform)
import ServiceCatalog from '@/pages/ServiceCatalog';
import ChaosEngineering from '@/pages/ChaosEngineering';
import DeveloperHub from '@/pages/DeveloperHub';

// New Pages (Governance)
import AiGovernance from '@/pages/AiGovernance';
import LlmOps from '@/pages/LlmOps';
import Policies from '@/pages/Policies';

// New Pages (Admin)
import FinOps from '@/pages/FinOps';
import ServicePricing from '@/pages/ServicePricing';
import Webhooks from '@/pages/Webhooks';

// Vision Pages
import Sustainability from '@/pages/Sustainability';
import ZeroTrust from '@/pages/ZeroTrust';
import FutureOps from '@/pages/FutureOps';
import SwarmIntelligence from '@/pages/SwarmIntelligence';
import IaCManager from '@/pages/IaCManager';


// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Main */}
            <Route path="cxo-dashboard" element={<CxoDashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />

            {/* Observability */}
            <Route path="insights" element={<Insights />} />
            <Route path="tracing" element={<Tracing />} />
            <Route path="reporting" element={<Reporting />} />
            <Route path="logs" element={<LogExplorer />} />
            <Route path="network" element={<NetworkTopology />} />
            <Route path="agents" element={<Agents />} />
            <Route path="monitor" element={<LiveMonitor />} />
            <Route path="software" element={<SoftwareHub />} />
            <Route path="assets" element={<Assets />} />
            <Route path="jobs" element={<Jobs />} />

            {/* Security */}
            <Route path="patching" element={<Patching />} />
            <Route path="cloud-security" element={<CloudSecurity />} />
            <Route path="iac" element={<IaCManager />} />
            <Route path="sec-ops" element={<SecurityOps />} />
            <Route path="threat-hunting" element={<ThreatHunting />} />
            <Route path="threat-intel" element={<ThreatIntel />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="data-security" element={<DataSecurity />} />
            <Route path="attack-paths" element={<AttackPaths />} />
            <Route path="alerts" element={<Alerts />} />

            {/* Dev & Platform */}
            <Route path="devsecops" element={<DevSecOps />} />
            <Route path="dora" element={<DoraMetrics />} />
            <Route path="catalog" element={<ServiceCatalog />} />
            <Route path="chaos" element={<ChaosEngineering />} />
            <Route path="dev-hub" element={<DeveloperHub />} />

            {/* Governance */}
            <Route path="compliance" element={<ComplianceManager />} />
            <Route path="ai-gov" element={<AiGovernance />} />
            <Route path="llmops" element={<LlmOps />} />
            <Route path="automation" element={<Policies />} />

            {/* Administration */}
            <Route path="finops" element={<FinOps />} />
            <Route path="pricing" element={<ServicePricing />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="webhooks" element={<Webhooks />} />
            <Route path="settings" element={<Settings />} />
            <Route path="tenants" element={<TenantsManagement />} />

            {/* Vision */}
            <Route path="sustainability" element={<Sustainability />} />
            <Route path="zero-trust" element={<ZeroTrust />} />
            <Route path="future-ops" element={<FutureOps />} />
            <Route path="swarm" element={<SwarmIntelligence />} />

          </Route>
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
