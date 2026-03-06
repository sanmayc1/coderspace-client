import React from 'react';
import { Users, Code2, Video, CreditCard, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

// --- Mock Data ---
// In a real application, you would fetch this data from your admin API endpoints
const monthlyGrowthData = [
  { name: 'Jan', users: 400, revenue: 2400 },
  { name: 'Feb', users: 600, revenue: 3200 },
  { name: 'Mar', users: 800, revenue: 4100 },
  { name: 'Apr', users: 1200, revenue: 5800 },
  { name: 'May', users: 1600, revenue: 7200 },
  { name: 'Jun', users: 2100, revenue: 9500 },
];

const activityData = [
  { name: 'Mon', problems: 120, interviews: 45 },
  { name: 'Tue', problems: 150, interviews: 52 },
  { name: 'Wed', problems: 180, interviews: 61 },
  { name: 'Thu', problems: 140, interviews: 58 },
  { name: 'Fri', problems: 200, interviews: 70 },
  { name: 'Sat', problems: 250, interviews: 85 },
  { name: 'Sun', problems: 220, interviews: 75 },
];

const statCards = [
  {
    title: 'Total Users',
    value: '12,450',
    change: '+12%',
    icon: <Users className="w-6 h-6 text-blue-500" />,
    bgColor: 'bg-blue-50',
    trendColor: 'text-green-500',
  },
  {
    title: 'Active Subscriptions',
    value: '1,240',
    change: '+18%',
    icon: <CreditCard className="w-6 h-6 text-purple-500" />,
    bgColor: 'bg-purple-50',
    trendColor: 'text-green-500',
  },
  {
    title: 'Problems Created',
    value: '842',
    change: '+5%',
    icon: <Code2 className="w-6 h-6 text-emerald-500" />,
    bgColor: 'bg-emerald-50',
    trendColor: 'text-green-500',
  },
  {
    title: 'Interviews Conducted',
    value: '3,210',
    change: '+24%',
    icon: <Video className="w-6 h-6 text-rose-500" />,
    bgColor: 'bg-rose-50',
    trendColor: 'text-green-500',
  },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto dark:text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium">System Status: Online</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor} dark:bg-gray-700/50`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-sm font-medium flex items-center ${stat.trendColor}`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart - Revenue & Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Growth Metrics</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
              View Report <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyGrowthData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280' }}
                  dy={10}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Active Users"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue ($)"
                />
                <Legend verticalAlign="top" height={36} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart - Platform Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-1">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Weekly Platform Activity
            </h3>
            <p className="text-sm text-gray-500 mt-1">Problems solved vs. Interviews taken</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={20}
                  wrapperStyle={{ fontSize: '12px', marginTop: '10px' }}
                />
                <Bar
                  dataKey="problems"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Problems"
                  maxBarSize={40}
                />
                <Bar
                  dataKey="interviews"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  name="Interviews"
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Mini List (Optional filler) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Links & Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Manage Users', 'Review Problems', 'Interview Analytics', 'Billing Center'].map(
            (action, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                  {action}
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-auto mt-2" />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
