// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Plus, Minus, History, Clock, CheckCircle, XCircle, Zap, Globe } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui';

import { useForm } from 'react-hook-form';
import ExchangeConnector from '@/components/ExchangeConnector';
export default function Trade(props) {
  const {
    toast
  } = useToast();
  const [tradeType, setTradeType] = useState('buy');
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('open');
  const [loading, setLoading] = useState(false);
  const [exchangeMode, setExchangeMode] = useState('demo'); // demo, binance, okx
  const [exchangeStatus, setExchangeStatus] = useState('disconnected');
  const form = useForm({
    defaultValues: {
      amount: '',
      price: '',
      orderType: 'market'
    }
  });
  useEffect(() => {
    fetchOrders();
    const params = props.$w.page.dataset.params;
    if (params.type) {
      setTradeType(params.type);
    }
    if (params.symbol) {
      setSelectedCoin(params.symbol);
    }
  }, []);
  const fetchOrders = async () => {
    try {
      // 模拟订单数据
      const mockOrders = [{
        id: 1,
        symbol: 'BTC',
        type: 'buy',
        amount: '0.5',
        price: '43,250.50',
        status: 'open',
        time: '2026-01-08 10:30:00',
        exchange: 'demo'
      }, {
        id: 2,
        symbol: 'ETH',
        type: 'sell',
        amount: '2.0',
        price: '2,280.75',
        status: 'pending',
        time: '2026-01-08 10:25:00',
        exchange: 'demo'
      }, {
        id: 3,
        symbol: 'SOL',
        type: 'buy',
        amount: '10',
        price: '98.65',
        status: 'completed',
        time: '2026-01-08 10:20:00',
        exchange: 'binance'
      }, {
        id: 4,
        symbol: 'BTC',
        type: 'sell',
        amount: '0.3',
        price: '43,500.00',
        status: 'cancelled',
        time: '2026-01-08 10:15:00',
        exchange: 'okx'
      }];
      setOrders(mockOrders);
    } catch (error) {
      toast({
        title: '获取订单失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const executeRealTrade = async data => {
    try {
      setLoading(true);
      if (exchangeMode === 'demo') {
        // 模拟交易
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // 实盘交易
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 这里应该调用实际的交易所API
        // const result = await callExchangeAPI({
        //   exchange: exchangeMode,
        //   symbol: selectedCoin,
        //   side: tradeType,
        //   type: data.orderType,
        //   quantity: data.amount,
        //   price: data.price
        // });
      }
      const newOrder = {
        id: orders.length + 1,
        symbol: selectedCoin,
        type: tradeType,
        amount: data.amount,
        price: data.orderType === 'market' ? '市价' : data.price,
        status: 'open',
        time: new Date().toLocaleString('zh-CN'),
        exchange: exchangeMode
      };
      setOrders([newOrder, ...orders]);
      toast({
        title: exchangeMode === 'demo' ? '模拟下单成功' : '实盘下单成功',
        description: `${tradeType === 'buy' ? '买入' : '卖出'} ${data.amount} ${selectedCoin} 订单已提交`,
        variant: 'default'
      });
      form.reset();
    } catch (error) {
      toast({
        title: '下单失败',
        description: error.message || '交易执行失败，请检查网络连接',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async data => {
    if (exchangeMode !== 'demo' && exchangeStatus !== 'connected') {
      toast({
        title: '交易所未连接',
        description: '请先连接交易所再进行实盘交易',
        variant: 'destructive'
      });
      return;
    }
    await executeRealTrade(data);
  };
  const cancelOrder = async orderId => {
    try {
      setOrders(orders.map(order => order.id === orderId ? {
        ...order,
        status: 'cancelled'
      } : order));
      toast({
        title: '订单已取消',
        description: '订单已成功取消'
      });
    } catch (error) {
      toast({
        title: '取消订单失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'open') return order.status === 'open' || order.status === 'pending';
    if (activeTab === 'history') return order.status === 'completed' || order.status === 'cancelled';
    return true;
  });
  const coins = [{
    value: 'BTC',
    label: 'Bitcoin (BTC)',
    price: 43250.50
  }, {
    value: 'ETH',
    label: 'Ethereum (ETH)',
    price: 2280.75
  }, {
    value: 'BNB',
    label: 'BNB (BNB)',
    price: 312.40
  }, {
    value: 'SOL',
    label: 'Solana (SOL)',
    price: 98.65
  }, {
    value: 'XRP',
    label: 'Ripple (XRP)',
    price: 0.62
  }];
  const selectedCoinData = coins.find(c => c.value === selectedCoin);
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
                <h1 className="text-xl font-bold font-['Space_Grotesk']">交易中心</h1>
                <p className="text-xs text-gray-400">快速下单与订单管理</p>
              </div>
            </div>
            
            {/* 交易模式切换 */}
            <div className="flex items-center space-x-3">
              <div className="flex bg-[#0B0F19] rounded-lg p-1">
                <button className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${exchangeMode === 'demo' ? 'bg-[#2962FF] text-white' : 'text-gray-400 hover:text-white'}`} onClick={() => setExchangeMode('demo')}>
                  <Zap className="w-3 h-3 inline mr-1" />
                  模拟交易
                </button>
                <button className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${exchangeMode === 'binance' ? 'bg-[#F0B90B] text-black' : exchangeMode === 'okx' ? 'bg-[#1C56FF] text-white' : 'text-gray-400 hover:text-white'}`} onClick={() => setExchangeMode('binance')}>
                  <Globe className="w-3 h-3 inline mr-1" />
                  实盘交易
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* 交易所连接 */}
          <div className="col-span-12">
            <ExchangeConnector onStatusChange={setExchangeStatus} onExchangeChange={setExchangeMode} />
          </div>
          
          {/* Order Form */}
          <div className="col-span-5">
            <Card className="bg-[#151A25] border-gray-800">
              <CardHeader>
                <CardTitle className="font-['Space_Grotesk']">
                  {exchangeMode === 'demo' ? '模拟交易' : `${exchangeMode === 'binance' ? '币安' : 'OKX'} 实盘交易`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* 交易模式提示 */}
                <div className={`mb-4 p-3 rounded-lg border ${exchangeMode === 'demo' ? 'bg-yellow-500/10 border-yellow-500/30' : exchangeMode === 'binance' ? 'bg-[#F0B90B]/10 border-[#F0B90B]/30' : 'bg-[#1C56FF]/10 border-[#1C56FF]/30'}`}>
                  <div className="flex items-center space-x-2">
                    {exchangeMode === 'demo' ? <Zap className="w-4 h-4 text-yellow-500" /> : <Globe className="w-4 h-4" />}
                    <span className="text-sm">
                      {exchangeMode === 'demo' ? '当前为模拟交易模式，不会产生真实资金变动' : `当前连接到 ${exchangeMode === 'binance' ? '币安' : 'OKX'} 交易所，将进行实盘交易`}
                    </span>
                  </div>
                </div>

                {/* Trade Type Toggle */}
                <div className="flex mb-6 bg-[#0B0F19] rounded-lg p-1">
                  <button className={`flex-1 py-3 rounded-md font-medium transition-all ${tradeType === 'buy' ? 'bg-[#00C853] text-white' : 'text-gray-400 hover:text-white'}`} onClick={() => setTradeType('buy')}>
                    <div className="flex items-center justify-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>买入</span>
                    </div>
                  </button>
                  <button className={`flex-1 py-3 rounded-md font-medium transition-all ${tradeType === 'sell' ? 'bg-[#FF3D00] text-white' : 'text-gray-400 hover:text-white'}`} onClick={() => setTradeType('sell')}>
                    <div className="flex items-center justify-center space-x-2">
                      <Minus className="w-4 h-4" />
                      <span>卖出</span>
                    </div>
                  </button>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Coin Selection */}
                    <FormField control={form.control} name="coin" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>交易对</FormLabel>
                          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                            <FormControl>
                              <SelectTrigger className="bg-[#0B0F19] border-gray-700">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#151A25] border-gray-700">
                              {coins.map(coin => <SelectItem key={coin.value} value={coin.value}>
                                  {coin.label}
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>} />

                    {/* Order Type */}
                    <FormField control={form.control} name="orderType" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>订单类型</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="bg-[#0B0F19] border-gray-700">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#151A25] border-gray-700">
                              <SelectItem value="market">市价单</SelectItem>
                              <SelectItem value="limit">限价单</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>} />

                    {/* Price (for limit orders) */}
                    {form.watch('orderType') === 'limit' && <FormField control={form.control} name="price" render={({
                    field
                  }) => <FormItem>
                            <FormLabel>价格 (USD)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="输入价格" className="bg-[#0B0F19] border-gray-700" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />}

                    {/* Amount */}
                    <FormField control={form.control} name="amount" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>数量</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="输入数量" className="bg-[#0B0F19] border-gray-700" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    {/* Total */}
                    {form.watch('amount') && selectedCoinData && <div className="p-4 bg-[#0B0F19] rounded-lg border border-gray-800">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">预估总价</span>
                          <span className="font-mono font-bold">
                            ${(parseFloat(form.watch('amount') || 0) * selectedCoinData.price).toFixed(2)}
                          </span>
                        </div>
                      </div>}

                    {/* Submit Button */}
                    <Button type="submit" className={`w-full py-6 font-bold ${exchangeMode === 'demo' ? tradeType === 'buy' ? 'bg-[#00C853] hover:bg-[#00C853]/90' : 'bg-[#FF3D00] hover:bg-[#FF3D00]/90' : exchangeMode === 'binance' ? 'bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black' : 'bg-[#1C56FF] hover:bg-[#1C56FF]/90'}`} disabled={loading || exchangeMode !== 'demo' && exchangeStatus !== 'connected'}>
                      {loading ? '提交中...' : exchangeMode === 'demo' ? `${tradeType === 'buy' ? '买入' : '卖出'} ${selectedCoin}` : `${tradeType === 'buy' ? '买入' : '卖出'} ${selectedCoin} (实盘)`}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <div className="col-span-7">
            <Card className="bg-[#151A25] border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-['Space_Grotesk'] flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    订单管理
                  </CardTitle>
                  <div className="text-xs text-gray-400">
                    总计: {orders.length} 个订单
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-[#0B0F19]">
                    <TabsTrigger value="open" className="data-[state=active]:bg-[#2962FF]">
                      挂单中
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-[#2962FF]">
                      历史记录
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value={activeTab} className="mt-4">
                    <div className="space-y-3">
                      {filteredOrders.length === 0 ? <div className="text-center py-12 text-gray-400">
                          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>暂无订单</p>
                        </div> : filteredOrders.map(order => <div key={order.id} className="p-4 bg-[#0B0F19] rounded-lg border border-gray-800">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${order.type === 'buy' ? 'bg-[#00C853]/20' : 'bg-[#FF3D00]/20'}`}>
                                  {order.type === 'buy' ? <Plus className={`w-5 h-5 text-[#00C853]`} /> : <Minus className="w-5 h-5 text-[#FF3D00]" />}
                                </div>
                                <div>
                                  <div className="font-medium font-['JetBrains_Mono']">{order.symbol}</div>
                                  <div className="text-sm text-gray-400">{order.time}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {order.exchange === 'demo' ? '模拟交易' : order.exchange === 'binance' ? '币安实盘' : 'OKX实盘'}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-medium font-['JetBrains_Mono'] ${order.type === 'buy' ? 'text-[#00C853]' : 'text-[#FF3D00]'}`}>
                                  {order.type === 'buy' ? '+' : '-'}{order.amount}
                                </div>
                                <div className="text-sm text-gray-400">@ {order.price}</div>
                              </div>
                              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-[#00C853]/20 text-[#00C853]' : order.status === 'cancelled' ? 'bg-gray-700 text-gray-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                {order.status === 'open' && <Clock className="w-3 h-3" />}
                                <span>
                                  {order.status === 'completed' ? '已完成' : order.status === 'cancelled' ? '已取消' : order.status === 'pending' ? '待执行' : '挂单中'}
                                </span>
                              </div>
                              {(order.status === 'open' || order.status === 'pending') && <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => cancelOrder(order.id)}>
                                  取消
                                </Button>}
                            </div>
                          </div>)}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>;
}