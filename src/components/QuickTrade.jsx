// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

export default function QuickTrade({
  onTrade
}) {
  const [tradeType, setTradeType] = useState('buy');
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [amount, setAmount] = useState('');
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
  }];
  const selectedCoinData = coins.find(c => c.value === selectedCoin);
  const estimatedTotal = parseFloat(amount || 0) * (selectedCoinData?.price || 0);
  const handleSubmit = () => {
    if (!amount) return;
    onTrade(tradeType, selectedCoin);
    setAmount('');
  };
  return <div className="space-y-4">
      <div className="flex mb-4 bg-[#0B0F19] rounded-lg p-1">
        <button className={`flex-1 py-2 rounded-md font-medium transition-all ${tradeType === 'buy' ? 'bg-[#00C853] text-white' : 'text-gray-400 hover:text-white'}`} onClick={() => setTradeType('buy')}>
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>买入</span>
          </div>
        </button>
        <button className={`flex-1 py-2 rounded-md font-medium transition-all ${tradeType === 'sell' ? 'bg-[#FF3D00] text-white' : 'text-gray-400 hover:text-white'}`} onClick={() => setTradeType('sell')}>
          <div className="flex items-center justify-center space-x-2">
            <TrendingDown className="w-4 h-4" />
            <span>卖出</span>
          </div>
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">交易对</label>
          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger className="bg-[#0B0F19] border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#151A25] border-gray-700">
              {coins.map(coin => <SelectItem key={coin.value} value={coin.value}>{coin.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-2 block">数量</label>
          <Input type="number" placeholder="输入数量" value={amount} onChange={e => setAmount(e.target.value)} className="bg-[#0B0F19] border-gray-700" />
        </div>

        {amount && <div className="p-3 bg-[#0B0F19] rounded-lg border border-gray-800">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">预估总价</span>
              <span className="font-mono font-bold">
                ${estimatedTotal.toFixed(2)}
              </span>
            </div>
          </div>}

        <Button className={`w-full py-6 font-bold ${tradeType === 'buy' ? 'bg-[#00C853] hover:bg-[#00C853]/90' : 'bg-[#FF3D00] hover:bg-[#FF3D00]/90'}`} onClick={handleSubmit} disabled={!amount}>
          {tradeType === 'buy' ? '买入' : '卖出'} {selectedCoin}
        </Button>
      </div>
    </div>;
}