
import { Trophy, Users, Activity, Calendar, ArrowUpRight, TrendingUp, Clock } from 'lucide-react';
import {
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
const monthlyParticipantsData = [
  { name: 'Jan', participants: 120, submissions: 450 },
  { name: 'Feb', participants: 250, submissions: 800 },
  { name: 'Mar', participants: 380, submissions: 1200 },
  { name: 'Apr', participants: 420, submissions: 1600 },
  { name: 'May', participants: 600, submissions: 2100 },
  { name: 'Jun', participants: 850, submissions: 3200 },
];

const submissionsData = [
  { name: 'Mon', passed: 45, failed: 12 },
  { name: 'Tue', passed: 60, failed: 15 },
  { name: 'Wed', passed: 80, failed: 20 },
  { name: 'Thu', passed: 55, failed: 22 },
  { name: 'Fri', passed: 90, failed: 18 },
  { name: 'Sat', passed: 120, failed: 35 },
  { name: 'Sun', passed: 105, failed: 25 },
];

const statCards = [
  {
    title: 'Total Contests',
    value: '24',
    change: '+3 this month',
    icon: <Trophy className="w-6 h-6 text-yellow-500" />,
    bgColor: 'bg-yellow-50',
    trendColor: 'text-green-500',
  },
  {
    title: 'Total Participants',
    value: '4,250',
    change: '+15%',
    icon: <Users className="w-6 h-6 text-blue-500" />,
    bgColor: 'bg-blue-50',
    trendColor: 'text-green-500',
  },
  {
    title: 'Active Contests',
    value: '3',
    change: 'Running now',
    icon: <Activity className="w-6 h-6 text-emerald-500" />,
    bgColor: 'bg-emerald-50',
    trendColor: 'text-emerald-500',
  },
  {
    title: 'Upcoming',
    value: '2',
    change: 'Next in 2 days',
    icon: <Calendar className="w-6 h-6 text-purple-500" />,
    bgColor: 'bg-purple-50',
    trendColor: 'text-purple-500',
  },
];

const recentContests = [
  { name: 'Weekly Code Challenge #45', date: '2026-03-01', participants: 340, status: 'Completed' },
  {
    name: 'Frontend Masterclass Hackathon',
    date: '2026-03-05',
    participants: 120,
    status: 'Active',
  },
  { name: 'Data Structures Sprint', date: '2026-03-10', participants: 0, status: 'Upcoming' },
  { name: 'AI/ML Innovators Cup', date: '2026-03-15', participants: 0, status: 'Upcoming' },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto dark:text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Company Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Overview of your contests and engagement.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">Last updated: Just now</span>
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
                {stat.change.includes('+') && <TrendingUp className="w-4 h-4 mr-1" />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart - Participants & Submissions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Engagement Overview
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
              Detailed Analytics <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyParticipantsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorParticipants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                  dataKey="participants"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorParticipants)"
                  name="Participants"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="submissions"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSubmissions)"
                  name="Submissions"
                />
                <Legend verticalAlign="top" height={36} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart - Latest Contest Submissions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-1">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Submissions Status
            </h3>
            <p className="text-sm text-gray-500 mt-1">Pass vs Fail rate for this week</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
                  dataKey="passed"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Passed"
                  maxBarSize={40}
                  stackId="a"
                />
                <Bar
                  dataKey="failed"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="Failed"
                  maxBarSize={40}
                  stackId="a"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Contests Mini List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Contests</h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 font-medium rounded-l-lg">Contest Name</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Participants</th>
                <th className="px-4 py-3 font-medium rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentContests.map((contest, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {contest.name}
                  </td>
                  <td className="px-4 py-3">{contest.date}</td>
                  <td className="px-4 py-3">{contest.participants.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        contest.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : contest.status === 'Upcoming'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {contest.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
