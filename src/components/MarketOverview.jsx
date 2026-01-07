// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

export default function MarketOverview({
  data,
  loading,
  onTrade
}) {
  if (loading) {
    return <div className="flex items-center justify-center py-12 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2962FF] mr-3" />
        加载中...
      </div>;
  }
  return <div className="space-y-3">
      {data.map((coin, index) => <div key={index} className="flex items-center justify-between p-4 bg-[#0B0F19] rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2962FF] to-[#00C853] flex items-center justify-center font-bold text-sm">
              {coin.symbol.substring(0, 2)}
            </div>
            <div>
              <div className="font-medium font-['JetBrains_Mono']">{coin.symbol}</div>
              <div className="text-sm text-gray-400">{coin.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium font-['JetBrains_Mono']">${coin.price.toLocaleString()}</div>
            <div className={`flex items-center justify-end text-sm ${coin.change >= 0 ? 'text-[#00C853]' : 'text-[#FF3D00]'}`}>
              {coin.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(coin.change)}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">成交量</div>
            <div className="font-mono text-sm">{coin.volume}</div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" className="bg-[#00C853] hover:bg-[#00C853]/90" onClick={() => onTrade('buy', coin.symbol)}>
              买入
            </Button>
            <Button size="sm" variant="outline" className="border-[#FF3D00] text-[#FF3D00] hover:bg-[#FF3D00]/10" onClick={() => onTrade('sell', coin.symbol)}>
              卖出
            </Button>
          </div>
        </div>)}
    </div>;
}