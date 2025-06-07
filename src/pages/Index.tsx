import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Timer } from 'lucide-react';

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
    { name: 'RobloxGamer2024', avatar: '🎮', robux: 50, time: 'сейчас', isRealPlayer: false },
    { name: 'ProBuilder777', avatar: '🏗️', robux: 100, time: '2 сек назад', isRealPlayer: false },
    { name: 'NoobSlayer99', avatar: '⚔️', robux: 75, time: '5 сек назад', isRealPlayer: false },
    { name: 'BlockMaster', avatar: '🧱', robux: 25, time: '8 сек назад', isRealPlayer: false },
    { name: 'MegaBuilder2k', avatar: '🚀', robux: 150, time: '12 сек назад', isRealPlayer: false },
    { name: 'CoolDude123', avatar: '😎', robux: 80, time: '15 сек назад', isRealPlayer: false },
    { name: 'RobuxHunter', avatar: '🎯', robux: 65, time: '18 сек назад', isRealPlayer: false },
    { name: 'BlockChamp', avatar: '🏆', robux: 95, time: '21 сек назад', isRealPlayer: false },
    { name: 'GamerPro2024', avatar: '⭐', robux: 110, time: '24 сек назад', isRealPlayer: false },
    { name: 'RobloxKing', avatar: '👑', robux: 130, time: '27 сек назад', isRealPlayer: false },
    { name: 'BuilderBoss', avatar: '🔨', robux: 45, time: '30 сек назад', isRealPlayer: false },
    { name: 'SpeedRunner', avatar: '⚡', robux: 85, time: '33 сек назад', isRealPlayer: false },
    { name: 'CraftMaster', avatar: '🛠️', robux: 70, time: '36 сек назад', isRealPlayer: false },
    { name: 'RobuxLord', avatar: '💎', robux: 120, time: '39 сек назад', isRealPlayer: false },
    { name: 'GameWiz', avatar: '🧙', robux: 55, time: '42 сек назад', isRealPlayer: false },
    { name: 'BlockNinja', avatar: '🥷', robux: 90, time: '45 сек назад', isRealPlayer: false },
    { name: 'ProGamer99', avatar: '🎲', robux: 105, time: '48 сек назад', isRealPlayer: false },
    { name: 'RobloxStar', avatar: '🌟', robux: 35, time: '51 сек назад', isRealPlayer: false },
    { name: 'BuildKing', avatar: '🏰', robux: 115, time: '54 сек назад', isRealPlayer: false },
    { name: 'GameMaster', avatar: '🎖️', robux: 60, time: '57 сек назад', isRealPlayer: false },
    { name: 'RobuxHero', avatar: '🦸', robux: 125, time: '1 мин назад', isRealPlayer: false },
    { name: 'BlockExpert', avatar: '🔥', robux: 40, time: '1 мин назад', isRealPlayer: false },
    { name: 'ProBuilder', avatar: '🏗️', robux: 95, time: '1 мин назад', isRealPlayer: false },
    { name: 'RobloxFan', avatar: '❤️', robux: 75, time: '1 мин назад', isRealPlayer: false },
    { name: 'GameChamp', avatar: '🏅', robux: 135, time: '1 мин назад', isRealPlayer: false },
    { name: 'BlockWizard', avatar: '🪄', robux: 50, time: '1 мин назад', isRealPlayer: false },
    { name: 'RobuxSeeker', avatar: '🔍', robux: 80, time: '1 мин назад', isRealPlayer: false },
    { name: 'BuilderPro', avatar: '⚒️', robux: 100, time: '1 мин назад', isRealPlayer: false },
    { name: 'GameGuru', avatar: '🧠', robux: 65, time: '1 мин назад', isRealPlayer: false },
    { name: 'RobloxAce', avatar: '🃏', robux: 110, time: '1 мин назад', isRealPlayer: false },
    { name: 'BlockSage', avatar: '👴', robux: 85, time: '1 мин назад', isRealPlayer: false },
    { name: 'ProGamer', avatar: '🎮', robux: 70, time: '1 мин назад', isRealPlayer: false },
    { name: 'RobuxMiner', avatar: '⛏️', robux: 90, time: '1 мин назад', isRealPlayer: false },
    { name: 'BuildGenius', avatar: '🤓', robux: 55, time: '1 мин назад', isRealPlayer: false },
    { name: 'GameLegend', avatar: '🌟', robux: 140, time: '1 мин назад', isRealPlayer: false }
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
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [lotteryModalOpen, setLotteryModalOpen] = useState(false);
  const [lotteryTimeLeft, setLotteryTimeLeft] = useState(86400); // 24 часа в секундах

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

  // Lottery timer effect
  useEffect(() => {
    if (lotteryTimeLeft > 0) {
      const timer = setTimeout(() => setLotteryTimeLeft(lotteryTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setLotteryTimeLeft(86400); // Сброс на 24 часа
    }
  }, [lotteryTimeLeft]);

  // Auto-update players
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(prev => {
        const newPlayers = [...prev];
        const randomIndex = Math.floor(Math.random() * newPlayers.length);
        newPlayers[randomIndex] = {
          ...newPlayers[randomIndex],
          robux: Math.floor(Math.random() * 200) + 25,
          time: 'сейчас',
          isRealPlayer: false
        };
        return newPlayers.map((player, index) => 
          index === randomIndex ? player : { ...player, time: updateTime(player.time) }
        );
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-update chat - ПОЛНОСТЬЮ НОВЫЙ СКРИПТ
  useEffect(() => {
    let chatTimer;
    
    const updateChatMessages = () => {
      const messages = [
        'Этот сайт реально работает! Уже 5к робуксов!',
        'Автокликер очень эффективный!',
        'Промо-код сработал! 1000 робуксов!',
        'Круто! Подписался и сразу робуксы!',
        'Ребята, сайт рабочий!',
        'Автокликер огонь, советую!',
        'Как же я раньше без этого жил?!',
        'Друзья, рефералка дает хороший бонус!',
        'МЕГА выигрыш 1000 робуксов! Невероятно!',
        'Каждый день захожу, надо робуксы!',
        'Реально работает, не обман!',
        'Кто знает секреты фарма робуксов?',
        'Подписался на канал - робуксы потекли рекой!',
        'Этот фаучет лучше всех!',
        'Друзья, используйте рефералку обязательно!',
        'Только что выиграл промо-код! Спасибо!',
        'Автокликер реально работает, всем советую!',
        'Ребята, этот сайт топовый! Уже куча робуксов!',
        'Как быстро робуксы капают с автокликером!',
        'Отлично сделан сайт, все честно работает!',
        'Лучший сайт из всех!',
        'Сколько я уже тут робуксов заработал!',
        'Проверяйте ежедневный бонус, не забывайте!',
        'Отличная реферальная программа, всех приглашаю!',
        'Как же я кайфую от этих робуксов!',
        'Зачем работать, когда есть этот сайт?',
        'Пацаны, кто еще не скачал автокликер - качайте!',
        'Роблокс теперь играется намного интереснее!',
        'Всем рекомендую, лучший фаучет робуксов!',
        'Заработал больше робуксов чем за месяц игры!',
        'Как быстро робуксы приходят!',
        'Автокликер работает даже когда сплю!',
        'Друзья завидуют моим робуксам теперь!',
        'Почему я раньше не знал про этот сайт?',
        'Роблокс стал еще веселее с бесплатными робуксами!',
        'Получил уже 3000 робуксов за день!',
        'VIP статус того стоит!',
        'Каждый час новые розыгрыши!',
        'Безопасный сайт, аккаунт не блокируют!',
        'Лучший способ получить робуксы!'
      ];
      
      const usernames = [
        'ProGamer2024', 'RobloxMaster', 'GameKing777', 'NoobDestroyer',
        'MegaPlayer', 'RobuxFarmer', 'GameLegend', 'ProBuilder2025',
        'SuperGamer', 'RobuxKing', 'GameHero', 'MasterBuilder',
        'RobloxPro', 'GameChamp', 'RobuxHunter', 'BlockMaster'
      ];
      
      const avatars = ['🎮', '⚔️', '🏗️', '🚀', '😎', '🎯', '🏆', '⭐', '👑', '🔨', '⚡', '🛠️', '💎', '🧙', '🥷', '🎲'];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      
      const newMessage = {
        name: randomUsername,
        avatar: randomAvatar,
        message: randomMessage,
        time: 'сейчас'
      };
      
      setChatMessages(prev => {
        const updated = [newMessage, ...prev.slice(0, 4)];
        return updated.map((msg, index) => {
          if (index === 0) return msg;
          let newTime = msg.time;
          if (msg.time === 'сейчас') newTime = '1 мин назад';
          else if (msg.time === '1 мин назад') newTime = '2 мин назад';
          else if (msg.time === '2 мин назад') newTime = '3 мин назад';
          else if (msg.time === '3 мин назад') newTime = '4 мин назад';
          else if (msg.time === '4 мин назад') newTime = '5 мин назад';
          return { ...msg, time: newTime };
        });
      });
    };
    
    const startChatTimer = () => {
      const randomDelay = Math.floor(Math.random() * 2000) + 2000; // 2-4 секунды
      chatTimer = setTimeout(() => {
        updateChatMessages();
        startChatTimer();
      }, randomDelay);
    };
    
    startChatTimer();
    
    return () => {
      if (chatTimer) clearTimeout(chatTimer);
    };
  }, []);

  // Update main progress to match totalRobux
  useEffect(() => {
    setMainProgress(totalRobux);
  }, [totalRobux]);

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

    // Убрали добавление выигрышей реального игрока

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

  const formatLotteryTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Получаю бесплатные Robux на этом сайте! Присоединяйтесь!');
    
    const shareUrls = {
      vk: `https://vk.com/share.php?url=${url}&title=${text}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const canClaimMainReward = mainProgress >= 10000;
  const canClaimClickReward = clickProgress >= 1000;

  return (
    <div className="min-h-screen bg-background text-foreground p-2 md:p-4">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        
        {/* Header with Share Buttons */}
        <Card className="p-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-robux-blue">🎮 FREE ROBUX GENERATOR</h1>
              <p className="text-sm text-muted-foreground">Получай робуксы каждый день бесплатно!</p>
            </div>
            <div className="social-card p-3">
              <span className="text-sm font-semibold mb-2 block text-center">📱 Поделиться:</span>
              <div className="grid grid-cols-4 gap-1">
                <Button size="sm" onClick={() => shareToSocial('vk')} className="bg-blue-600 hover:bg-blue-700 text-xs animate-pulse">
                  VK
                </Button>
                <Button size="sm" onClick={() => shareToSocial('telegram')} className="bg-blue-500 hover:bg-blue-600 text-xs animate-bounce">
                  TG
                </Button>
                <Button size="sm" onClick={() => shareToSocial('whatsapp')} className="bg-green-600 hover:bg-green-700 text-xs animate-pulse">
                  WA
                </Button>
                <Button size="sm" onClick={() => shareToSocial('twitter')} className="bg-gray-800 hover:bg-gray-900 text-xs animate-bounce">
                  TW
                </Button>
                <Button size="sm" onClick={() => window.open('https://www.youtube.com/', '_blank')} className="bg-red-600 hover:bg-red-700 text-xs animate-pulse">
                  YT
                </Button>
                <Button size="sm" onClick={() => window.open('https://discord.com/', '_blank')} className="bg-purple-600 hover:bg-purple-700 text-xs animate-bounce">
                  DS
                </Button>
                <Button size="sm" onClick={() => window.open('https://www.tiktok.com/', '_blank')} className="bg-pink-600 hover:bg-pink-700 text-xs animate-pulse">
                  TT
                </Button>
                <Button size="sm" onClick={() => window.open('https://www.reddit.com/', '_blank')} className="bg-orange-600 hover:bg-orange-700 text-xs animate-bounce">
                  RD
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Analytics Header */}
        <div className="stats-card pulse-glow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="text-center bounce-slow">
              <div className="text-lg font-bold text-robux-green">{analytics.visitors.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Посетителей сегодня</div>
            </div>
            <div className="text-center rotate-slow">
              <div className="text-lg font-bold text-robux-gold">{analytics.robuxClaimed.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Robux роздано</div>
            </div>
            <div className="text-center bounce-slow">
              <div className="text-lg font-bold text-robux-blue">{analytics.activeUsers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Онлайн сейчас</div>
            </div>
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="game-card">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold">Главный прогресс</h2>
              <span className="text-robux-green font-bold text-sm">{totalRobux}/1000</span>
            </div>
            <Progress value={(totalRobux / 1000) * 100} className="h-3" />
            <Button 
              className={`w-full text-sm ${canClaimMainReward ? 'bg-robux-green hover:bg-robux-green/80' : ''}`}
              disabled={!canClaimMainReward}
              onClick={() => window.open('https://www.youtube.com/@madnessgames_?sub_confirmation=1', '_blank')}
            >
              Забрать Robux! {canClaimMainReward ? '✅' : '🔒'}
            </Button>
          </div>
        </div>

        {/* Click Progress Bar */}
        <div className="game-card">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold">Прогресс кликов</h2>
              <span className="text-robux-purple font-bold text-sm">{clickProgress}/1000</span>
            </div>
            <Progress value={(clickProgress / 1000) * 100} className="h-3" />
            <Button 
              className={`w-full text-sm ${canClaimClickReward ? 'bg-robux-purple hover:bg-robux-purple/80' : ''}`}
              disabled={!canClaimClickReward}
              onClick={() => window.open('https://t.me/zarabotay_depin', '_blank')}
            >
              Получить 500 000 R {canClaimClickReward ? '✅' : '🔒'}
            </Button>
          </div>
        </div>

        {/* Main Claim Section */}
        <Card className="p-4 md:p-8 text-center">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-4xl font-bold text-robux-green">💎 CLAIM ROBUX</h2>
              <p className="text-robux-gold font-bold text-lg md:text-xl">Собрано: {totalRobux} Robux</p>
              <Progress value={(totalRobux / 10000) * 100} className="h-2 md:h-3" />
              <p className="text-xs md:text-sm text-muted-foreground">До 10000 Robux: {10000 - totalRobux}</p>
            </div>

            {!isSubscribed && (
              <Button 
                onClick={handleSubscribe}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 md:px-8 rounded-xl text-base md:text-lg w-full md:w-auto"
              >
                🔔 Подписаться на канал
              </Button>
            )}

            <Button 
              onClick={handleClaim}
              disabled={!isSubscribed || timeLeft > 0}
              className="claim-button text-lg md:text-2xl py-4 md:py-6 px-8 md:px-12 w-full md:w-auto"
            >
              {timeLeft > 0 ? `ЖДИТЕ ${formatTime(timeLeft)}` : 'CLAIM ROBUX! 💎'}
            </Button>

            {timeLeft > 0 && (
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-robux-blue">{formatTime(timeLeft)}</div>
                <div className="text-xs md:text-sm text-muted-foreground">до следующего получения</div>
              </div>
            )}

            <div className="space-y-4">
              <Button 
                onClick={() => window.open('https://filelu.com/87w2jnbpbfls', '_blank')}
                className="bg-robux-purple hover:bg-robux-purple/80 text-white font-bold py-4 md:py-6 px-8 md:px-12 rounded-xl text-lg md:text-2xl w-full md:w-auto"
              >
                📱 Скачать Автокликер PRO
              </Button>
              <p className="text-xs md:text-sm text-muted-foreground">
                Автоматизируй получение робуксов 24/7
              </p>
            </div>
          </div>
        </Card>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* Live Chat */}
          <Card className="p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-4">💬 Чат игроков</h3>
            <div className="max-h-64 md:max-h-80 overflow-y-auto space-y-2 md:space-y-3 mb-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className="flex items-start space-x-2 md:space-x-3 animate-fade-in">
                  <span className="text-base md:text-lg">{msg.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs md:text-sm text-robux-blue">{msg.name}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-xs md:text-sm text-foreground mt-1">{msg.message}</p>
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
                className="flex-1 px-2 md:px-3 py-2 bg-input border border-border rounded-lg text-xs md:text-sm"
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
                className="bg-robux-blue text-xs md:text-sm"
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
                📤
              </Button>
            </div>
          </Card>

          {/* Recent Activity - All 35 Players */}
          <Card className="p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-4">🔥 Недавние выигрыши</h3>
            <div className="max-h-64 md:max-h-80 overflow-y-auto space-y-1 md:space-y-2">
              {players.map((player, index) => (
                <div key={index} className="player-card flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <span className="text-base md:text-lg">{player.avatar}</span>
                    <div>
                      <div className="font-semibold text-xs md:text-sm">{player.name}</div>
                      <div className="text-xs text-muted-foreground">{player.time}</div>
                    </div>
                  </div>
                  <Badge className="bg-robux-gold text-black text-xs">+{player.robux} R$</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Leaderboard */}
          <Card className="p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-4">🏆 Топ игроков</h3>
            <div className="space-y-2 md:space-y-3">
              {leaderboard.map((player) => (
                <div key={player.rank} className="player-card flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-robux-blue flex items-center justify-center text-white font-bold text-xs">
                      {player.rank}
                    </div>
                    <span className="text-base md:text-xl">{player.avatar}</span>
                    <div>
                      <div className="font-semibold text-xs md:text-sm">{player.name}</div>
                    </div>
                  </div>
                  <Badge className="bg-robux-gold text-black text-xs">{player.robux.toLocaleString()} R$</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Support Section */}
        <Card className="p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold mb-4">🛡️ Служба поддержки</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="bg-secondary p-3 md:p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-robux-green flex items-center justify-center">
                    <span className="text-xs md:text-sm font-bold text-background">S</span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs md:text-sm">Техподдержка</div>
                    <div className="text-xs text-muted-foreground">Онлайн</div>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-foreground">
                  Привет! У нас есть проблемы? Мы поможем вам получить ваши Robux! 
                  Средний ответ: 2 минуты ⚡
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => setSupportOpen(true)}
                  className="w-full bg-robux-green hover:bg-robux-green/80 text-xs md:text-sm"
                >
                  🎧 Связаться с поддержкой
                </Button>
                <Button 
                  onClick={() => window.open('https://t.me/zarabotay_depin', '_blank')}
                  className="w-full bg-robux-blue hover:bg-robux-blue/80 text-xs md:text-sm"
                >
                  📞 Telegram поддержка
                </Button>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-sm font-semibold text-robux-gold">FAQ - Безопасность</div>
              <div className="text-xs text-yellow-500 space-y-1 text-left">
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
                <div>• Можно ли получить бан в Roblox? Нет, мы не нарушаем правила!</div>
                <div>• Защищен ли мой IP адрес? Да, полная анонимность!</div>
                <div>• Может ли Roblox заблокировать мой аккаунт? Нет!</div>
                <div>• Сохраняем ли мы ваши пароли? Никогда не спрашиваем пароли!</div>
                <div>• Могут ли хакеры получить доступ? Нет, 256-битное шифрование!</div>
                <div>• Безопасен ли автокликер для Windows? Да, проверен антивирусом!</div>
                <div>• Можно ли использовать на разных устройствах? Да, полная совместимость!</div>
                <div>• Сохраняется ли прогресс при смене устройства? Да, в облаке!</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Special Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold text-base mb-1">Без лимитов</h3>
            <p className="text-xs text-muted-foreground">Получайте Robux без ограничений времени!</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-bold text-base mb-1">Мгновенно</h3>
            <p className="text-xs text-muted-foreground">Robux поступают на ваш аккаунт моментально!</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-bold text-base mb-1">Безопасно</h3>
            <p className="text-xs text-muted-foreground">100% безопасно для вашего Roblox аккаунта!</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl mb-2">🎮</div>
            <h3 className="font-bold text-base mb-1">Для всех</h3>
            <p className="text-xs text-muted-foreground">Работает на всех устройствах и браузерах!</p>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-robux-gold">🚀 VIP Статус</h3>
            <div className="space-y-3">
              <p className="text-xs md:text-sm text-muted-foreground">Получите VIP статус и удвойте свои выигрыши!</p>
              <div className="bg-gradient-to-r from-robux-gold/20 to-robux-purple/20 p-3 rounded-lg">
                <div className="text-xs md:text-sm font-semibold">VIP Преимущества:</div>
                <div className="text-xs text-muted-foreground mt-1">
                  • Удвоенные выигрыши<br/>
                  • Эксклюзивные промо-коды<br/>
                  • Приоритетная поддержка<br/>
                  • Специальные бонусы
                </div>
              </div>
              <Button 
                onClick={() => setVipModalOpen(true)}
                className="w-full bg-robux-gold hover:bg-robux-gold/80 text-black text-xs md:text-sm"
              >
                Получить VIP за 1000 R$
              </Button>
            </div>
          </Card>
          
          <Card className="p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-robux-blue">🎁 Ежедневные розыгрыши</h3>
            <div className="space-y-3">
              <p className="text-xs md:text-sm text-muted-foreground">Участвуйте в розыгрышах каждый день!</p>
              <div className="bg-gradient-to-r from-robux-blue/20 to-robux-green/20 p-3 rounded-lg">
                <div className="text-xs md:text-sm font-semibold">Следующий розыгрыш:</div>
                <div className="text-base md:text-lg font-bold text-robux-blue">25,000 Robux</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  Осталось: {formatLotteryTime(lotteryTimeLeft)}
                </div>
              </div>
              <Button 
                onClick={() => setLotteryModalOpen(true)}
                className="w-full bg-robux-blue hover:bg-robux-blue/80 text-xs md:text-sm"
              >
                Участвовать бесплатно
              </Button>
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
                <h3 className="text-lg md:text-xl font-bold">Приглашай друзей</h3>
                <p className="text-xs md:text-sm text-muted-foreground">За каждого друга получи 1500 Robux!</p>
                <div className="bg-secondary p-3 md:p-4 rounded-lg">
                  <p className="text-xs md:text-sm mb-2">Твоя реферальная ссылка:</p>
                  <div className="bg-background p-2 rounded border font-mono text-robux-blue text-xs break-all">
                    https://robux-generator.pro/?ref={referralCode}
                  </div>
                </div>
                <Button 
                  className="bg-robux-blue hover:bg-robux-blue/80 text-xs md:text-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://robux-generator.pro/?ref=${referralCode}`);
                    toast({ title: "Ссылка скопирована! 📋" });
                  }}
                >
                  Скопировать ссылку
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <Card className="p-4 md:p-6 bg-secondary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <h4 className="font-bold text-robux-blue mb-2">🏢 Наша компания</h4>
              <div className="text-xs space-y-1">
                <p>RobuxGen Solutions Ltd.</p>
                <p>📍 Москва, ул. Геймерская 42</p>
                <p>📧 support@robuxgen.ru</p>
                <p>📞 +7 (495) 123-45-67</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-robux-green mb-2">👨‍💻 Разработчики</h4>
              <div className="text-xs space-y-1">
                <p>Алексей Петров - CEO</p>
                <p>📞 +7 (926) 555-01-23</p>
                <p>Мария Сидорова - CTO</p>
                <p>📞 +7 (916) 555-45-67</p>
                <p>Игорь Козлов - Lead Dev</p>
                <p>📞 +7 (903) 555-89-01</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-robux-gold mb-2">⚖️ Юридическая информация</h4>
              <div className="text-xs space-y-1">
                <p>ИНН: 7701234567</p>
                <p>ОГРН: 1157746123456</p>
                <p>КПП: 770101001</p>
                <p>📞 Юрист: +7 (495) 987-65-43</p>
                <p>© 2024 RobuxGen. Все права защищены.</p>
              </div>
            </div>
          </div>
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

      {/* VIP Modal */}
      <Dialog open={vipModalOpen} onOpenChange={setVipModalOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">🚀 VIP Статус</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="text-6xl mb-4">👑</div>
            <div className="text-lg font-bold text-robux-gold mb-4">
              Заходи ежедневно в течении 7 дней и получи VIP статус бесплатно!
            </div>
            <p className="text-sm text-muted-foreground">
              Или купи VIP прямо сейчас за 1000 Robux и получи все преимущества немедленно!
            </p>
          </div>
          <Button onClick={() => setVipModalOpen(false)} className="w-full">
            Понятно
          </Button>
        </DialogContent>
      </Dialog>

      {/* Lottery Modal */}
      <Dialog open={lotteryModalOpen} onOpenChange={setLotteryModalOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">🎁 Ежедневный розыгрыш</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="text-6xl mb-4">🏆</div>
            <div className="text-lg font-bold text-robux-blue mb-4">
              Вы успешно участвуете в розыгрыше 25,000 Robux!
            </div>
            <p className="text-sm text-muted-foreground">
              Результаты будут объявлены через: {formatLotteryTime(lotteryTimeLeft)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Увеличьте свои шансы, пригласив друзей!
            </p>
          </div>
          <Button onClick={() => setLotteryModalOpen(false)} className="w-full">
            Отлично!
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