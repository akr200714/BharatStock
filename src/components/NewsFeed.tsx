import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NewsItem {
  title: string;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  summary: string;
  category: string;
}

interface NewsFeedProps {
  news: NewsItem[];
  loading: boolean;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {news.map((item, index) => (
          <Card key={index} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-sm font-bold leading-tight">{item.title}</CardTitle>
                <Badge 
                  variant={item.impact === 'POSITIVE' ? 'default' : item.impact === 'NEGATIVE' ? 'destructive' : 'secondary'}
                  className="flex items-center gap-1 shrink-0"
                >
                  {item.impact === 'POSITIVE' && <TrendingUp size={12} />}
                  {item.impact === 'NEGATIVE' && <TrendingDown size={12} />}
                  {item.impact === 'NEUTRAL' && <Minus size={12} />}
                  {item.impact}
                </Badge>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                {item.category}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.summary}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NewsFeed;
