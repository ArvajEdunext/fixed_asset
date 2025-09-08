import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/Button';
import { Progress } from '../components/ui/progress';
import { 
  Package, 
  CheckCircle, 
  Wrench, 
  DollarSign,
  BarChart3,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Eye
} from 'lucide-react';
import { fetchDashboardData } from '../redux/slices/dashboardSlice';
import { formatCurrency, formatNumber } from '../lib/utils';

const StatCard = ({ title, value, icon: Icon, bgColor, textColor, subtitle, trend }) => (
  <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between break-all">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl  ${bgColor}`}>
          <Icon className={`h-8 w-8 ${textColor}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ActivityItem = ({ activity }) => {
  const getIcon = (iconName) => {
    const icons = {
      Package,
      Wrench,
      CheckCircle,
    };
    return icons[iconName] || Package;
  };

  const Icon = getIcon(activity.icon);
  
  return (
    <div className="flex items-start space-x-4 p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
      <div className="p-2 bg-slate-100 rounded-lg">
        <Icon className="h-4 w-4 text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900">{activity.title}</h4>
        <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
        {activity.location && (
          <p className="text-xs text-slate-500 mt-1 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {activity.location}
          </p>
        )}
        {activity.details && (
          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {activity.details.split('|')[0]}
            </span>
            <span className="flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              {activity.details.split('|')[1]}
            </span>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-2">{activity.time}</p>
      </div>
    </div>
  );
};

const AlertItem = ({ alert }) => {
  const getIcon = (iconName) => {
    const icons = {
      AlertCircle: Clock,
      Wrench,
      CheckCircle,
    };
    return icons[iconName] || Clock;
  };

  const Icon = getIcon(alert.icon);
  
  return (
    <div className="flex items-start space-x-3 p-4 border-l-4 border-l-red-500 bg-red-50 rounded-lg mb-3">
      <Icon className={`h-5 w-5 mt-0.5 ${alert.color}`} />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900">{alert.title}</h4>
        <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
        {alert.info && <p className="text-xs text-slate-500 mt-1">{alert.info}</p>}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { 
    summary, 
    assetDistribution, 
    assetStatusOverview, 
    recentActivities, 
    importantAlerts, 
    complianceData,
    loading 
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
        <p className="text-slate-600">Monitor your asset portfolio and track key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Assets"
          value={formatNumber(summary.totalAssets)}
          icon={Package}
          trend={5.2}
          bgColor="bg-blue-100"
          textColor="text-blue-600"
        />
        <StatCard
          title="Active Assets"
          value={formatNumber(summary.activeAssets)}
          icon={CheckCircle}
          trend={3.1}
          bgColor="bg-emerald-100"
          textColor="text-emerald-600"
        />
        <StatCard
          title="Maintenance Due/AMC Due"
          value={formatNumber(summary.maintenanceDue)}
          icon={Wrench}
          trend={-1.2}
          bgColor="bg-amber-100"
          textColor="text-amber-600"
        />
        <StatCard
          title="Total Asset Value"
          value={formatCurrency(summary.totalValue)}
          icon={DollarSign}
          trend={-8.5}
          bgColor="bg-purple-100"
          textColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Distribution Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Asset Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assetDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm text-slate-500">- {item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Simulated Pie Chart Visual */}
            <div className="mt-6 flex justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full" style={{
                  background: `conic-gradient(
                    #3B82F6 0deg ${38 * 3.6}deg,
                    #F59E0B ${38 * 3.6}deg ${(38 + 26) * 3.6}deg,
                    #10B981 ${(38 + 26) * 3.6}deg ${(38 + 26 + 14) * 3.6}deg,
                    #6B7280 ${(38 + 26 + 14) * 3.6}deg ${(38 + 26 + 14 + 12) * 3.6}deg,
                    #8B5CF6 ${(38 + 26 + 14 + 12) * 3.6}deg 360deg
                  )`
                }} />
                <div className="absolute inset-4 bg-white rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Value Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Asset Value Trend
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span>Assets Value</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>Depreciation Value</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-end justify-center p-4">
              <div className="text-center text-slate-500">
                <BarChart3 className="h-16 w-16 mx-auto mb-2 text-slate-400" />
                <p>Asset Value Trend Chart</p>
                <p className="text-sm">Current Value: {formatCurrency(summary.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </CardContent>
        </Card>

        {/* Important Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Important Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {importantAlerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
            <Button variant="link" className="w-full text-blue-600 p-0">
              <Eye className="h-4 w-4 mr-2" />
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Asset Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Status Overview</CardTitle>
            <p className="text-sm text-slate-500">Last Service: 09-12-2025</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assetStatusOverview.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-emerald-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium">{status.status}</span>
                    <span className="text-sm text-slate-500">{status.count} ({status.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Status Distribution Visual */}
            <div className="mt-6 flex justify-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full" style={{
                  background: `conic-gradient(
                    #10B981 0deg ${74.8 * 3.6}deg,
                    #3B82F6 ${74.8 * 3.6}deg ${(74.8 + 20.3) * 3.6}deg,
                    #F59E0B ${(74.8 + 20.3) * 3.6}deg ${(74.8 + 20.3 + 3.0) * 3.6}deg,
                    #EF4444 ${(74.8 + 20.3 + 3.0) * 3.6}deg 360deg
                  )`
                }} />
                <div className="absolute inset-2 bg-white rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Alerts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Alerts Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Rule Triggered</th>
                    <th className="text-left py-2">No. Of Assets</th>
                    <th className="text-left py-2">Action Required By</th>
                    <th className="text-left py-2">% Of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceData.map((rule, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">{rule.rule}</td>
                      <td className="py-3">{formatNumber(rule.assets)}</td>
                      <td className="py-3">{rule.actionBy}</td>
                      <td className="py-3">{rule.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Calendar Widget
              <span className="text-sm font-normal text-slate-500">July 2024</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Simplified Calendar */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
              <div className="font-semibold py-2">S</div>
              <div className="font-semibold py-2">M</div>
              <div className="font-semibold py-2">T</div>
              <div className="font-semibold py-2">W</div>
              <div className="font-semibold py-2">T</div>
              <div className="font-semibold py-2">F</div>
              <div className="font-semibold py-2">S</div>
              
              {[...Array(31)].map((_, i) => (
                <div key={i} className={`py-2 rounded cursor-pointer transition-colors ${
                  i + 1 === 10 ? 'bg-amber-500 text-white' :
                  i + 1 === 17 ? 'bg-blue-500 text-white' : 
                  'hover:bg-slate-100'
                }`}>
                  {i + 1}
                </div>
              ))}
            </div>
            
            {/* Calendar Events */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-amber-500 rounded" />
                <span>Upcoming Maintenance - 10 May 2025</span>
              </div>
              <div className="text-xs text-slate-500 ml-5">
                Department: Facilities | Category: HVAC Equipment
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span>Assets - 17 May 2025</span>
              </div>
              <div className="text-xs text-slate-500 ml-5">
                Department: IT | Category: Laptops, Servers
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;