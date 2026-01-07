// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { TrendingUp, TrendingDown, Activity, AlertTriangle, CheckCircle, Clock, Zap, Brain, Target, BarChart3 } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress } from '@/components/ui';

export default function AnalysisModel({
  coin,
  timeframe,
  currentPrice,
  indicators,
  onTradeDecision
}) {
  const [analysisResult, setAnalysisResult] = useState({
    overallScore: 0,
    trend: 'neutral',
    confidence: 0,
    signals: [],
    recommendation: 'hold',
    riskLevel: 'medium'
  });
  useEffect(() => {
    analyzeMarket();
  }, [coin, timeframe, currentPrice, indicators]);
  const analyzeMarket = () => {
    // 综合技术分析算法
    const rsiScore = calculateRSIScore(indicators.rsi);
    const macdScore = calculateMACDScore(indicators.macd, indicators.signal);
    const maScore = calculateMAScore(currentPrice, indicators.ma20, indicators.ma50);
    const volumeScore = calculateVolumeScore();
    const overallScore = (rsiScore + macdScore + maScore + volumeScore) / 4;
    const signals = [];
    if (indicators.rsi < 30) signals.push({
      type: 'bullish',
      name: 'RSI超卖',
      strength: 'strong'
    });
    if (indicators.rsi > 70) signals.push({
      type: 'bearish',
      name: 'RSI超买',
      strength: 'strong'
    });
    if (indicators.macd > indicators.signal) signals.push({
      type: 'bullish',
      name: 'MACD金叉',
      strength: 'medium'
    });
    if (indicators.macd < indicators.signal) signals.push({
      type: 'bearish',
      name: 'MACD死叉',
      strength: 'medium'
    });
    if (currentPrice > indicators.ma20 && currentPrice > indicators.ma50) signals.push({
      type: 'bullish',
      name: '均线上方',
      strength: 'weak'
    });
    if (currentPrice < indicators.ma20 && currentPrice < indicators.ma50) signals.push({
      type: 'bearish',
      name: '均线下方',
      strength: 'weak'
    });
    const recommendation = calculateRecommendation(overallScore, signals);
    const confidence = Math.abs(overallScore - 0.5) * 2; // 0-1 置信度
    const trend = overallScore > 0.6 ? 'bullish' : overallScore < 0.4 ? 'bearish' : 'neutral';
    const riskLevel = confidence > 0.7 ? 'low' : confidence > 0.4 ? 'medium' : 'high';
    setAnalysisResult({
      overallScore,
      trend,
      confidence,
      signals,
      recommendation,
      riskLevel
    });
  };
  const calculateRSIScore = rsi => {
    if (rsi < 30) return 0.8; // 超卖，看涨
    if (rsi > 70) return 0.2; // 超买，看跌
    return 0.5; // 中性
  };
  const calculateMACDScore = (macd, signal) => {
    if (macd > signal) return 0.7; // 金叉，看涨
    if (macd < signal) return 0.3; // 死叉，看跌
    return 0.5; // 中性
  };
  const calculateMAScore = (price, ma20, ma50) => {
    if (price > ma20 && price > ma50) return 0.7; // 价格在均线上方
    if (price < ma20 && price < ma50) return 0.3; // 价格在均线下方
    return 0.5; // 中性
  };
  const calculateVolumeScore = () => {
    // 简化版成交量分析
    return 0.5;
  };
  const calculateRecommendation = (score, signals) => {
    const bullishSignals = signals.filter(s => s.type === 'bullish').length;
    const bearishSignals = signals.filter(s => s.type === 'bearish').length;
    if (score > 0.7 && bullishSignals > bearishSignals) return 'strong_buy';
    if (score > 0.6 && bullishSignals >= bearishSignals) return 'buy';
    if (score < 0.3 && bearishSignals > bullishSignals) return 'strong_sell';
    if (score < 0.4 && bearishSignals >= bullishSignals) return 'sell';
    return 'hold';
  };
  const getRecommendationText = rec => {
    switch (rec) {
      case 'strong_buy':
        return '强烈买入';
      case 'buy':
        return '买入';
      case 'hold':
        return '持有';
      case 'sell':
        return '卖出';
      case 'strong_sell':
        return '强烈卖出';
      default:
        return '持有';
    }
  };
  const getTrendColor = trend => {
    switch (trend) {
      case 'bullish':
        return 'text-[#00C853]';
      case 'bearish':
        return 'text-[#FF3D00]';
      default:
        return 'text-gray-400';
    }
  };
  const getRiskColor = risk => {
    switch (risk) {
      case 'low':
        return 'text-[#00C853]';
      case 'medium':
        return 'text-[#FF9800]';
      case 'high':
        return 'text-[#FF3D00]';
      default:
        return 'text-gray-400';
    }
  };
  return <Card className="bg-[#151A25] border-gray-800">
      <CardHeader>
        <CardTitle className="font-['Space_Grotesk'] flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          智能分析模型
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* 综合评分 */}
        <div className="p-4 bg-[#0B0F19] rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">综合评分</span>
            <div className="flex items-center space-x-2">
              <span className={`text-lg font-bold font-['JetBrains_Mono'] ${getTrendColor(analysisResult.trend)}`}>
                {(analysisResult.overallScore * 100).toFixed(0)}%
              </span>
              <Badge variant={analysisResult.trend === 'bullish' ? 'default' : analysisResult.trend === 'bearish' ? 'destructive' : 'secondary'}>
                {analysisResult.trend === 'bullish' ? '看涨' : analysisResult.trend === 'bearish' ? '看跌' : '中性'}
              </Badge>
            </div>
          </div>
          <Progress value={analysisResult.overallScore * 100} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>看跌</span>
            <span>中性</span>
            <span>看涨</span>
          </div>
        </div>

        {/* 交易建议 */}
        <div className={`p-4 rounded-lg border ${analysisResult.recommendation === 'strong_buy' ? 'bg-[#00C853]/10 border-[#00C853]/30' : analysisResult.recommendation === 'buy' ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30' : analysisResult.recommendation === 'strong_sell' ? 'bg-[#FF3D00]/10 border-[#FF3D00]/30' : analysisResult.recommendation === 'sell' ? 'bg-[#F44336]/10 border-[#F44336]/30' : 'bg-[#2962FF]/10 border-[#2962FF]/30'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {analysisResult.recommendation.includes('buy') ? <TrendingUp className="w-6 h-6 text-[#00C853]" /> : analysisResult.recommendation.includes('sell') ? <TrendingDown className="w-6 h-6 text-[#FF3D00]" /> : <Activity className="w-6 h-6 text-[#2962FF]" />}
              <div>
                <div className="font-bold text-lg">
                  {getRecommendationText(analysisResult.recommendation)}
                </div>
                <div className="text-xs text-gray-400">
                  置信度: {(analysisResult.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            <Button size="sm" onClick={() => onTradeDecision(analysisResult.recommendation)} className={`${analysisResult.recommendation.includes('buy') ? 'bg-[#00C853] hover:bg-[#00C853]/90' : analysisResult.recommendation.includes('sell') ? 'bg-[#FF3D00] hover:bg-[#FF3D00]/90' : 'bg-[#2962FF] hover:bg-[#2962FF]/90'}`}>
              快速交易
            </Button>
          </div>
        </div>

        {/* 风险等级 */}
        <div className="p-4 bg-[#0B0F19] rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">风险等级</span>
            <span className={`text-sm font-medium ${getRiskColor(analysisResult.riskLevel)}`}>
              {analysisResult.riskLevel === 'low' ? '低风险' : analysisResult.riskLevel === 'medium' ? '中风险' : '高风险'}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className={`h-2 rounded-full ${analysisResult.riskLevel === 'low' ? 'bg-[#00C853]' : analysisResult.riskLevel === 'medium' ? 'bg-[#FF9800]' : 'bg-[#FF3D00]'}`} style={{
            width: analysisResult.riskLevel === 'low' ? '33%' : analysisResult.riskLevel === 'medium' ? '66%' : '100%'
          }} />
          </div>
        </div>

        {/* 技术信号 */}
        <div className="p-4 bg-[#0B0F19] rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400 mb-3">技术信号</div>
          <div className="space-y-2">
            {analysisResult.signals.map((signal, index) => <div key={index} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                <div className="flex items-center space-x-2">
                  {signal.type === 'bullish' ? <CheckCircle className="w-4 h-4 text-[#00C853]" /> : <AlertTriangle className="w-4 h-4 text-[#FF3D00]" />}
                  <span className="text-sm">{signal.name}</span>
                </div>
                <Badge variant={signal.strength === 'strong' ? 'default' : signal.strength === 'medium' ? 'secondary' : 'outline'}>
                  {signal.strength === 'strong' ? '强' : signal.strength === 'medium' ? '中' : '弱'}
                </Badge>
              </div>)}
            {analysisResult.signals.length === 0 && <div className="text-center text-gray-500 text-sm py-4">
                暂无明确技术信号
              </div>}
          </div>
        </div>

        {/* 分析说明 */}
        <div className="text-xs text-gray-500">
          <div className="flex items-center space-x-1 mb-1">
            <Zap className="w-3 h-3" />
            <span>基于RSI、MACD、移动平均线等多因子分析</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>数据更新频率: {timeframe}</span>
          </div>
        </div>

      </CardContent>
    </Card>;
}