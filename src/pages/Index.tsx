import { useEffect } from 'react';
import { useThemeStore } from '../store/theme';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const features = [
  'Upload audio/video in seconds',
  'Auto-transcribed, searchable text',
  'Click-to-seek and tagging',
  'AI summaries, sentiment, and keywords',
];

const Index = () => {
  const { setTheme } = useThemeStore();

  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-16 lg:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
                Turn interviews into <span className="bg-gradient-brand bg-clip-text text-transparent">insights</span>
              </h1>
              <p className="text-muted-foreground text-lg lg:text-xl mb-8 max-w-prose">
                Nexa Interviews transcribes your recordings and surfaces key themes, sentiment, and highlights — so you can focus on decisions, not note‑taking.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {features.map((f) => (
                  <div key={f} className="inline-flex items-center gap-2 text-sm bg-card border rounded-full px-3 py-1">
                    <CheckCircle2 className="h-4 w-4 text-nexa-green" />{f}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Link to="/">
                  <Button variant="brand" size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="lg" className="gap-2">
                    Live Demo <Sparkles className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[16/10] rounded-xl border bg-gradient-to-br from-background to-muted flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full" style={{background: 'linear-gradient(135deg,#0B1F3B,#FF7A00)'}}></div>
                  <p className="text-sm text-muted-foreground">Upload → Transcribe → Analyze</p>
                  <p className="text-xs text-muted-foreground">Seamless, fast, and privacy‑aware</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container mx-auto px-6 pb-16 lg:pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {title: 'Upload', desc: 'Drag-and-drop audio/video with instant validation.'},
              {title: 'Transcribe', desc: 'Accurate, searchable transcripts with timecodes.'},
              {title: 'Analyze', desc: 'AI highlights sentiment, keywords, and Q&A.'},
            ].map((c) => (
              <div key={c.title} className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold mb-1">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
