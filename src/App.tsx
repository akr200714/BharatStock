import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Info, Newspaper, BarChart3, PieChart, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TradingViewChart from './components/TradingViewChart';
import NewsFeed from './components/NewsFeed';
import Financials from './components/Financials';
import { analyzeStock, getMarketNews, StockAnalysis } from './services/geminiService';

const TOP_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries' },
  { symbol: 'TCS', name: 'Tata Consultancy Services' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank' },
  { symbol: 'INFY', name: 'Infosys' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank' },
];

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState(TOP_STOCKS[0]);
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    fetchNews();
    handleAnalyze(TOP_STOCKS[0]);
  }, []);

  const fetchNews = async () => {
    setNewsLoading(true);
    const data = await getMarketNews();
    setNews(data);
    setNewsLoading(false);
  };

  const handleAnalyze = async (stock: typeof TOP_STOCKS[0]) => {
    setLoading(true);
    setSelectedStock(stock);
    const result = await analyzeStock(stock.symbol, stock.name);
    setAnalysis(result);
    setLoading(false);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      handleAnalyze({ symbol: search.toUpperCase(), name: search });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground p-4 md:p-8 font-sans selection:bg-primary/30">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="text-primary-foreground" size={20} />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter">BharatStock <span className="text-primary">AI</span></h1>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Intelligent Indian Market Analysis & Recommendations</p>
          </div>

          <form onSubmit={onSearch} className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <Input 
              placeholder="Search NSE Symbol (e.g. RELIANCE)..." 
              className="pl-10 bg-card border-border/50 focus:border-primary/50 transition-all rounded-xl h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" className="absolute right-1 top-1 h-9 rounded-lg px-3" variant="ghost">
              Analyze
            </Button>
          </form>
        </header>

        {/* Quick Select */}
        <div className="flex flex-wrap gap-2">
          {TOP_STOCKS.map((stock) => (
            <Button 
              key={stock.symbol}
              variant={selectedStock.symbol === stock.symbol ? 'default' : 'outline'}
              size="sm"
              className="rounded-full border-border/50"
              onClick={() => handleAnalyze(stock)}
            >
              {stock.symbol}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Chart Section */}
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-2xl font-bold">{selectedStock.symbol}</CardTitle>
                  <CardDescription>{selectedStock.name}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">NSE</Badge>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">LIVE</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <TradingViewChart symbol={selectedStock.symbol} />
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="bg-card/50 border border-border/50 p-1 rounded-xl mb-6">
                <TabsTrigger value="analysis" className="rounded-lg gap-2">
                  <BarChart3 size={16} /> AI Analysis
                </TabsTrigger>
                <TabsTrigger value="financials" className="rounded-lg gap-2">
                  <PieChart size={16} /> Fundamentals
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="space-y-6">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20 space-y-4"
                    >
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-muted-foreground animate-pulse">Gemini is analyzing market data...</p>
                    </motion.div>
                  ) : analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Recommendation Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="md:col-span-2 bg-primary/5 border-primary/20">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <div className={`p-3 rounded-2xl ${
                                analysis.recommendation === 'BUY' ? 'bg-green-500/20 text-green-500' :
                                analysis.recommendation === 'SELL' ? 'bg-red-500/20 text-red-500' :
                                'bg-yellow-500/20 text-yellow-500'
                              }`}>
                                {analysis.recommendation === 'BUY' ? <CheckCircle2 size={32} /> : 
                                 analysis.recommendation === 'SELL' ? <AlertTriangle size={32} /> : 
                                 <Info size={32} />}
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Recommendation</h3>
                                <p className="text-3xl font-black tracking-tighter">{analysis.recommendation}</p>
                              </div>
                              <div className="ml-auto text-right">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Confidence</h3>
                                <p className="text-3xl font-black tracking-tighter">{(analysis.confidence * 100).toFixed(0)}%</p>
                              </div>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground italic">
                              "{analysis.summary}"
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-card/50 border-border/50">
                          <CardHeader className="p-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Key Risks</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <ul className="space-y-2">
                              {analysis.risks.map((risk, i) => (
                                <li key={i} className="text-xs flex gap-2 items-start text-red-400/80">
                                  <span className="mt-1 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Technicals vs Fundamentals */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest">
                            <BarChart3 size={16} className="text-primary" /> Technical Indicators
                          </h4>
                          <div className="space-y-2">
                            {analysis.technicalPoints.map((point, i) => (
                              <div key={i} className="p-3 bg-card/30 border border-border/30 rounded-xl text-xs">
                                {point}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest">
                            <PieChart size={16} className="text-primary" /> Fundamentals
                          </h4>
                          <div className="space-y-2">
                            {analysis.fundamentalPoints.map((point, i) => (
                              <div key={i} className="p-3 bg-card/30 border border-border/30 rounded-xl text-xs">
                                {point}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="financials">
                <Financials symbol={selectedStock.symbol} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - News & Events */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Newspaper size={20} className="text-primary" /> Market Intel
              </h2>
              <Button variant="ghost" size="sm" onClick={fetchNews} className="text-[10px] uppercase tracking-widest h-7">
                Refresh
              </Button>
            </div>
            <Separator className="bg-border/30" />
            <NewsFeed news={news} loading={newsLoading} />
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border/30 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] max-w-2xl mx-auto leading-loose">
          Disclaimer: This AI-generated analysis is for educational purposes only. Investing in stocks involves significant risk. Always consult with a certified financial advisor before making any investment decisions. BharatStock AI does not guarantee any returns.
        </p>
      </footer>
    </div>
  );
}
