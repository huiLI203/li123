// @ts-ignore;
import React from 'react';

import { MarketMonitor } from '@/components/MarketMonitor';
import { ExchangeConnector } from '@/components/ExchangeConnector';
export default function Analysis(props) {
  return <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-8">
        {/* 原有图表区域 */}
      </div>
      <div className="col-span-4 space-y-4">
        <ExchangeConnector />
        <MarketMonitor />
      </div>
    </div>;
}