// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast } from '@/components/ui';

import { AnalysisModel } from '@/components/AnalysisModel';
export function MarketMonitor({
  interval = 10000,
  symbols = ['BTC', 'ETH', 'BNB', 'SOL']
}) {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();
  const fetchMarketData = async () => {
    try {
      setLoading(true);
      // 模拟API调用
      const data = symbols.reduce((acc, symbol) => ({
        ...acc,
        [symbol]: {
          price: Math.random() * 10000,
          change: (Math.random() - 0.5) * 10,
          volume: Math.random() * 1000
        }
      }), {});
      setMarketData(data);
    } catch (error) {
      toast({
        title: '数据获取失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMarketData();
    const timer = setInterval(fetchMarketData, interval);
    return () => clearInterval(timer);
  }, [symbols]);
  return <div className="space-y-4">
      {symbols.map(symbol => <AnalysisModel key={symbol} symbol={symbol} data={marketData[symbol]} loading={loading} />)}
    </div>;
}