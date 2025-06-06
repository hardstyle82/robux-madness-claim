import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { toast } = useToast();
  
  // State management
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [claimCount, setClaimCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalRobux, setTotalRobux] = useState(0);
  const [mainProgress, setMainProgress] = useState(2847);
  const [clickProgress, setClickProgress] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [lastWin, setLastWin] = useState({ amount: 0, type: 'robux' });
  const [dailyBonus, setDailyBonus] = useState(false);
  const [referralCode, setReferralCode] = useState('RBLX' + Math.random().toString(36).substr(2, 6).toUpperCase());

  // Fake players data (35 players as requested)
  const [players, setPlayers] = useState([
    { name: 'RobloxGamer2024', avatar: '🎮', robux: 50, time: 'сейчас' },
    { name: 'ProBuilder777', avatar: '🏗️', robux: 100, time: '2 сек назад' },
    { name: 'NoobSlayer99', avatar: '⚔️', robux: 75, time: '5 сек назад' },
    { name: 'BlockMaster', avatar: '🧱', robux: 25, time: '8 сек назад' },
    { name: 'MegaBuilder2k', avatar: '🚀', robux: 150, time: '12 сек назад' },
    { name: 'CoolDude123', avatar: '😎', robux: 80, time: '15 сек назад' },
    { name: 'RobuxHunter', avatar: '🎯', robux: 65, time: '18 сек назад' },
    { name: 'BlockChamp', avatar: '🏆', robux: 95, time: '21 сек назад' },
    { name: 'GamerPro2024', avatar: '⭐', robux: 110, time: '24 сек назад' },
    { name: 'RobloxKing', avatar: '👑', robux: 130, time: '27 сек назад' },
    { name: 'BuilderBoss', avatar: '🔨', robux: 45, time: '30 сек назад' },
    { name: 'SpeedRunner', avatar: '⚡', robux: 85, time: '33 сек назад' },
    { name: 'CraftMaster', avatar: '🛠️', robux: 70, time: '36 сек назад' },
    { name: 'RobuxLord', avatar: '💎', robux: 120, time: '39 сек назад' },
    { name: 'GameWiz', avatar: '🧙', robux: 55, time: '42 сек назад' },
    { name: 'BlockNinja', avatar: '🥷', robux: 90, time: '45 сек назад' },
    { name: 'ProGamer99', avatar: '🎲', robux: 105, time: '48 сек назад' },
    { name: 'RobloxStar', avatar: '🌟', robux: 35, time: '51 сек назад' },
    { name: 'BuildKing', avatar: '🏰', robux: 115, time: '54 сек назад' },
    { name: 'GameMaster', avatar: '🎖️', robux: 60, time: '57 сек назад' },
    { name: 'RobuxHero', avatar: '🦸', robux: 125, time: '1 мин назад' },
    { name: 'BlockExpert', avatar: '🔥', robux: 40, time: '1 мин назад' },
    { name: 'ProBuilder', avatar: '🏗️', robux: 95, time: '1 мин назад' },
    { name: 'RobloxFan', avatar: '❤️', robux: 75, time: '1 мин назад' },
    { name: 'GameChamp', avatar: '🏅', robux: 135, time: '1 мин назад' },
    { name: 'BlockWizard', avatar: '🪄', robux: 50, time: '1 мин назад' },
    { name: 'RobuxSeeker', avatar: '🔍', robux: 80, time: '1 мин назад' },
    { name: 'BuilderPro', avatar: '⚒️', robux: 100, time: '1 мин назад' },
    { name: 'GameGuru', avatar: '🧠', robux: 65, time: '1 мин назад' },
    { name: 'RobloxAce', avatar: '🃏', robux: 110, time: '1 мин назад' },
    { name: 'BlockSage', avatar: '👴', robux: 85, time: '1 мин назад' },
    { name: 'ProGamer', avatar: '🎮', robux: 70, time: '1 мин назад' },
    { name: 'RobuxMiner', avatar: '⛏️', robux: 90, time: '1 мин назад' },
    { name: 'BuildGenius', avatar: '🤓', robux: 55, time: '1 мин назад' },
    { name: 'GameLegend', avatar: '🌟', robux: 140, time: '1 мин назад' }
  ]);

  // Leaderboard data
  const [leaderboard] = useState([
    { rank: 1, name: 'RobuxKing2024', avatar: '👑', robux: 15420 },
    { rank: 2, name: 'BlockMaster99', avatar: '🎯', robux: 12350 },
    { rank: 3, name: 'ProGamer777', avatar: '🎮', robux: 9870 },
    { rank: 4, name: 'BuilderPro', avatar: '🏗️', robux: 8560 },
    { rank: 5, name: 'RobloxLord', avatar: '⚡', robux: 7230 }
  ]);

  // Analytics data
  const [analytics] = useState({
    visitors: 142847,
    robuxClaimed: 8942356,
    activeUsers: 3247
  });

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Auto-update players
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(prev => {
        const newPlayers = [...prev];
        const randomIndex = Math.floor(Math.random() * newPlayers.length);
        newPlayers[randomIndex] = {
          ...newPlayers[randomIndex],
          robux: Math.floor(Math.random() * 200) + 25,
          time: 'сейчас'
        };
        return newPlayers.map((player, index) => 
          index === randomIndex ? player : { ...player, time: updateTime(player.time) }
        );
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateTime = (currentTime: string) => {
    if (currentTime === 'сейчас') return '3 сек назад';
    if (currentTime === '3 сек назад') return '6 сек назад';
    if (currentTime === '6 сек назад') return '9 сек назад';
    return currentTime;
  };

  const handleSubscribe = () => {
    window.open('https://www.youtube.com/@madnessgames_?sub_confirmation=1', '_blank');
    setIsSubscribed(true);
    toast({
      title: "Спасибо за подписку! 🎉",
      description: "Теперь вы можете получать Robux!",
    });
  };

  const handleClaim = () => {
    if (!isSubscribed || timeLeft > 0) return;

    const newClaimCount = claimCount + 1;
    setClaimCount(newClaimCount);
    setClickProgress(Math.min(clickProgress + 1, 1000));

    let winAmount = 0;
    let winType = 'robux';
    
    // Random win logic
    const random = Math.random();
    if (random < 0.01) { // 1% chance for 1000 Robux
      winAmount = 1000;
      winType = 'mega';
    } else if (random < 0.05) { // 4% chance for promo code
      winType = 'promo';
      winAmount = 0;
    } else { // 95% chance for 25-100 Robux
      winAmount = Math.floor(Math.random() * 76) + 25;
    }

    if (winType !== 'promo') {
      setTotalRobux(totalRobux + winAmount);
    }

    setLastWin({ amount: winAmount, type: winType });
    setShowWinModal(true);

    // Set cooldown after 3 claims
    if (newClaimCount % 3 === 0) {
      setTimeLeft(25);
    }

    toast({
      title: winType === 'promo' ? "Промо-код получен! 🎟️" : `+${winAmount} Robux! 💎`,
      description: winType === 'promo' ? "RBLX2024FREE" : `Всего собрано: ${totalRobux + winAmount} Robux`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canClaimMainReward = mainProgress >= 10000;
  const canClaimClickReward = clickProgress >= 1000;

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Analytics Header */}
        <Card className="stats-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-robux-green">{analytics.visitors.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Посетителей сегодня</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-robux-gold">{analytics.robuxClaimed.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Robux роздано</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-robux-blue">{analytics.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Онлайн сейчас</div>
            </div>
          </div>
        </Card>

        {/* Main Progress Bar */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Главный прогресс</h2>
              <span className="text-robux-green font-bold">{mainProgress}/10000</span>
            </div>
            <Progress value={(mainProgress / 10000) * 100} className="h-4" />
            <Button 
              className={`w-full ${canClaimMainReward ? 'bg-robux-green hover:bg-robux-green/80' : ''}`}
              disabled={!canClaimMainReward}
              onClick={() => window.open('https://www.youtube.com/@madnessgames_?sub_confirmation=1', '_blank')}
            >
              Забрать Robux! {canClaimMainReward ? '✅' : '🔒'}
            </Button>
          </div>
        </Card>

        {/* Click Progress Bar */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Прогресс кликов</h2>
              <span className="text-robux-purple font-bold">{clickProgress}/1000</span>
            </div>
            <Progress value={(clickProgress / 1000) * 100} className="h-4" />
            <Button 
              className={`w-full ${canClaimClickReward ? 'bg-robux-purple hover:bg-robux-purple/80' : ''}`}
              disabled={!canClaimClickReward}
              onClick={() => window.open('https://t.me/zarabotay_depin', '_blank')}
            >
              Получить 10000 R {canClaimClickReward ? '✅' : '🔒'}
            </Button>
          </div>
        </Card>

        {/* Main Claim Section */}
        <Card className="p-8 text-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold robux-glow">ROBUX FAUCET</h1>
              <p className="text-robux-gold font-bold text-xl">Собрано: {totalRobux} Robux</p>
              <Progress value={(totalRobux / 10000) * 100} className="h-3" />
              <p className="text-sm text-muted-foreground">До 10000 Robux: {10000 - totalRobux}</p>
            </div>

            {!isSubscribed && (
              <Button 
                onClick={handleSubscribe}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl text-lg"
              >
                🔔 Подписаться на канал
              </Button>
            )}

            <Button 
              onClick={handleClaim}
              disabled={!isSubscribed || timeLeft > 0}
              className="claim-button text-2xl py-6 px-12"
            >
              {timeLeft > 0 ? `ЖДИТЕ ${formatTime(timeLeft)}` : 'CLAIM ROBUX! 💎'}
            </Button>

            {timeLeft > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-robux-blue">{formatTime(timeLeft)}</div>
                <div className="text-sm text-muted-foreground">до следующего получения</div>
              </div>
            )}

            <div className="space-y-4">
              <Button 
                onClick={() => window.open('https://getfile.dokpub.com/yandex/get/https://disk.yandex.ru/d/Dpi6-vXUvyqWrw', '_blank')}
                className="bg-robux-purple hover:bg-robux-purple/80 text-white font-bold py-3 px-6 rounded-xl"
              >
                📱 Скачать Автокликер
              </Button>
              <p className="text-sm text-muted-foreground">
                Автоматизируй действия с помощью Автокликера
              </p>
            </div>
          </div>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Activity - All 35 Players */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">🔥 Недавние выигрыши (Онлайн: {players.length})</h3>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {players.map((player, index) => (
                <div key={index} className="player-card flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{player.avatar}</span>
                    <div>
                      <div className="font-semibold text-sm">{player.name}</div>
                      <div className="text-xs text-muted-foreground">{player.time}</div>
                    </div>
                  </div>
                  <Badge className="bg-robux-gold text-black text-xs">+{player.robux} R$</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Leaderboard */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">🏆 Топ игроков</h3>
            <div className="space-y-3">
              {leaderboard.map((player) => (
                <div key={player.rank} className="player-card flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-robux-blue flex items-center justify-center text-white font-bold">
                      {player.rank}
                    </div>
                    <span className="text-xl">{player.avatar}</span>
                    <div>
                      <div className="font-semibold">{player.name}</div>
                    </div>
                  </div>
                  <Badge className="bg-robux-gold text-black">{player.robux.toLocaleString()} R$</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bonus Section */}
        <Card className="p-6">
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">🎁 Ежедневный бонус</TabsTrigger>
              <TabsTrigger value="referral">👥 Реферальная программа</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="space-y-4">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">Ежедневный бонус</h3>
                <p className="text-muted-foreground">Заходи каждый день и получай бонусы!</p>
                <Button 
                  onClick={() => {
                    setDailyBonus(true);
                    setTotalRobux(prev => prev + 50);
                    toast({ title: "Бонус получен! +50 Robux 🎁" });
                  }}
                  disabled={dailyBonus}
                  className="bg-robux-green hover:bg-robux-green/80"
                >
                  {dailyBonus ? 'Получено сегодня ✅' : 'Получить бонус +50 R$'}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="referral" className="space-y-4">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">Приглашай друзей</h3>
                <p className="text-muted-foreground">За каждого друга получи 100 Robux!</p>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm mb-2">Твой реферальный код:</p>
                  <div className="bg-background p-2 rounded border font-mono text-robux-blue">
                    {referralCode}
                  </div>
                </div>
                <Button className="bg-robux-blue hover:bg-robux-blue/80">
                  Скопировать ссылку
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Win Modal */}
      <Dialog open={showWinModal} onOpenChange={setShowWinModal}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {lastWin.type === 'mega' ? '🎉 МЕГА ВЫИГРЫШ! 🎉' : 
               lastWin.type === 'promo' ? '🎟️ ПРОМО-КОД! 🎟️' : '💎 ПОЗДРАВЛЯЕМ! 💎'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="text-6xl coin-animation mb-4">
              {lastWin.type === 'mega' ? '💰' : lastWin.type === 'promo' ? '🎟️' : '💎'}
            </div>
            <div className="text-4xl font-bold robux-glow mb-2">
              {lastWin.type === 'promo' ? 'RBLX2024FREE' : `+${lastWin.amount} Robux`}
            </div>
            <p className="text-muted-foreground">
              {lastWin.type === 'mega' ? 'Невероятная удача!' : 
               lastWin.type === 'promo' ? 'Используй код в Roblox' : 'Отличная работа!'}
            </p>
          </div>
          <Button onClick={() => setShowWinModal(false)} className="w-full">
            Продолжить
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;