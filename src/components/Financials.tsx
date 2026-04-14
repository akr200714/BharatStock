import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FinancialsProps {
  symbol: string;
}

const Financials: React.FC<FinancialsProps> = ({ symbol }) => {
  // Mock data for demonstration - in a real app, this would be fetched from an API
  const data = {
    ratios: [
      { label: 'P/E Ratio', value: '24.5' },
      { label: 'P/B Ratio', value: '3.2' },
      { label: 'Dividend Yield', value: '1.2%' },
      { label: 'ROE', value: '18.4%' },
      { label: 'Debt to Equity', value: '0.45' },
      { label: 'EPS (TTM)', value: '₹42.30' },
    ],
    performance: [
      { period: '1 Year', return: '+15.4%' },
      { period: '3 Year', return: '+45.2%' },
      { period: '5 Year', return: '+120.5%' },
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Key Ratios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {data.ratios.map((ratio) => (
                <TableRow key={ratio.label} className="hover:bg-transparent border-border/30">
                  <TableCell className="font-medium py-2">{ratio.label}</TableCell>
                  <TableCell className="text-right py-2 font-mono">{ratio.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Historical Returns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Return</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.performance.map((perf) => (
                <TableRow key={perf.period} className="hover:bg-transparent border-border/30">
                  <TableCell className="py-2">{perf.period}</TableCell>
                  <TableCell className={`text-right py-2 font-mono ${perf.return.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {perf.return}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Financials;
