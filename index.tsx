import { useState } from 'react';
import QuestionTypeSelector from '@/components/QuestionTypeSelector';
import Quiz from '@/components/Quiz';
import Results from '@/components/Results';
import SwotExplainer from '@/components/SwotExplainer';
import ReviewSection from '@/components/ReviewSection';
import AiChatHelper from '@/components/AiChatHelper';
import { getQuestions } from '@/data/questions';
import { analyzeSwot } from '@/utils/analyzeSwot';
import { Answer, SwotResult } from '@/types/swot';

type AppState = 'home' | 'select' | 'quiz' | 'results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('home');
  const [questionType, setQuestionType] = useState<'mcq' | 'subjective'>('mcq');
  const [result, setResult] = useState<SwotResult | null>(null);

  const handleStart = () => {
    setAppState('select');
  };

  const handleSelectType = (type: 'mcq' | 'subjective') => {
    setQuestionType(type);
    setAppState('quiz');
  };

  const handleQuizComplete = (answers: Answer[]) => {
    const analysis = analyzeSwot(answers);
    setResult(analysis);
    setAppState('results');
  };

  const handleRestart = () => {
    setResult(null);
    setAppState('home');
  };

  const handleBackToSelect = () => {
    setAppState('select');
  };

  const handleBackToHome = () => {
    setAppState('home');
  };

  return (
    <main className="min-h-screen">
      {appState === 'home' && (
        <SwotExplainer onStart={handleStart} />
      )}
      
      {appState === 'select' && (
        <QuestionTypeSelector 
          onSelect={handleSelectType} 
          onBack={handleBackToHome}
        />
      )}
      
      {appState === 'quiz' && (
        <Quiz 
          questions={getQuestions(questionType)} 
          onComplete={handleQuizComplete}
          onBack={handleBackToSelect}
        />
      )}
      
      {appState === 'results' && result && (
        <>
          <Results result={result} onRestart={handleRestart} />
          <ReviewSection />
        </>
      )}

      {/* AI Chat Helper - always visible */}
      <AiChatHelper />
    </main>
  );
};

export default Index;
