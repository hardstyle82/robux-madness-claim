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
  
  // Load from localStorage
  const loadFromStorage = () => {
    const saved = localStorage.getItem('robuxGameData');
    if (saved) {
      const data = JSON.parse(saved);
      return {
        isSubscribed: data.isSubscribed || false,
        claimCount: data.claimCount || 0,
        totalRobux: data.totalRobux || 0,
        clickProgress: data.clickProgress || 0,
        dailyBonus: data.dailyBonus || false,
        referralCode: data.referralCode || 'RBLX' + Math.random().toString(36).substr(2, 6).toUpperCase()
      };
    }
    return {
      isSubscribed: false,
      claimCount: 0,
      totalRobux: 0,
      clickProgress: 0,
      dailyBonus: false,
      referralCode: 'RBLX' + Math.random().toString(36).substr(2, 6).toUpperCase()
    };
  };

  const savedData = loadFromStorage();
  
  // State management
  const [isSubscribed, setIsSubscribed] = useState(savedData.isSubscribed);
  const [claimCount, setClaimCount] = useState(savedData.claimCount);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalRobux, setTotalRobux] = useState(savedData.totalRobux);
  const [mainProgress, setMainProgress] = useState(0); // Начинается с 0
  const [clickProgress, setClickProgress] = useState(savedData.clickProgress);
  const [showWinModal, setShowWinModal] = useState(false);
  const [lastWin, setLastWin] = useState({ amount: 0, type: 'robux' });
  const [dailyBonus, setDailyBonus] = useState(savedData.dailyBonus);
  const [referralCode, setReferralCode] = useState(savedData.referralCode);
  const [chatMessage, setChatMessage] = useState('');
  const [realPlayerWins, setRealPlayerWins] = useState([]);

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

  // Save to localStorage
  useEffect(() => {
    const dataToSave = {
      isSubscribed,
      claimCount,
      totalRobux,
      clickProgress,
      dailyBonus,
      referralCode
    };
    localStorage.setItem('robuxGameData', JSON.stringify(dataToSave));
  }, [isSubscribed, claimCount, totalRobux, clickProgress, dailyBonus, referralCode]);

  // Leaderboard data
  const [leaderboard] = useState([
    { rank: 1, name: 'RobuxKing2024', avatar: '👑', robux: 950420 },
    { rank: 2, name: 'BlockMaster99', avatar: '🎯', robux: 812350 },
    { rank: 3, name: 'ProGamer777', avatar: '🎮', robux: 759870 },
    { rank: 4, name: 'BuilderPro', avatar: '🏗️', robux: 698560 },
    { rank: 5, name: 'RobloxLord', avatar: '⚡', robux: 627230 }
  ]);

  // Chat messages data
  const [chatMessages, setChatMessages] = useState([
    { name: 'RobuxKing2024', avatar: '👑', message: 'Только что получил 850 робуксов! 🔥', time: 'сейчас' },
    { name: 'ProGamer777', avatar: '🎮', message: 'Кто знает секретные коды на робуксы?', time: '1 мин назад' },
    { name: 'BlockMaster99', avatar: '🎯', message: 'Этот сайт лучший для фарма робуксов!', time: '2 мин назад' },
    { name: 'GameChamp', avatar: '🏅', message: 'Скачал автокликер, теперь робуксы сами капают 💰', time: '3 мин назад' },
    { name: 'RobuxLord', avatar: '⚡', message: 'Друзья, не забывайте подписываться на канал!', time: '4 мин назад' }
  ]);

  // Support data
  const [supportOpen, setSupportOpen] = useState(false);

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

  // Auto-update chat
  useEffect(() => {
    const chatInterval = setInterval(() => {
      const newMessages = [
        'Бля, этот сайт охуенно работает! Уже 5к робуксов!',
        'Чекайте автокликер, он дохуя эффективный!',
        'Ёбаный в рот, промо-код сработал! 1000 робуксов!',
        'Пиздец как круто! Подписался и сразу робуксы!',
        'Ребята, не ебите мозги, сайт рабочий!',
        'Автокликер ваще огонь, сам качайте!',
        'Блять, как же я раньше без этого жил?!',
        'Друзья, рефералка дает неплохой бонус!',
        'МЕГА выигрыш 1000 робуксов! Ахуеть можно!',
        'Каждый день захожу, ибо нахуй надо робуксы!',
        'Реально работает, не разводняк какой-то!',
        'Кто-то знает секреты фарма робуксов?',
        'Подписался на канал - робуксы потекли рекой!',
        'Этот фаучет лучше всех, что пробовал!',
        'Друзья, используйте рефералку обязательно!',
        'Только что выиграл промо-код! Спасибо!',
        'Автокликер реально работает, всем советую!',
        'Ребята, этот сайт топовый! Уже куча робуксов!',
        'Блядь, как быстро робуксы капают с автокликером!',
        'Пиздато сделан сайт, все честно работает!',
        'Нахуй другие сайты, этот самый лучший!',
        'Ебать, сколько я уже тут робуксов заработал!',
        'Чекайте ежедневный бонус, не забывайте!',
        'Охуенная реферальная программа, всех приглашаю!',
        'Бля, как же я кайфую от этих робуксов!'
      ];
      
      setChatMessages(prev => {
        // Избегаем дублирования сообщений
        let randomMessage;
        let attempts = 0;
        do {
          randomMessage = newMessages[Math.floor(Math.random() * newMessages.length)];
          attempts++;
        } while (prev.some(msg => msg.message === randomMessage) && attempts < 10);
        
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        const newMsg = {
          name: randomPlayer.name,
          avatar: randomPlayer.avatar,
          message: randomMessage,
          time: 'сейчас'
        };
        
        const updatedMessages = [newMsg, ...prev.slice(0, 4)].map((msg, index) => 
          index === 0 ? msg : { ...msg, time: updateChatTime(msg.time) }
        );
        
        return updatedMessages;
      });
    }, Math.floor(Math.random() * 4000) + 5000); // 5-8 секунд
    
    return () => clearInterval(chatInterval);
  }, [players]);

  // Update main progress automatically
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setMainProgress(prev => {
        const increment = Math.floor(Math.random() * 5) + 1;
        return Math.min(prev + increment, 10000);
      });
    }, 8000);
    
    return () => clearInterval(progressInterval);
  }, []);

  const updateTime = (currentTime: string) => {
    if (currentTime === 'сейчас') return '3 сек назад';
    if (currentTime === '3 сек назад') return '6 сек назад';
    if (currentTime === '6 сек назад') return '9 сек назад';
    return currentTime;
  };

  const updateChatTime = (currentTime: string) => {
    if (currentTime === 'сейчас') return '1 мин назад';
    if (currentTime === '1 мин назад') return '2 мин назад';
    if (currentTime === '2 мин назад') return '3 мин назад';
    if (currentTime === '3 мин назад') return '4 мин назад';
    if (currentTime === '4 мин назад') return '5 мин назад';
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
    } else { // 95% chance for 10-55 Robux
      winAmount = Math.floor(Math.random() * 46) + 10;
    }

    if (winType !== 'promo') {
      setTotalRobux(totalRobux + winAmount);
    }

    // Добавляем выигрыш реального игрока в недавние выигрыши
    if (winType !== 'promo') {
      const realPlayerWin = {
        name: 'Вы',
        avatar: '🎮',
        robux: winAmount,
        time: 'сейчас'
      };
      setPlayers(prev => [realPlayerWin, ...prev.slice(0, 34)]);
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
              Получить 500 000 R {canClaimClickReward ? '✅' : '🔒'}
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
                onClick={() => window.open('https://filelu.com/87w2jnbpbfls', '_blank')}
                className="bg-robux-purple hover:bg-robux-purple/80 text-white font-bold py-4 px-10 rounded-xl text-xl"
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
            <h3 className="text-xl font-bold mb-4">🔥 Недавние выигрыши</h3>
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

          {/* Live Chat */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">💬 Чат игроков</h3>
            <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className="flex items-start space-x-3 animate-fade-in">
                  <span className="text-lg">{msg.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-robux-blue">{msg.name}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Написать сообщение..." 
                className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && chatMessage.trim()) {
                    setChatMessages(prev => [{
                      name: 'Вы',
                      avatar: '🎮',
                      message: chatMessage,
                      time: 'сейчас'
                    }, ...prev.slice(0, 4)]);
                    setChatMessage('');
                  }
                }}
              />
              <Button 
                size="sm" 
                className="bg-robux-blue"
                onClick={() => {
                  if (chatMessage.trim()) {
                    setChatMessages(prev => [{
                      name: 'Вы',
                      avatar: '🎮',
                      message: chatMessage,
                      time: 'сейчас'
                    }, ...prev.slice(0, 4)]);
                    setChatMessage('');
                  }
                }}
              >
                Отправить
              </Button>
            </div>
          </Card>
        </div>

        {/* Leaderboard and Support Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
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

          {/* Support */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">🛡️ Служба поддержки</h3>
            <div className="space-y-4">
              <div className="bg-secondary p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-robux-green flex items-center justify-center">
                    <span className="text-sm font-bold text-background">S</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Техподдержка</div>
                    <div className="text-xs text-muted-foreground">Онлайн</div>
                  </div>
                </div>
                <p className="text-sm text-foreground">
                  Привет! У нас есть проблемы? Мы поможем вам получить ваши Robux! 
                  Средний ответ: 2 минуты ⚡
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => setSupportOpen(true)}
                  className="w-full bg-robux-green hover:bg-robux-green/80"
                >
                  🎧 Связаться с поддержкой
                </Button>
                <Button 
                  onClick={() => window.open('https://t.me/zarabotay_depin', '_blank')}
                  className="w-full bg-robux-blue hover:bg-robux-blue/80"
                >
                  📞 Telegram поддержка
                </Button>
              </div>

              <div className="text-center space-y-2">
                <div className="text-sm font-semibold text-robux-gold">FAQ</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Не получаю Robux? Проверьте подписку!</div>
                  <div>• Промо-код не работает? Попробуйте позже!</div>
                  <div>• Автокликер безопасен? Да, 100%!</div>
                  <div>• Блокируют аккаунт? Мы гарантируем безопасность!</div>
                  <div>• Сколько можно заработать? До 50к Robux в день!</div>
                  <div>• Работает ли на телефоне? Да, полная поддержка!</div>
                  <div>• Нужна ли подписка? Только на YouTube канал!</div>
                  <div>• Можно ли проиграть аккаунт? Нет, это невозможно!</div>
                  <div>• Безопасны ли мои данные? Абсолютно!</div>
                  <div>• Могу ли я потерять аккаунт Roblox? Никогда!</div>
                  <div>• Требуется ли пароль от аккаунта? Нет!</div>
                  <div>• Работает ли антивирус с автокликером? Да!</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Special Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Без лимитов</h3>
            <p className="text-sm text-muted-foreground">Получайте Robux без ограничений времени!</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">Мгновенно</h3>
            <p className="text-sm text-muted-foreground">Robux поступают на ваш аккаунт моментально!</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-bold text-lg mb-2">Безопасно</h3>
            <p className="text-sm text-muted-foreground">100% безопасно для вашего Roblox аккаунта!</p>
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
                <p className="text-muted-foreground">За каждого друга получи 1500 Robux!</p>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm mb-2">Твоя реферальная ссылка:</p>
                  <div className="bg-background p-2 rounded border font-mono text-robux-blue text-xs break-all">
                    {`${window.location.origin}?ref=${referralCode}`}
                  </div>
                </div>
                <Button 
                  className="bg-robux-blue hover:bg-robux-blue/80"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}?ref=${referralCode}`);
                    toast({ title: "Ссылка скопирована! 📋" });
                  }}
                >
                  Скопировать ссылку
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Support Modal */}
      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">🛡️ Служба поддержки</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="text-lg font-semibold text-robux-green">Как мы можем помочь?</div>
            <div className="space-y-3 text-left">
              <div className="bg-secondary p-3 rounded-lg">
                <div className="font-semibold text-sm">❓ Не получаю Robux</div>
                <p className="text-xs text-muted-foreground mt-1">Убедитесь, что подписались на канал и активировали уведомления</p>
              </div>
              <div className="bg-secondary p-3 rounded-lg">
                <div className="font-semibold text-sm">🎟️ Промо-код не работает</div>
                <p className="text-xs text-muted-foreground mt-1">Попробуйте ввести код заново или обратитесь в поддержку</p>
              </div>
              <div className="bg-secondary p-3 rounded-lg">
                <div className="font-semibold text-sm">📱 Проблемы с автокликером</div>
                <p className="text-xs text-muted-foreground mt-1">Скачайте последнюю версию и отключите антивирус</p>
              </div>
            </div>
            <Button 
              onClick={() => window.open('https://t.me/zarabotay_depin', '_blank')}
              className="w-full bg-robux-blue hover:bg-robux-blue/80"
            >
              📞 Написать в Telegram
            </Button>
          </div>
          <Button onClick={() => setSupportOpen(false)} className="w-full">
            Закрыть
          </Button>
        </DialogContent>
      </Dialog>

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