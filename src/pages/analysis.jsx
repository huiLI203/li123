// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, BarChart3, LineChart, Activity } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import AnalysisModel from '@/components/AnalysisModel.jsx';
export default function Analysis(props) {
  const {
    toast
  } = useToast();
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [timeframe, setTimeframe] = useState('1H');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [indicators, setIndicators] = useState({
    rsi: 65.4,
    macd: 125.3,
    signal: 98.7,
    ma20: 42800,
    ma50: 41500
  });
  const [currentPrice, setCurrentPrice] = useState(43000);
  useEffect(() => {
    fetchChartData();
  }, [selectedCoin, timeframe]);
  const fetchChartData = async () => {
    try {
      setLoading(true);
      // 模拟图表数据
      const mockData = Array.from({
        length: 24
      }, (_, i) => ({
        time: `${i}:00`,
        price: 43000 + Math.random() * 1000 - 500,
        volume: Math.random() * 1000000
      }));
      setChartData(mockData);
      setCurrentPrice(mockData[mockData.length - 1].price);

      // 更新技术指标
      setIndicators({
        rsi: 30 + Math.random() * 40,
        // 30-70之间
        macd: 100 + Math.random() * 50,
        signal: 90 + Math.random() * 40,
        ma20: 42500 + Math.random() * 1000,
        ma50: 41000 + Math.random() * 1000
      });
    } catch (error) {
      toast({
        title: '获取图表数据失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleTradeDecision = recommendation => {
    const tradeType = recommendation.includes('buy') ? '买入' : recommendation.includes('sell') ? '卖出' : '持有';
    toast({
      title: '交易建议',
      description: `模型建议: ${tradeType} ${selectedCoin}`,
      variant: recommendation.includes('strong') ? 'default' : 'secondary'
    });

    // 跳转到交易页面
    props.$w.utils.navigateTo({
      pageId: 'trade',
      params: {
        coin: selectedCoin,
        action: recommendation.includes('buy') ? 'buy' : 'sell'
      }
    });
  };
  const coins = [{
    value: 'BTC',
    label: 'Bitcoin (BTC)'
  }, {
    value: 'ETH',
    label: 'Ethereum (ETH)'
  }, {
    value: 'BNB',
    label: 'BNB (BNB)'
  }, {
    value: 'SOL',
    label: 'Solana (SOL)'
  }, {
    value: 'XRP',
    label: 'Ripple (XRP)'
  }];
  const timeframes = [{
    value: '15M',
    label: '15分钟'
  }, {
    value: '1H',
    label: '1小时'
  }, {
    value: '4H',
    label: '4小时'
  }, {
    value: '1D',
    label: '1天'
  }, {
    value: '1W',
    label: '1周'
  }];
  return <div className="min-h-screen bg-[#0B0F19] text-white font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#151A25]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={() => props.$w.utils.navigateBack()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold font-['Space_Grotesk']">智能分析系统</h1>
                <p className="text-xs text-gray-400">技术指标 + AI模型决策</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger className="w-[200px] bg-[#0B0F19] border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#151A25] border-gray-700">
                  {coins.map(coin => <SelectItem key={coin.value} value={coin.value}>{coin.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={fetchChartData} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          
          {/* 左侧：图表和技术指标 */}
          <div className="col-span-8">
            
            {/* 价格走势图表 */}
            <Card className="bg-[#151A25] border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-['Space_Grotesk']">价格走势分析</CardTitle>
                  <div className="flex items-center space-x-2">
                    {timeframes.map(tf => <Button key={tf.value} variant={timeframe === tf.value ? 'default' : 'outline'} size="sm" className={timeframe === tf.value ? 'bg-[#2962FF] hover:bg-[#2962FF]/90' : 'border-gray-700 text-gray-300 hover:bg-gray-800'} onClick={() => setTimeframe(tf.value)}>
                        {tf.label}
                      </Button>)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {loading ? <div className="flex items-center justify-center h-full text-gray-400">
                      <RefreshCw className="w-8 h-8 animate-spin mr-3" />
                      加载中...
                    </div> : <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2962FF" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#2962FF" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{
                      backgroundColor: '#151A25',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} itemStyle={{
                      color: '#fff'
                    }} />
                        <Area type="monotone" dataKey="price" stroke="#2962FF" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                      </AreaChart>
                    </ResponsiveContainer>}
                </div>
              </CardContent>
            </Card>

            {/* 成交量图表 */}
            <Card className="bg-[#151A25] border-gray-800 mt-6">
              <CardHeader>
                <CardTitle className="font-['Space_Grotesk']">成交量分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip contentStyle={{
                      backgroundColor: '#151A25',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} itemStyle={{
                      color: '#fff'
                    }} />
                      <Bar dataKey="volume" fill="#00C853" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 技术指标面板 */}
            <Card className="bg-[#151A25] border-gray-800 mt-6">
              <CardHeader>
                <CardTitle className="font-['Space_Grotesk'] flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  技术指标分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  
                  {/* RSI */}
                  <div className="p-4 bg-[#0B0F19] rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">RSI (14)</span>
                      <span className={`font-mono font-bold ${indicators.rsi > 70 ? 'text-[#FF3D00]' : indicators.rsi < 30 ? 'text-[#00C853]' : 'text-white'}`}>
                        {indicators.rsi.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${indicators.rsi > 70 ? 'bg-[#FF3D00]' : indicators.rsi < 30 ? 'bg-[#00C853]' : 'bg-[#2962FF]'}`} style={{
                      width: `${indicators.rsi}%`
                    }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>超卖</span>
                      <span>中性</span>
                      <span>超买</span>
                    </div>
                  </div>

                  {/* MACD */}
                  <div className="p-4 bg-[#0B0F19] rounded-lg border border-gray-800">
                    <div className="text-sm text-gray-400 mb-3">MACD</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">MACD</span>
                        <span className="font-mono text-sm text-[#2962FF]">{indicators.macd.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Signal</span>
                        <span className="font-mono text-sm text-[#FF9800]">{indicators.signal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Histogram</span>
                        <span className={`font-mono text-sm ${indicators.macd > indicators.signal ? 'text-[#00C853]' : 'text-[#FF3D00]'}`}>
                          {(indicators.macd - indicators.signal).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 移动平均线 */}
                  <div className="p-4 bg-[#0B0F19] rounded-lg border border-gray-800">
                    <div className="text-sm text-gray-400 mb-3">移动平均线</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">MA 20</span>
                        <span className="font-mono text-sm">${indicators.ma20.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">MA 50</span>
                        <span className="font-mono text-sm">${indicators.ma50.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">当前价格</span>
                        <span className="font-mono text-sm">${currentPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

          </div>

          {/* 右侧：智能分析模型 */}
          <div className="col-span-4">
            
            {/* 智能分析模型组件 */}
            <AnalysisModel coin={selectedCoin} timeframe={timeframe} currentPrice={currentPrice} indicators={indicators} onTradeDecision={handleTradeDecision} />

            {/* 趋势判断 */}
            <Card className="bg-[#151A25] border-gray-800 mt-6">
              <CardHeader>
                <CardTitle className="font-['Space_Grotesk'] flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  趋势分析
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* 短期趋势 */}
                <div className="p-3 bg-[#0B0F19] rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">短期趋势 (1H)</span>
                    <div className="flex items-center space-x-1">
                      {indicators.rsi > 50 ? <TrendingUp className="w-4 h-4 text-[#00C853]" /> : <TrendingDown className="w-4 h-4 text-[#FF3D00]" />}
                      <span className={`text-sm font-medium ${indicators.rsi > 50 ? 'text-[#00C853]' : 'text-[#FF3D00]'}`}>
                        {indicators.rsi > 50 ? '上涨' : '下跌'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 中期趋势 */}
                <div className="p-3 bg-[#0B0F19] rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">中期趋势 (4H)</span>
                    <div className="flex items-center space-x-1">
                      {currentPrice > indicators.ma20 ? <TrendingUp className="w-4 h-4 text-[#00C853]" /> : <TrendingDown className="w-4 h-4 text-[#FF3D00]" />}
                      <span className={`text-sm font-medium ${currentPrice > indicators.ma20 ? 'text-[#00C853]' : 'text-[#FF3D00]'}`}>
                        {currentPrice > indicators.ma20 ? '上涨' : '下跌'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 长期趋势 */}
                <div className="p-3 bg-[#0B0F19] rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">长期趋势 (1D)</span>
                    <div className="flex items-center space-x-1">
                      {currentPrice > indicators.ma50 ? <TrendingUp className="w-4 h-4 text-[#00C853]" /> : <TrendingDown className="w-4 h-4 text-[#FF3D00]" />}
                      <span className={`text-sm font-medium ${currentPrice > indicators.ma50 ? 'text-[#00C853]' : 'text-[#FF3D00]'}`}>
                        {currentPrice > indicators.ma50 ? '上涨' : '下跌'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 趋势强度 */}
                <div className="p-3 bg-[#0B0F19] rounded-lg border border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">趋势强度</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div className="bg-[#2962FF] h-2 rounded-full" style={{
                      width: `${Math.abs(indicators.rsi - 50) * 2}%`
                    }} />
                    </div>
                    <span className="text-xs text-gray-400">
                      {Math.abs(indicators.rsi - 50) > 15 ? '强' : Math.abs(indicators.rsi - 50) > 8 ? '中' : '弱'}
                    </span>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>;
}