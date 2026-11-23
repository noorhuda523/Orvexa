import { Route, Routes } from 'react-router-dom';
import MarketingLayout from './layouts/MarketingLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Features from './pages/Features';
import Solutions from './pages/Solutions';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Changelog from './pages/Changelog';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Workflows from './pages/Workflows';
import Analytics from './pages/Analytics';
import AIAgents from './pages/AIAgents';
import AIPlayground from './pages/AIPlayground';
import AIContentGenerator from './pages/AIContentGenerator';
import IntegrationsPage from './pages/IntegrationsPage';
import Team from './pages/Team';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route index element={<Home />} />
        <Route path="features" element={<Features />} />
        <Route path="solutions" element={<Solutions />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="changelog" element={<Changelog />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
      <Route path="app" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="workflows" element={<Workflows />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="agents" element={<AIAgents />} />
        <Route path="playground" element={<AIPlayground />} />
        <Route path="content-generator" element={<AIContentGenerator />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="team" element={<Team />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="help" element={<Help />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings/*" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
