import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';

const NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const RouletteWheel = ({ spinning, number }) => (
  <div className="relative w-64 h-64 mx-auto mb-8">
    <div className={`w-full h-full rounded-full border-4 border-gray-800 bg-green-700 ${spinning ? 'animate-spin' : ''}`}>
      {NUMBERS.map((num, index) => (
        <div
          key={num}
          className="absolute w-1 h-8 bg-white"
          style={{
            transform: `rotate(${index * (360 / NUMBERS.length)}deg)`,
            transformOrigin: 'bottom center',
            left: 'calc(50% - 0.5px)',
            bottom: '50%',
          }}
        />
      ))}
    </div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold">
      {number}
    </div>
  </div>
);

export default function Roulette() {
  const [bet, setBet] = useState(0);
  const [number, setNumber] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [result, setResult] = useState(null);

  const spin = () => {
    if (bet <= 0 || bet > balance) return;

    setSpinning(true);
    setBalance(prevBalance => prevBalance - bet);

    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37);
      setNumber(winningNumber);
      setSpinning(false);

      if (winningNumber === 0) {
        setBalance(prevBalance => prevBalance + bet * 35);
        setResult(`You won ${bet * 35}!`);
      } else {
        setResult('You lost. Try again!');
      }
    }, 3000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Roulette Game</h1>
      
      <RouletteWheel spinning={spinning} number={number} />

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Your Balance: ${balance}</h2>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Input
              type="number"
              value={bet}
              onChange={(e) => setBet(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="Enter your bet"
              className="flex-grow"
            />
            <Button onClick={spin} disabled={spinning || bet <= 0 || bet > balance}>
              {spinning ? 'Spinning...' : 'Spin'}
            </Button>
          </div>
          {result && (
            <AlertDialog open={!!result} onOpenChange={() => setResult(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Result</AlertDialogTitle>
                  <AlertDialogDescription>{result}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>OK</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">How to Play</h2>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside">
            <li>Enter your bet amount</li>
            <li>Click the "Spin" button</li>
            <li>If the ball lands on 0, you win 35 times your bet!</li>
            <li>Any other number, and you lose your bet</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}