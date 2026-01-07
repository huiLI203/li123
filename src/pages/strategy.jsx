// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Play, Pause, Plus, Settings, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
// @ts-ignore;
import { useToast, Button, Card, CardContent, CardHeader, CardTitle, Switch, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui';

import { useForm } from 'react-hook-form';
export default function Strategy(props) {
  const {
    toast
  } = useToast();
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const form = useForm({
    defaultValues: {
      name: '',
      coin: 'BTC',
      type: 'rsi',
      buyCondition: '',
      sellCondition: '',
      amount: ''
    }
  });
  useEffect(() => {
    fetchStrategies();
  }, []);
  const fetchStrategies = async () => {
    try {
      // 模拟策略数据
      const mockStrategies = [{
        id: 1,
        name: 'RSI超卖策略',
        coin: 'BTC',
        type: 'rsi',
        buyCondition: 'RSI < 30',
        sellCondition: 'RSI > 70',
        amount: '0.1',
        enabled: true,
        status: 'running',
        profit: '+$1,234.50',
        trades: 12,
        winRate: '75%'
      }, {
        id: 2,
        name: 'MACD金叉策略',
        coin: 'ETH',
        type: 'macd',
        buyCondition: 'MACD > Signal',
        sellCondition: 'MACD < Signal',
        amount: '2.0',
        enabled: false,
        status: 'stopped',
        profit: '+$567.80',
        trades: 8,
        winRate: '62.5%'
      }, {
        id: 3,
        name: '均线突破策略',
        coin: 'SOL',
        type: 'ma',
        buyCondition: 'Price > MA20',
        sellCondition: 'Price < MA20',
        amount: '10',
        enabled: true,
        status: 'running',
        profit: '+$892.30',
        trades: 15,
        winRate: '66.7%'
      }];
      setStrategies(mockStrategies);
    } catch (error) {
      toast({
        title: '获取策略失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const toggleStrategy = async strategyId => {
    try {
      setStrategies(strategies.map(strategy => strategy.id === strategyId ? {
        ...strategy,
        enabled: !strategy.enabled,
        status: !strategy.enabled ? 'running' : 'stopped'
      } : strategy));
      const strategy = strategies.find(s => s.id === strategyId);
      toast({
        title: strategy.enabled ? '策略已停止' : '策略已启动',
        description: `${strategy.name} ${strategy.enabled ? '已停止运行' : '已开始运行'}`
      });
    } catch (error) {
      toast({
        title: '操作失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const onSubmit = async data => {
    try {
      setLoading(true);
      const newStrategy = {
        id: strategies.length + 1,
        ...data,
        enabled: true,
        status: 'running',
        profit: '+$0.00',
        trades: 0,
        winRate: '0%'
      };
      setStrategies([newStrategy, ...strategies]);
      toast({
        title: '策略创建成功',
        description: `${data.name} 已添加到策略列表`
      });
      form.reset();
      setShowCreateDialog(false);
    } catch (error) {
      toast({
        title: '创建策略失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const deleteStrategy = async strategyId => {
    try {
      setStrategies(strategies.filter(s => s.id !== strategyId));
      toast({
        title: '策略已删除',
        description: '策略已成功删除'
      });
    } catch (error) {
      toast({
        title: '删除失败',
        description: error.message,
        variant: 'destructive'
      });
    }
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
  const strategyTypes = [{
    value: 'rsi',
    label: 'RSI策略'
  }, {
    value: 'macd',
    label: 'MACD策略'
  }, {
    value: 'ma',
    label: '均线策略'
  }, {
    value: 'custom',
    label: '自定义策略'
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
                <h1 className="text-xl font-bold font-['Space_Grotesk']">自动化策略</h1>
                <p className="text-xs text-gray-400">配置和管理交易策略</p>
              </div>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#2962FF] hover:bg-[#2962FF]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  新建策略
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#151A25] border-gray-800 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-['Space_Grotesk']">创建新策略</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    配置自动化交易策略的参数和条件
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>策略名称</FormLabel>
                          <FormControl>
                            <Input placeholder="输入策略名称" className="bg-[#0B0F19] border-gray-700" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="coin" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>交易对</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="bg-[#0B0F19] border-gray-700">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-[#151A25] border-gray-700">
                                {coins.map(coin => <SelectItem key={coin.value} value={coin.value}>{coin.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>} />
                      <FormField control={form.control} name="type" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>策略类型</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="bg-[#0B0F19] border-gray-700">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-[#151A25] border-gray-700">
                                {strategyTypes.map(type => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>} />
                    </div>
                    <FormField control={form.control} name="buyCondition" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>买入条件</FormLabel>
                          <FormControl>
                            <Input placeholder="例如: RSI < 30" className="bg-[#0B0F19] border-gray-700" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="sellCondition" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>卖出条件</FormLabel>
                          <FormControl>
                            <Input placeholder="例如: RSI > 70" className="bg-[#0B0F19] border-gray-700" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="amount" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>交易数量</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="输入数量" className="bg-[#0B0F19] border-gray-700" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button type="button" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => setShowCreateDialog(false)}>
                        取消
                      </Button>
                      <Button type="submit" className="bg-[#2962FF] hover:bg-[#2962FF]/90" disabled={loading}>
                        {loading ? '创建中...' : '创建策略'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#151A25] border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">运行策略</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-['JetBrains_Mono']">
                {strategies.filter(s => s.enabled).length}
              </div>
              <div className="text-sm text-gray-400 mt-1">共 {strategies.length} 个</div>
            </CardContent>
          </Card>
          <Card className="bg-[#151A25] border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">总收益</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-['JetBrains_Mono'] text-[#00C853]">
                +$2,694.60
              </div>
              <div className="text-sm text-gray-400 mt-1">累计收益</div>
            </CardContent>
          </Card>
          <Card className="bg-[#151A25] border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">总交易次数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-['JetBrains_Mono']">35</div>
              <div className="text-sm text-gray-400 mt-1">本月</div>
            </CardContent>
          </Card>
          <Card className="bg-[#151A25] border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">平均胜率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-['JetBrains_Mono']">68.1%</div>
              <div className="text-sm text-gray-400 mt-1">所有策略</div>
            </CardContent>
          </Card>
        </div>

        {/* Strategy List */}
        <div className="space-y-4">
          {strategies.map(strategy => <Card key={strategy.id} className="bg-[#151A25] border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${strategy.enabled ? 'bg-[#00C853]/20' : 'bg-gray-700'}`}>
                      {strategy.enabled ? <Play className="w-6 h-6 text-[#00C853]" /> : <Pause className="w-6 h-6 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold font-['Space_Grotesk']">{strategy.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${strategy.enabled ? 'bg-[#00C853]/20 text-[#00C853]' : 'bg-gray-700 text-gray-400'}`}>
                          {strategy.enabled ? '运行中' : '已停止'}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#2962FF]/20 text-[#2962FF]">
                          {strategy.coin}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400 mb-1">买入条件</div>
                          <div className="font-mono">{strategy.buyCondition}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">卖出条件</div>
                          <div className="font-mono">{strategy.sellCondition}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">交易数量</div>
                          <div className="font-mono">{strategy.amount}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">交易次数</div>
                          <div className="font-mono">{strategy.trades} 次</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">累计收益</div>
                      <div className="text-xl font-bold font-['JetBrains_Mono'] text-[#00C853]">
                        {strategy.profit}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">胜率: {strategy.winRate}</div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Switch checked={strategy.enabled} onCheckedChange={() => toggleStrategy(strategy.id)} />
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500" onClick={() => deleteStrategy(strategy.id)}>
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {strategies.length === 0 && <Card className="bg-[#151A25] border-gray-800">
            <CardContent className="py-16 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-medium mb-2">暂无策略</h3>
              <p className="text-gray-400 mb-6">创建您的第一个自动化交易策略</p>
              <Button className="bg-[#2962FF] hover:bg-[#2962FF]/90" onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                创建策略
              </Button>
            </CardContent>
          </Card>}
      </main>
    </div>;
}