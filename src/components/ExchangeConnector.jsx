// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Card, CardContent, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui';
// @ts-ignore;
import { Wifi, WifiOff, Settings, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

import { useForm } from 'react-hook-form';
export default function ExchangeConnector(props) {
  const {
    toast
  } = useToast();
  const [exchanges, setExchanges] = useState([{
    id: 'binance',
    name: '币安',
    status: 'disconnected',
    balance: 0,
    apiKey: '',
    secretKey: ''
  }, {
    id: 'okx',
    name: 'OKX',
    status: 'disconnected',
    balance: 0,
    apiKey: '',
    secretKey: ''
  }]);
  const [selectedExchange, setSelectedExchange] = useState('binance');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const form = useForm({
    defaultValues: {
      apiKey: '',
      secretKey: '',
      passphrase: ''
    }
  });
  const currentExchange = exchanges.find(e => e.id === selectedExchange);
  const connectExchange = async data => {
    try {
      setIsConnecting(true);

      // 模拟API连接验证
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 更新连接状态
      setExchanges(exchanges.map(ex => ex.id === selectedExchange ? {
        ...ex,
        status: 'connected',
        apiKey: data.apiKey,
        secretKey: data.secretKey
      } : ex));
      toast({
        title: '连接成功',
        description: `${currentExchange.name} 交易所连接成功`,
        variant: 'default'
      });
      setShowConfig(false);
      fetchBalance();
    } catch (error) {
      toast({
        title: '连接失败',
        description: error.message || 'API密钥验证失败，请检查配置',
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };
  const disconnectExchange = async () => {
    try {
      setExchanges(exchanges.map(ex => ex.id === selectedExchange ? {
        ...ex,
        status: 'disconnected',
        balance: 0
      } : ex));
      toast({
        title: '已断开连接',
        description: `${currentExchange.name} 交易所连接已断开`,
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: '断开连接失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const fetchBalance = async () => {
    try {
      // 模拟获取余额
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExchanges(exchanges.map(ex => ex.id === selectedExchange ? {
        ...ex,
        balance: Math.random() * 10000
      } : ex));
    } catch (error) {
      console.error('获取余额失败:', error);
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'connected':
        return 'text-[#00C853]';
      case 'connecting':
        return 'text-yellow-500';
      case 'error':
        return 'text-[#FF3D00]';
      default:
        return 'text-gray-400';
    }
  };
  const getStatusIcon = status => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4" />;
      case 'connecting':
        return <AlertCircle className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };
  return <Card className="bg-[#151A25] border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-['Space_Grotesk'] flex items-center">
            <Wifi className="w-5 h-5 mr-2" />
            交易所连接
          </CardTitle>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => setShowConfig(!showConfig)}>
            <Settings className="w-4 h-4 mr-2" />
            {showConfig ? '隐藏配置' : '配置连接'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 交易所选择 */}
        <div className="flex space-x-4 mb-4">
          {exchanges.map(exchange => <button key={exchange.id} className={`flex-1 p-3 rounded-lg border transition-all ${selectedExchange === exchange.id ? 'border-[#2962FF] bg-[#2962FF]/10' : 'border-gray-700 bg-[#0B0F19] hover:bg-gray-800'}`} onClick={() => setSelectedExchange(exchange.id)}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{exchange.name}</span>
                <div className={`flex items-center space-x-1 ${getStatusColor(exchange.status)}`}>
                  {getStatusIcon(exchange.status)}
                  <span className="text-xs">
                    {exchange.status === 'connected' ? '已连接' : exchange.status === 'connecting' ? '连接中' : exchange.status === 'error' ? '错误' : '未连接'}
                  </span>
                </div>
              </div>
              {exchange.status === 'connected' && <div className="mt-2 text-xs text-gray-400">
                  余额: ${exchange.balance.toFixed(2)}
                </div>}
            </button>)}
        </div>

        {/* 配置表单 */}
        {showConfig && <Form {...form}>
            <form onSubmit={form.handleSubmit(connectExchange)} className="space-y-4 p-4 bg-[#0B0F19] rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">{currentExchange.name} API配置</h4>
                <Button type="button" variant="outline" size="sm" className="text-xs border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => window.open(currentExchange.id === 'binance' ? 'https://www.binance.com/zh-CN/support/faq/how-to-create-api-keys-360002502072' : 'https://www.okx.com/help/how-to-create-an-api-key-on-okx', '_blank')}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  如何获取API密钥
                </Button>
              </div>

              <FormField control={form.control} name="apiKey" render={({
            field
          }) => <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="输入API密钥" className="bg-[#0B0F19] border-gray-700" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="secretKey" render={({
            field
          }) => <FormItem>
                    <FormLabel>Secret Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="输入密钥" className="bg-[#0B0F19] border-gray-700" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              {selectedExchange === 'okx' && <FormField control={form.control} name="passphrase" render={({
            field
          }) => <FormItem>
                      <FormLabel>Passphrase</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="输入密码短语" className="bg-[#0B0F19] border-gray-700" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />}

              <div className="flex space-x-3">
                <Button type="submit" className="flex-1 bg-[#2962FF] hover:bg-[#2962FF]/90" disabled={isConnecting}>
                  {isConnecting ? '连接中...' : '连接交易所'}
                </Button>
                
                {currentExchange.status === 'connected' && <Button type="button" variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800" onClick={disconnectExchange}>
                    断开连接
                  </Button>}
              </div>
            </form>
          </Form>}

        {/* 连接状态提示 */}
        {!showConfig && <div className={`p-3 rounded-lg border ${currentExchange.status === 'connected' ? 'bg-[#00C853]/10 border-[#00C853]/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
            <div className="flex items-center space-x-2">
              {currentExchange.status === 'connected' ? <CheckCircle className="w-4 h-4 text-[#00C853]" /> : <AlertCircle className="w-4 h-4 text-yellow-500" />}
              <span className="text-sm">
                {currentExchange.status === 'connected' ? `${currentExchange.name} 已连接，可进行实盘交易` : `${currentExchange.name} 未连接，请配置API密钥`}
              </span>
            </div>
          </div>}
      </CardContent>
    </Card>;
}