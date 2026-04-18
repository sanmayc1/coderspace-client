
import { getCompanyDashboard } from '@/api/company/company';
import type { ChartItem, QuickTab } from '@/types/response.types';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { Trophy, Users, Activity, Calendar, ArrowUpRight, TrendingUp, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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


const Dashboard = () => {

  const [monthlyParticipantsData,setmonthlyParticipantsData] = useState<ChartItem[]>()
  const [quickTabs,setQuickTabs] = useState<QuickTab>()

  useEffect(()=>{
  async  function fetchDashboard(){
    try {
      const res = await getCompanyDashboard()
      setmonthlyParticipantsData(res.data.chart)
      setQuickTabs(res.data.quicktab)
     
    } catch (error) {
      toast.error("Something Went wrong",toastifyOptionsCenter)
    }
  }
  fetchDashboard()
  },[])

  const statCards = [
    {
      title: 'Total Contests',
      value: quickTabs?.totalContests.toLocaleString() ?? '0',
      change: '',
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      bgColor: 'bg-yellow-50',
      trendColor: 'text-green-500',
    },
    {
      title: 'Total Participants',
      value: quickTabs?.totalParticipants.toLocaleString() ?? '0',
      change: '',
      icon: <Users className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-50',
      trendColor: 'text-green-500',
    },
    {
      title: 'Active Contests',
      value: quickTabs?.activeContests.toLocaleString() ?? '0',
      change: 'Running Today',
      icon: <Activity className="w-6 h-6 text-emerald-500" />,
      bgColor: 'bg-emerald-50',
      trendColor: 'text-emerald-500',
    },
    {
      title: 'Upcoming',
      value: quickTabs?.upcomingContests.toLocaleString() ?? '0',
      change: '',
      icon: <Calendar className="w-6 h-6 text-purple-500" />,
      bgColor: 'bg-purple-50',
      trendColor: 'text-purple-500',
    },
  ];

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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Engagement Overview
            </h3>
        
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


      </div>


    </div>
  );
};

export default Dashboard;
