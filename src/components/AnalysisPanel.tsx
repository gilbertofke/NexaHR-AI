import { TrendingUp, MessageSquare, Hash, Brain, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Analysis } from '../types/interview';
import { useUIStore } from '../store/ui';

interface AnalysisPanelProps {
  analysis: Analysis;
  interviewId: string;
}

export const AnalysisPanel = ({ analysis, interviewId }: AnalysisPanelProps) => {
  const { tags } = useUIStore();

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-nexa-green bg-nexa-green/10';
      case 'negative':
        return 'text-nexa-red bg-nexa-red/10';
      case 'neutral':
        return 'text-nexa-blue bg-nexa-blue/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const handleExport = () => {
    const exportData = {
      interviewId,
      timestamp: new Date().toISOString(),
      analysis,
      tags,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${interviewId}-analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Analysis</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="summary" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 m-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto px-4 pb-4">
            <TabsContent value="summary" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-sm">
                    <Brain className="h-4 w-4 mr-2 text-nexa-purple" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.summary ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {analysis.summary}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Summary not available. Try running analysis again.
                    </p>
                  )}
                </CardContent>
              </Card>

              {tags.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-sm">
                      <Hash className="h-4 w-4 mr-2 text-nexa-orange" />
                      Your Tags ({tags.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tags.map((tag) => (
                        <div key={tag.id} className="p-2 bg-muted rounded text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-nexa-purple">
                              {tag.label}
                            </Badge>
                            <span className="text-muted-foreground">
                              {Math.floor(tag.startTime / 60)}:
                              {(tag.startTime % 60).toFixed(0).padStart(2, '0')}
                            </span>
                          </div>
                          <p className="text-muted-foreground">"{tag.text}"</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="sentiment" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-2 text-nexa-blue" />
                    Sentiment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.sentiment ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-muted-foreground">Overall:</span>
                        <Badge className={`capitalize ${getSentimentColor(analysis.sentiment)}`}>
                          {analysis.sentiment}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Interpretation:</div>
                        <p className="text-sm text-muted-foreground">
                          {analysis.sentiment === 'positive' && 
                            'The interview shows positive engagement, enthusiasm, and constructive dialogue.'}
                          {analysis.sentiment === 'negative' && 
                            'The interview indicates concerns, challenges, or areas that may need attention.'}
                          {analysis.sentiment === 'neutral' && 
                            'The interview maintains a professional, balanced tone throughout.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Sentiment analysis not available.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keywords" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-sm">
                    <Hash className="h-4 w-4 mr-2 text-nexa-orange" />
                    Key Topics ({analysis.keywords?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.keywords && analysis.keywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.map((keyword, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          className="text-nexa-orange bg-nexa-orange/10"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No keywords extracted yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qa" className="mt-0 space-y-4">
              {analysis.questions && analysis.questions.length > 0 ? (
                analysis.questions.map((qa, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-sm">
                        <MessageSquare className="h-4 w-4 mr-2 text-nexa-green" />
                        Q&A #{index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-nexa-purple mb-1">Question:</div>
                        <p className="text-sm">{qa.question}</p>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-nexa-blue mb-1">Answer:</div>
                        <p className="text-sm text-muted-foreground">{qa.answer}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground italic">
                      No Q&A pairs extracted yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};