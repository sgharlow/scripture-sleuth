/**
 * ContributionForm Component
 * Form for submitting AI comment contributions
 */

import React, { useState } from 'react';
import type { Category, SubmitContributionRequest } from '../../types';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'life', label: 'Life & Advice' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'tech', label: 'Technology' },
  { value: 'food', label: 'Food & Cooking' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'sports', label: 'Sports' },
  { value: 'science', label: 'Science' },
];

export interface ContributionFormProps {
  onSubmit: (data: SubmitContributionRequest) => void;
  disabled?: boolean;
}

export function ContributionForm({ onSubmit, disabled }: ContributionFormProps): React.ReactElement {
  const [promptIdea, setPromptIdea] = useState('');
  const [category, setCategory] = useState<Category>('life');
  const [aiCommentText, setAiCommentText] = useState('');
  const [aiTells, setAiTells] = useState<string[]>(['']);

  const handleAddTell = () => {
    if (aiTells.length < 5) {
      setAiTells([...aiTells, '']);
    }
  };

  const handleRemoveTell = (index: number) => {
    if (aiTells.length > 1) {
      setAiTells(aiTells.filter((_, i) => i !== index));
    }
  };

  const handleTellChange = (index: number, value: string) => {
    const newTells = [...aiTells];
    newTells[index] = value;
    setAiTells(newTells);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty tells
    const filteredTells = aiTells.filter(t => t.trim().length > 0);

    if (promptIdea.trim() && aiCommentText.trim() && filteredTells.length > 0) {
      onSubmit({
        promptIdea: promptIdea.trim(),
        category,
        aiCommentText: aiCommentText.trim(),
        aiTells: filteredTells,
      });

      // Reset form
      setPromptIdea('');
      setAiCommentText('');
      setAiTells(['']);
    }
  };

  const isValid = promptIdea.trim() && aiCommentText.trim() && aiTells.some(t => t.trim());

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Prompt Idea */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prompt/Question Idea
        </label>
        <input
          type="text"
          value={promptIdea}
          onChange={(e) => setPromptIdea(e.target.value)}
          placeholder="e.g., What's a skill you wish you learned earlier?"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={disabled}
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">{promptIdea.length}/200</p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={disabled}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* AI Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your AI-Style Comment
        </label>
        <textarea
          value={aiCommentText}
          onChange={(e) => setAiCommentText(e.target.value)}
          placeholder="Write a comment that sounds like it was written by AI..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
          disabled={disabled}
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">{aiCommentText.length}/500</p>
      </div>

      {/* AI Tells */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Why Does This Sound Like AI? (1-5 reasons)
        </label>
        <div className="space-y-2">
          {aiTells.map((tell, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={tell}
                onChange={(e) => handleTellChange(index, e.target.value)}
                placeholder={`Reason ${index + 1}...`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={disabled}
                maxLength={150}
              />
              {aiTells.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTell(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  disabled={disabled}
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
        {aiTells.length < 5 && (
          <button
            type="button"
            onClick={handleAddTell}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
            disabled={disabled}
          >
            + Add another reason
          </button>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled || !isValid}
        className={`w-full py-3 px-6 rounded-xl font-bold transition-colors ${
          isValid && !disabled
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {disabled ? 'Submitting...' : 'Submit Contribution'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your contribution may be used in future puzzles if approved!
      </p>
    </form>
  );
}

export default ContributionForm;
