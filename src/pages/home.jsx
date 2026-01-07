// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { TrendingUp, TrendingDown, ArrowUpRight, Activity, DollarSign, BarChart3 } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

import MarketOverview from '@/components/MarketOverview';
import QuickTrade from '@/components/QuickTrade';
export default function Home(props) {
  const {
    toast
  } = useToast();
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, []);
  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const mockData = [{
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 43250.50,
        change: 2.34,
        volume: '28.5B'
      }, {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 2280.75,
        change: -1.23,
        volume: '15.2B'
      }, {
        symbol: 'BNB',
        name: 'BNB',
        price: 312.40,
        change: 0.87,
        volume: '1.8B'
      }, {
        symbol: 'SOL',
        name: 'Solana',
        price: 98.65,
        change: 5.42,
        volume: '2.1B'
      }, {
        symbol: 'XRP',
        name: 'Ripple',
        price: 0.62,
        change: -0.45,
        volume: '1.5B'
      }, {
        symbol: 'ADA',
        name: 'Cardano',
        price: 0.58,
        change: 1.12,
        volume: '890M'
      }];
      setMarketData(mockData);
    } catch (error) {
      toast({
        title: '获取市场数据失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleQuickTrade = (type, symbol) => {
    props.$w.utils.navigateTo({
      pageId: 'trade',
      params: {
        type,
        symbol
      }
    });
  };
  return <div className="min-h-screen bg-[#0B0F19] text-white font-sans">
      <header className="border-b border-gray-800 bg-[#151A25]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2962FF] to-[#00C853] rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-['Space_Grotesk']">CryptoTrade Pro</h1>
                <p className="text-xs text-gray-400">智能交易终端</p>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <button onClick={() => props.$w.utils.navigateTo({
              pageId: 'home',
              params: {}
            })} className="text-[#2962FF] font-medium">
                首页
              </button>
              <button onClick={() => props.$w.utils.navigateTo({
              pageId: 'analysis',
              params: {}
            })} className="text-gray-400 hover:text-white transition-colors">
                分析
              </button>
              <button onClick={() => props.$w.utils.navigateTo({
              pageId: 'trade',
              params: {}
            })} className="text-gray-400 hover:text-white transition-colors">
                交易
              </button>
              <button onClick={() => props.$w.utils.navigateTo({
              pageId: 'strategy',
              params: {}
            })} className="text-gray-400 hover:text-white transition-colors">
                策略
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#151A25] border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                总资产
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-['JetBrains_Mono']">$125,430.50</div>
              <div className="text-sm text-[#00C853] mt-1">+12.34%</div>
            </CardContent>
          </Card>
          <Card className="bg-[#151A25] border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                今日收益
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-['JetBrains_Mono'] text-[#00C853]">+$3,245.80</div>
              <div className="text-sm text-gray-400 mt-1">24小时</div>
            </CardContent>
          </Card>
          <Card className="bg-[#151A25] border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                活跃订单
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-['JetBrains_Mono']">12</div>
              <div className="text-sm text-gray-400 mt-1">执行中</div>
            </CardContent>
          </Card>
          <Card className="bg-[#151A25] border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                策略运行
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-['JetBrains_Mono']">3</div>
              <div className="text-sm text-[#00C853] mt-1">正常运行</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <Card className="bg-[#151A25] border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-['Space_Grotesk']">市场概览</CardTitle>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => props.$w.utils.navigateTo({
                  pageId: 'analysis',
                  params: {}
                })}>
                    查看详情
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <MarketOverview data={marketData} loading={loading} onTrade={handleQuickTrade} />
              </CardContent>
            </Card>
          </div>

          <div className="col-span-4">
            <Card className="bg-[#151A25] border-gray-800">
              <CardHeader>
                <CardTitle className="font-['Space_Grotesk']">快速交易</CardTitle>
              </CardHeader>
              <CardContent>
                <QuickTrade onTrade={handleQuickTrade} />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="col-span-12 mt-6">
          <Card className="bg-[#151A25] border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-['Space_Grotesk']">最近订单</CardTitle>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => props.$w.utils.navigateTo({
                pageId: 'trade',
                params: {}
              })}>
                  查看全部
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[{
                symbol: 'BTC',
                type: 'buy',
                amount: '0.5',
                price: '43,250.50',
                status: 'completed',
                time: '10:30'
              }, {
                symbol: 'ETH',
                type: 'sell',
                amount: '2.0',
                price: '2,280.75',
                status: 'pending',
                time: '10:25'
              }, {
                symbol: 'SOL',
                type: 'buy',
                amount: '10',
                price: '98.65',
                status: 'completed',
                time: '10:20'
              }].map((order, index) => <div key={index} className="flex items-center justify-between p-4 bg-[#0B0F19] rounded-lg border border-gray-800">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${order.type === 'buy' ? 'bg-[#00C853]/20' : 'bg-[#FF3D00]/20'}`}>
                        {order.type === 'buy' ? <TrendingUp className="w-5 h-5 text-[#00C853]" /> : <TrendingDown className="w-5 h-5 text-[#FF3D00]" />}
                      </div>
                      <div>
                        <div className="font-medium font-['JetBrains_Mono']">{order.symbol}</div>
                        <div className="text-sm text-gray-400">{order.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium font-['JetBrains_Mono'] ${order.type === 'buy' ? 'text-[#00C853]' : 'text-[#FF3D00]'}`}>
                        {order.type === 'buy' ? '+' : '-'}${order.amount}
                      </div>
                      <div className="text-sm text-gray-400">@ ${order.price}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-[#00C853]/20 text-[#00C853]' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {order.status === 'completed' ? '已完成' : '待执行'}
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>;
}