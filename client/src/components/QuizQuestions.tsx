"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface QuizQuestionsProps {
  questions: { question: string; options: string[]; answer: string }[];
  setQuestions: React.Dispatch<
    React.SetStateAction<
      { question: string; options: string[]; answer: string }[]
    >
  >;
}

export function QuizQuestions({ questions, setQuestions }: QuizQuestionsProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [answer, setanswer] = useState("");

  const addQuestion = () => {
    if (newQuestion && newOptions.every((option) => option) && answer) {
      setQuestions([
        ...questions,
        { question: newQuestion, options: newOptions, answer },
      ]);
      setNewQuestion("");
      setNewOptions(["", "", "", ""]);
      setanswer("");
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <div key={index} className="p-4 border rounded-md relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => removeQuestion(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <p className="font-semibold">{q.question}</p>
          <ul className="list-disc list-inside">
            {q.options.map((option, i) => (
              <li
                key={i}
                className={option === q.answer ? "text-green-600" : ""}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="space-y-2">
        <Label htmlFor="newQuestion">New Question</Label>
        <Input
          id="newQuestion"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Enter new question"
        />
      </div>
      {newOptions.map((option, index) => (
        <div key={index} className="space-y-2">
          <Label htmlFor={`option${index + 1}`}>Option {index + 1}</Label>
          <Input
            id={`option${index + 1}`}
            value={option}
            onChange={(e) => {
              const updatedOptions = [...newOptions];
              updatedOptions[index] = e.target.value;
              setNewOptions(updatedOptions);
            }}
            placeholder={`Enter option ${index + 1}`}
          />
        </div>
      ))}
      <div className="space-y-2">
        <Label htmlFor="answer">Correct Answer</Label>
        <Input
          id="answer"
          value={answer}
          onChange={(e) => setanswer(e.target.value)}
          placeholder="Enter correct answer"
        />
      </div>
      <Button type={"button"} onClick={addQuestion}>Add Question</Button>
    </div>
  );
}
