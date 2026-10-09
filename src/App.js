import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'https://showtime-backend-gamma.vercel.app';
const socket = io(SOCKET_URL);

const TRANSLATIONS = {
  ar: {
    title: 'SHOWTIME LIVE',
    subtitle: 'المنصة العربية الأولى للألعاب الجماعية وسهرات الأصدقاء',
    enterName: 'أدخل اسمك في اللعبة',
    selectGame: 'اختر نوع اللعبة (10 ألعاب متوفرة)',
    wordPack: 'حزمة الكلمات واللغة (المالك فقط)',
    createRoom: 'إنشاء غرفة جديدة 🚀',
    joinRoom: 'انضمام لغرفة صديق',
    roomCode: 'رمز الغرفة (مثال: A1B2C)',
    startGame: 'ابدأ اللعبة للجميع 🎮',
    mainMenu: 'العودة للقائمة الرئيسية 🏠',
    newRound: 'جولة جديدة 🔄',
    passBomb: '💣 تمرير القنبلة بسرعة!',
    sendSecret: 'إرسال السر المجهول 🔒',
    pressBuzzer: '⚡ اخطف السؤال الآن!',
    sendAnswer: 'إرسال الإجابة ➔',
    voteBtn: 'صوّت ضد هذا اللاعب 🗳️',
    voted: 'تم تسجيل تصويتك ✅',
    spectator: '👀 أنت الآن مشاهد (تم طردك)',
    joinTeam: 'انضمام لهذا الدور',
    redOperatives: 'OPERATIVES (الميدانيين - أحمر)',
    redSpymasters: 'SPYMASTERS (رئيس التجسس - أحمر)',
    blueOperatives: 'OPERATIVES (الميدانيين - أزرق)',
    blueSpymasters: 'SPYMASTERS (رئيس التجسس - أزرق)',
    turnNotice: 'الدور الحالي لـ:'
  },
  en: {
    title: 'SHOWTIME LIVE',
    subtitle: 'The Ultimate Multiplayer Party Game Platform',
    enterName: 'Your Nickname',
    selectGame: 'Select Game Mode (10 Games Available)',
    wordPack: 'Word Pack & Language (Host Only)',
    createRoom: 'Create Room 🚀',
    joinRoom: 'Join Room',
    roomCode: 'Room Code (e.g. A1B2C)',
    startGame: 'Start Game for All 🎮',
    mainMenu: 'Main Menu 🏠',
    newRound: 'New Round 🔄',
    passBomb: '💣 PASS THE BOMB FAST!',
    sendSecret: 'Submit Secret 🔒',
    pressBuzzer: '⚡ GRAB THE QUESTION!',
    sendAnswer: 'Submit Answer ➔',
    voteBtn: 'Vote Against Player 🗳️',
    voted: 'Vote Recorded ✅',
    spectator: '👀 You are Spectating',
    joinTeam: 'JOIN ROLE',
    redOperatives: 'OPERATIVES (RED)',
    redSpymasters: 'SPYMASTERS (RED)',
    blueOperatives: 'OPERATIVES (BLUE)',
    blueSpymasters: 'SPYMASTERS (BLUE)',
    turnNotice: 'Current Turn:'
  }
};

const GAMES_LIST = [
  { id: 'codenames', name: { ar: 'كود نيمز (الأسماء المشفرة)', en: 'Codenames 2.0' }, icon: '🕵️‍♀️', players: '4-10', desc: { ar: 'تحدي الفرق والتلميحات (25 كلمة)', en: '25 Words Team Battle' } },
  { id: 'out_of_topic', name: { ar: 'برا السالفة', en: 'Out of Topic' }, icon: '🕵️‍♂️', players: '3-10', desc: { ar: 'تصويت فردي، عداد 60 ثانية، و3 محاولات', en: 'Individual Voting, 60s Timer & 3 Attempts' } },
  { id: 'khatfa', name: { ar: 'خطفة', en: 'Khatfa (Quick Quiz)' }, icon: '⚡', players: '2-10', desc: { ar: 'زر خطف سريع، عداد 30 ثانية ونقاط تلقائية', en: 'Fast Buzzer, 30s Timer & Auto Scoring' } },
  { id: 'who_am_i', name: { ar: 'من أنا؟', en: 'Who Am I?' }, icon: '🎭', players: '3-10', desc: { ar: 'حكم عشوائي، إجابة مخفية، وعداد 30s', en: 'Random Judge, Hidden Answer & 30s Timer' } },
  { id: 'hot_seat', name: { ar: 'الكرسي الساخن', en: 'Hot Seat' }, icon: '🧠', players: '2-10', desc: { ar: 'لاعب عشوائي وتصويت الصدق والكذب', en: 'Random Seat & Truth Voting' } },
  { id: 'pass_bomb', name: { ar: 'القنبلة الموقوتة', en: 'Pass The Bomb' }, icon: '💣', players: '3-10', desc: { ar: 'عداد سري وتمرير القنبلة قبل الانفجار', en: 'Random Timer & Bomb Passing' } },
  { id: 'truth_secrets', name: { ar: 'سرّك في بئر', en: 'Truth & Secrets' }, icon: '🤫', players: '3-10', desc: { ar: 'صندوق أسرار مجهول وتخمين أصحابها', en: 'Anonymous Secrets & Guessing' } },
  { id: 'password_challenge', name: { ar: 'كلمة السر والترادف', en: 'Password Challenge' }, icon: '🧱', players: '4-10', desc: { ar: 'إخفاء الكلمة وإعطاء التلميحات', en: 'Hidden Words & Hints' } },
  { id: 'photo_challenge', name: { ar: 'تحدي المواقف', en: 'Challenge Mode' }, icon: '📸', players: '2-10', desc: { ar: 'تحديات تمثيل ووصف فكاهية', en: 'Act & Describe Quests' } },
  { id: 'movies_songs', name: { ar: 'الأفلام والأغاني', en: 'Movies & Songs' }, icon: '🎬', players: '3-10', desc: { ar: 'تمثيل وتخمين المشاهد السينمائية', en: 'Act & Guess Movie Scenes' } }
];

export default function App() {
  const [lang, setLang] = useState('ar');
  const [wordLang, setWordLang] = useState('ar');
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [selectedGame, setSelectedGame] = useState('codenames');
  
  // حالات الألعاب المتنوعة
  const [phase, setPhase] = useState('LOBBY');
  const [timeLeft, setTimeLeft] = useState(60);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [hasVoted, setHasVoted] = useState(false);
  const [gameOverResult, setGameOverResult] = useState(null);
  const [roundNotice, setRoundNotice] = useState('');
  
  // كود نيمز
  const [board, setBoard] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('RED');
  const [logs, setLogs] = useState([]);
  const [clueInput, setClueInput] = useState('');
  const [clueCount, setClueCount] = useState('1');
  const [currentClue, setCurrentClue] = useState(null);

  // الألعاب الأخرى
  const [bombHolderId, setBombHolderId] = useState(null);
  const [bombExplodedMsg, setBombExplodedMsg] = useState(null);
  const [secretText, setSecretText] = useState('');
  const [revealedSecrets, setRevealedSecrets] = useState(null);
  const [buzzedPlayer, setBuzzedPlayer] = useState(null);
  const [answerInput, setAnswerInput] = useState('');
  const [scores, setScores] = useState({ RED: 0, BLUE: 0 });
  const [revealedAnswer, setRevealedAnswer] = useState(null);
  const [khatfaMessage, setKhatfaMessage] = useState(null);
  const [error, setError] = useState('');

  // نافذة الاقتراحات
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    socket.on('roomCreated', (room) => { setCurrentRoom(room); setPlayers(room.players); });
    socket.on('joinedSuccess', (room) => { setCurrentRoom(room); setPlayers(room.players); });
    socket.on('updatePlayers', (updated) => setPlayers(updated));

    socket.on('gameStarted', (data) => {
      setGameData(data);
      setPhase('DISCUSSING');
      setTimeLeft(60);
      setAttemptsLeft(data.attemptsLeft || 3);
      setHasVoted(false);
      setGameOverResult(null);
      setRoundNotice('');
      setBombExplodedMsg(null);
      setRevealedSecrets(null);
      setBuzzedPlayer(null);
      setKhatfaMessage(null);
      setRevealedAnswer(null);

      if (data.board) setBoard(data.board);
      if (data.currentTurn) setCurrentTurn(data.currentTurn);
      if (data.logs) setLogs(data.logs);
      if (data.currentBombHolderId) setBombHolderId(data.currentBombHolderId);
      if (data.scores) setScores(data.scores);
    });

    socket.on('timerUpdate', (time) => setTimeLeft(time));
    socket.on('phaseChanged', (data) => {
      setPhase(data.phase);
      if (data.phase === 'VOTING') setHasVoted(false);
    });

    socket.on('roundResult', (data) => {
      setAttemptsLeft(data.attemptsLeft);
      setRoundNotice(`⚠️ تم طرد (${data.eliminatedName}) وكان مظلوماً! المتبقي: ${data.attemptsLeft} محاولات`);
      setTimeout(() => setRoundNotice(''), 4000);
    });

    socket.on('gameOver', (data) => {
      setPhase('ENDED');
      setGameOverResult(data);
    });

    socket.on('boardUpdated', (data) => {
      setBoard(data.board);
      setCurrentTurn(data.currentTurn);
      setLogs(data.logs);
    });

    socket.on('clueSent', (data) => {
      setCurrentClue(data.clue);
      setLogs(data.logs);
    });

    socket.on('bombPassed', (data) => setBombHolderId(data.currentBombHolderId));
    socket.on('bombExploded', (data) => setBombExplodedMsg(data.message));
    socket.on('secretsRevealed', (data) => setRevealedSecrets(data.secrets));
    socket.on('playerBuzzed', (data) => setBuzzedPlayer(data));
    socket.on('khatfaResult', (data) => { setScores(data.scores); setKhatfaMessage(data); });
    socket.on('timeEnded', (data) => setRevealedAnswer(data.answer));
    socket.on('scoreAwarded', (data) => { setScores(data.scores); setRevealedAnswer(data.answer); });

    socket.on('gameReset', () => {
      setGameData(null);
      setPhase('LOBBY');
      setGameOverResult(null);
      setHasVoted(false);
      setRevealedSecrets(null);
      setBombExplodedMsg(null);
      setBuzzedPlayer(null);
      setKhatfaMessage(null);
    });

    socket.on('errorMsg', (msg) => { setError(msg); setTimeout(() => setError(''), 3500); });

    return () => socket.off();
  }, []);

  const handleCreate = () => {
    if (!name) return alert('أدخل اسمك أولاً');
    socket.emit('createRoom', { hostName: name, gameType: selectedGame, wordLang });
  };

  const handleJoin = () => {
    if (!name || !roomId) return alert('أدخل الاسم ورمز الغرفة');
    socket.emit('joinRoom', { roomId: roomId.toUpperCase(), playerName: name });
  };

  const handleVote = (targetPlayerId) => {
    socket.emit('submitVote', { roomId: currentRoom.roomId, targetPlayerId });
    setHasVoted(true);
  };

  const handleJoinRole = (team, role) => {
    socket.emit('changeTeamRole', { roomId: currentRoom.roomId, team, role });
  };

  const handleSendWhatsAppSuggestion = () => {
    if (!suggestionText.trim()) {
      alert('الرجاء كتابة الاقتراح أولاً!');
      return;
    }

    const myPhoneNumber = "9647845475031"; 
    const playerName = name || "لاعب مجهول";
    
    const fullMessage = `👋 أهلاً، عندي اقتراح لتطوير منصة SHOWTIME LIVE:\n\n👤 اسم اللاعب: ${playerName}\n💡 الاقتراح: ${suggestionText}`;
    const encodedMessage = encodeURIComponent(fullMessage);
    
    const whatsappUrl = `https://wa.me/${myPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    setSuggestionText('');
    setShowSuggestionModal(false);
  };

  const me = players.find(p => p.id === socket.id);
  const activeGameType = gameData?.gameType || currentRoom?.gameType;

  return (
    <div style={styles.container}>
      <header style={styles.topBar}>
        <div>
          <h1 style={styles.logo}>✨ SHOWTIME LIVE</h1>
          <p style={{ color: '#8b9bb4', margin: 0, fontSize: 13 }}>{t.subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            style={{ ...styles.btnSmall, backgroundColor: '#ffb703', color: '#000' }} 
            onClick={() => setShowSuggestionModal(true)}
          >
            💡 أرسل اقتراحك
          </button>
          {currentRoom && (
            <button style={styles.btnNav} onClick={() => { socket.emit('leaveRoom', { roomId: currentRoom.roomId }); setCurrentRoom(null); setGameData(null); }}>{t.mainMenu}</button>
          )}
          <button style={styles.btnSmall} onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>🌐 UI: {lang.toUpperCase()}</button>
        </div>
      </header>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {!currentRoom ? (
        <div style={styles.fullWidthLayout}>
          <div style={styles.leftPanel}>
            <div style={styles.cardBox}>
              <h3 style={styles.cardTitle}>1️⃣ {t.enterName}</h3>
              <input style={styles.input} placeholder={t.enterName} value={name} onChange={e => setName(e.target.value)} />
              
              <div style={{ marginTop: 15 }}>
                <label style={{ fontSize: 13, color: '#aaa' }}>{t.wordPack}: </label>
                <select style={styles.select} value={wordLang} onChange={e => setWordLang(e.target.value)}>
                  <option value="ar">العربية (Arabic Words)</option>
                  <option value="en">English Words</option>
                </select>
              </div>
            </div>

            <div style={{ ...styles.cardBox, marginTop: 15 }}>
              <h3 style={styles.cardTitle}>🔑 {t.joinRoom}</h3>
              <input style={styles.input} placeholder={t.roomCode} value={roomId} onChange={e => setRoomId(e.target.value)} />
              <button style={styles.btnSecondary} onClick={handleJoin}>{t.joinRoom}</button>
            </div>
          </div>

          <div style={styles.rightPanel}>
            <div style={styles.cardBox}>
              <h3 style={styles.cardTitle}>2️⃣ {t.selectGame}</h3>
              <div style={styles.gamesWideGrid}>
                {GAMES_LIST.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => setSelectedGame(game.id)}
                    style={{
                      ...styles.gameWideCard,
                      border: selectedGame === game.id ? '2px solid #ff2a5f' : '1px solid #22263a',
                      backgroundColor: selectedGame === game.id ? '#2a1a35' : '#121422'
                    }}
                  >
                    <div style={{ fontSize: 32 }}>{game.icon}</div>
                    <div style={{ fontWeight: 'bold', fontSize: 15, margin: '5px 0', color: '#fff' }}>{game.name[lang]}</div>
                    <span style={styles.badgePlayers}>👥 {game.players} لاعبين</span>
                    <div style={{ fontSize: 11, color: '#8a8d9b', marginTop: 5 }}>{game.desc[lang]}</div>
                  </div>
                ))}
              </div>

              <button style={styles.btnPrimaryLarge} onClick={handleCreate}>{t.createRoom}</button>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.gameWrapperFull}>
          {!gameData ? (
            <div style={styles.lobbyContainerWide}>
              <h2>رمز الغرفة: <span style={{ color: '#ff2a5f', fontSize: 32 }}>{currentRoom.roomId}</span></h2>
              <p style={{ color: '#aaa' }}>اللاعبون المتواجدون ({players.length}):</p>

              {activeGameType === 'codenames' ? (
                <div style={styles.teamsSetupGrid}>
                  <div style={styles.teamColumn}>
                    <div style={styles.teamBoxBlue}>
                      <h4>{t.blueOperatives}</h4>
                      {players.filter(p => p.team === 'BLUE' && p.role === 'OPERATIVE').map(p => <div key={p.id}>👤 {p.name}</div>)}
                      <button style={styles.btnJoinBlue} onClick={() => handleJoinRole('BLUE', 'OPERATIVE')}>{t.joinTeam}</button>
                    </div>
                    <div style={styles.teamBoxBlue}>
                      <h4>{t.blueSpymasters}</h4>
                      {players.filter(p => p.team === 'BLUE' && p.role === 'SPYMASTER').map(p => <div key={p.id}>🕵️‍♂️ {p.name}</div>)}
                      <button style={styles.btnJoinBlue} onClick={() => handleJoinRole('BLUE', 'SPYMASTER')}>{t.joinTeam}</button>
                    </div>
                  </div>

                  <div style={styles.teamColumn}>
                    <div style={styles.teamBoxRed}>
                      <h4>{t.redOperatives}</h4>
                      {players.filter(p => p.team === 'RED' && p.role === 'OPERATIVE').map(p => <div key={p.id}>👤 {p.name}</div>)}
                      <button style={styles.btnJoinRed} onClick={() => handleJoinRole('RED', 'OPERATIVE')}>{t.joinTeam}</button>
                    </div>
                    <div style={styles.teamBoxRed}>
                      <h4>{t.redSpymasters}</h4>
                      {players.filter(p => p.team === 'RED' && p.role === 'SPYMASTER').map(p => <div key={p.id}>🕵️‍♂️ {p.name}</div>)}
                      <button style={styles.btnJoinRed} onClick={() => handleJoinRole('RED', 'SPYMASTER')}>{t.joinTeam}</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', margin: '20px 0' }}>
                  {players.map(p => <span key={p.id} style={styles.playerBadge}>{p.name} {p.isHost ? '👑' : ''}</span>)}
                </div>
              )}

              {me?.isHost && (
                <button style={{ ...styles.btnPrimaryLarge, maxWidth: 250, margin: '20px auto' }} onClick={() => socket.emit('startGame', { roomId: currentRoom.roomId })}>{t.startGame}</button>
              )}
            </div>
          ) : (
            <div style={styles.gameAreaWide}>
              {/* برا السالفة المحدثة */}
              {activeGameType === 'out_of_topic' && (
                <div>
                  <div style={styles.statusHeader}>
                    <div style={styles.attemptBadge}>🎯 المحاولات: <strong>{attemptsLeft}/3</strong></div>
                    {phase === 'DISCUSSING' && <div style={styles.timerCircle}>⏱️ وقت النقاش: {timeLeft}s</div>}
                    {phase === 'VOTING' && <div style={{ ...styles.timerCircle, borderColor: '#ff2a5f', color: '#ff2a5f' }}>🗳️ وقت التصويت!</div>}
                  </div>

                  {roundNotice && <div style={styles.noticeBanner}>{roundNotice}</div>}

                  <div style={styles.simpleGameBoxWide}>
                    {gameData.role === 'IMPOSTOR' ? (
                      <h2 style={{ color: '#ff2a5f', fontSize: 32 }}>🕵️‍♂️ أنت برا السالفة!</h2>
                    ) : (
                      <div>
                        <div style={{ color: '#2a9d8f', fontSize: 18 }}>السالفة الخاصة بالجميع هي:</div>
                        <h1 style={{ fontSize: 36, margin: '15px 0', color: '#fff' }}>{gameData.topic}</h1>
                      </div>
                    )}
                  </div>

                  {phase === 'VOTING' && me?.isAlive && !hasVoted && (
                    <div style={styles.votingContainer}>
                      <h3>🗳️ صوّت للشخص اللّي تحسه "برا السالفة":</h3>
                      <div style={styles.voteGrid}>
                        {players.filter(p => p.id !== socket.id && p.isAlive).map((p) => (
                          <button key={p.id} style={styles.btnVoteCard} onClick={() => handleVote(p.id)}>
                            👤 {p.name}
                            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>{t.voteBtn}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {phase === 'VOTING' && hasVoted && <div style={styles.votedBanner}>{t.voted} - بانتظار باقي اللاعبين...</div>}
                  {!me?.isAlive && <div style={styles.spectatorBanner}>{t.spectator}</div>}
                  {phase === 'ENDED' && gameOverResult && (
                    <div style={styles.gameOverBox}>
                      <h2 style={{ fontSize: 28, color: gameOverResult.winner === 'PLAYERS' ? '#2a9d8f' : '#ff2a5f' }}>{gameOverResult.message}</h2>
                    </div>
                  )}
                </div>
              )}

              {/* خطفة المحدثة */}
              {activeGameType === 'khatfa' && (
                <div>
                  <div style={styles.statusHeader}>
                    <div style={styles.teamRedBox}>🔴 RED: {scores.RED}</div>
                    {buzzedPlayer && <div style={styles.timerCircle}>⏱️ {timeLeft}s</div>}
                    <div style={styles.teamBlueBox}>🔵 BLUE: {scores.BLUE}</div>
                  </div>

                  <div style={styles.simpleGameBoxWide}>
                    <h1 style={{ fontSize: 32, margin: '15px 0', color: '#fff' }}>{gameData.question}</h1>
                    {!buzzedPlayer && !khatfaMessage && (
                      <button style={styles.btnBuzzerBig} onClick={() => socket.emit('pressBuzzer', { roomId: currentRoom.roomId })}>{t.pressBuzzer}</button>
                    )}

                    {buzzedPlayer && !khatfaMessage && (
                      <div style={styles.buzzedControlBox}>
                        <div style={{ fontSize: 18, color: '#ffb703', marginBottom: 15 }}>
                          ⚡ قام بالخطف: <strong>{buzzedPlayer.buzzedPlayerName}</strong> ({buzzedPlayer.team === 'RED' ? '🔴 الأحمر' : '🔵 الأزرق'})
                        </div>
                        {buzzedPlayer.buzzedPlayerId === socket.id ? (
                          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <input style={styles.inputAnswer} placeholder="اكتب إجابتك هنا..." value={answerInput} onChange={e => setAnswerInput(e.target.value)} />
                            <button style={styles.btnSubmit} onClick={() => { socket.emit('submitKhatfaAnswer', { roomId: currentRoom.roomId, answerText: answerInput }); setAnswerInput(''); }}>{t.sendAnswer}</button>
                          </div>
                        ) : (
                          <div style={{ color: '#aaa' }}>بانتظار الإجابة... ⏱️</div>
                        )}
                      </div>
                    )}

                    {khatfaMessage && (
                      <div style={{ ...styles.resultBanner, backgroundColor: khatfaMessage.success ? '#2a9d8f33' : '#e6394633', borderColor: khatfaMessage.success ? '#2a9d8f' : '#e63946', color: khatfaMessage.success ? '#2a9d8f' : '#e63946' }}>
                        {khatfaMessage.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* الكرسي الساخن */}
              {activeGameType === 'hot_seat' && (
                <div style={styles.simpleGameBoxWide}>
                  <div style={{ color: '#ffb703', fontSize: 20, marginBottom: 10 }}>🔥 اللاعب الجالس على الكرسي الآن هو: <strong>({gameData.hotSeatPlayerName})</strong></div>
                  <h1 style={{ fontSize: 30, color: '#fff', margin: '20px 0' }}>{gameData.question}</h1>
                  <div style={{ display: 'flex', gap: 15, justifyContent: 'center', marginTop: 20 }}>
                    <button style={styles.btnGreen}>صادق 😇</button>
                    <button style={styles.btnRed}>كاذب 😈</button>
                  </div>
                </div>
              )}

              {/* القنبلة الموقوتة */}
              {activeGameType === 'pass_bomb' && (
                <div style={styles.simpleGameBoxWide}>
                  <h2 style={{ fontSize: 28, color: bombHolderId === socket.id ? '#ff2a5f' : '#fff' }}>
                    💣 القنبلة الآن عند: {players.find(p => p.id === bombHolderId)?.name}
                  </h2>
                  {!bombExplodedMsg ? (
                    bombHolderId === socket.id ? (
                      <button style={styles.btnBuzzerBig} onClick={() => socket.emit('passBomb', { roomId: currentRoom.roomId })}>{t.passBomb}</button>
                    ) : (
                      <div style={{ color: '#aaa', marginTop: 15 }}>تكتكة القنبلة مستمرة... ⏳</div>
                    )
                  ) : (
                    <div style={styles.errorBanner}>{bombExplodedMsg}</div>
                  )}
                </div>
              )}

              {/* من أنا */}
              {activeGameType === 'who_am_i' && (
                <div style={styles.simpleGameBoxWide}>
                  <div style={{ fontSize: 14, color: '#ffb703', marginBottom: 10 }}>
                    {gameData.isJudge ? '👑 أنت الحكم العشوائي لهذه الجولة!' : 'توقع الإجابة قبل انتهاء الوقت!'}
                  </div>
                  <h1 style={{ fontSize: 28, margin: '15px 0' }}>{gameData.question}</h1>
                  {gameData.isJudge && gameData.answer && (
                    <div style={{ backgroundColor: '#181b28', padding: 15, borderRadius: 12, marginTop: 15 }}>
                      💡 الإجابة الصحيحة للحكم: <strong style={{ color: '#4cc9f0' }}>{gameData.answer}</strong>
                      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 15 }}>
                        <button style={styles.btnRed} onClick={() => socket.emit('awardPoint', { roomId: currentRoom.roomId, winningTeam: 'RED' })}>+1 للأحمر 🔴</button>
                        <button style={styles.btnGreen} onClick={() => socket.emit('awardPoint', { roomId: currentRoom.roomId, winningTeam: 'BLUE' })}>+1 للأزرق 🔵</button>
                      </div>
                    </div>
                  )}
                  {revealedAnswer && <div style={{ color: '#2a9d8f', fontSize: 20, marginTop: 15 }}>🎉 الإجابة: {revealedAnswer}</div>}
                </div>
              )}

              {/* سرك في بئر */}
              {activeGameType === 'truth_secrets' && (
                <div style={styles.simpleGameBoxWide}>
                  {!revealedSecrets ? (
                    <div>
                      <h3>🔒 اكتب سراً مجهولاً لا يعرفه أحد بالجلسة:</h3>
                      <input style={styles.input} placeholder="اكتب سرك هنا..." value={secretText} onChange={e => setSecretText(e.target.value)} />
                      <button style={{ ...styles.btnPrimaryLarge, marginTop: 10 }} onClick={() => { socket.emit('submitSecret', { roomId: currentRoom.roomId, secretText }); setSecretText(''); }}>{t.sendSecret}</button>
                    </div>
                  ) : (
                    <div>
                      <h2>🤫 الأسرار المجهولة (خمن صاحب السر):</h2>
                      {revealedSecrets.map((s, idx) => <div key={idx} style={styles.secretBox}>• "{s}"</div>)}
                    </div>
                  )}
                </div>
              )}

              {/* كود نيمز */}
              {activeGameType === 'codenames' && (
                <div>
                  <div style={styles.statusHeader}>
                    <div style={styles.teamBlueBox}>BLUE</div>
                    <div style={styles.gameLogBox}>
                      <div style={{ fontSize: 11, color: '#aaa', fontWeight: 'bold' }}>GAME LOG</div>
                      {logs.map((l, idx) => <div key={idx} style={{ fontSize: 12 }}>• {l}</div>)}
                    </div>
                    <div style={styles.teamRedBox}>RED</div>
                  </div>

                  <div style={{ textAlign: 'center', margin: '15px 0', fontWeight: 'bold', fontSize: 18 }}>
                    {t.turnNotice} <span style={{ color: currentTurn === 'RED' ? '#e63946' : '#457b9d' }}>{currentTurn} TEAM</span>
                  </div>

                  {me?.role === 'SPYMASTER' && me?.team === currentTurn && (
                    <div style={styles.clueBar}>
                      <input style={styles.clueInput} placeholder="CLUE WORD" value={clueInput} onChange={e => setClueInput(e.target.value)} />
                      <input style={{ ...styles.clueInput, width: 60 }} type="number" value={clueCount} onChange={e => setClueCount(e.target.value)} />
                      <button style={styles.btnGreen} onClick={() => { if (clueInput) { socket.emit('sendClue', { roomId: currentRoom.roomId, clueWord: clueInput, clueCount }); setClueInput(''); } }}>SEND ➔</button>
                    </div>
                  )}

                  {currentClue && (
                    <div style={styles.noticeBanner}>💡 CLUE: <strong>{currentClue.word}</strong> ({currentClue.count})</div>
                  )}

                  <div style={styles.boardGrid25Wide}>
                    {board.map((card) => {
                      let bg = '#d8c29d';
                      let color = '#222';
                      if (card.revealed || me?.role === 'SPYMASTER') {
                        if (card.type === 'RED') { bg = '#e63946'; color = '#fff'; }
                        if (card.type === 'BLUE') { bg = '#457b9d'; color = '#fff'; }
                        if (card.type === 'NEUTRAL') { bg = '#b0a8b0'; color = '#333'; }
                        if (card.type === 'BOMB') { bg = '#111'; color = '#ff4d4d'; }
                      }
                      return (
                        <div key={card.id} onClick={() => me?.team === currentTurn && me?.role === 'OPERATIVE' && socket.emit('revealCard', { roomId: currentRoom.roomId, cardId: card.id })} style={{ ...styles.cardTileWide, background: bg, color: color, opacity: card.revealed ? 0.4 : 1 }}>
                          {card.word}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* باقي الألعاب النصية */}
              {['photo_challenge', 'movies_songs', 'password_challenge'].includes(activeGameType) && (
                <div style={styles.simpleGameBoxWide}>
                  <h1 style={{ fontSize: 28, color: '#fff' }}>{gameData.topic || gameData.hint || 'جاري اللعب...'}</h1>
                </div>
              )}

              {me?.isHost && (
                <button style={{ ...styles.btnSecondary, maxWidth: 220, margin: '20px auto 0 auto', display: 'block' }} onClick={() => socket.emit('resetGame', { roomId: currentRoom.roomId })}>{t.newRound}</button>
              )}
            </div>
          )}
        </div>
      )}

      {/* نافذة إرسال الاقتراحات */}
      {showSuggestionModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ marginTop: 0, color: '#ffb703' }}>💡 أرسل اقتراحك لتطوير اللعبة</h3>
            <p style={{ fontSize: 13, color: '#aaa' }}>اكتب فكرتك أو اللعبة التي تحب أن نضيفها، وسوف تصلنا مباشرة على الواتساب!</p>
            
            <textarea
              style={styles.textareaSuggestion}
              placeholder="اكتب اقتراحك هنا بكل صراحة..."
              rows="4"
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
            />

            <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
              <button style={styles.btnGreen} onClick={handleSendWhatsAppSuggestion}>
                📲 إرسال عبر WhatsApp
              </button>
              <button style={styles.btnSecondary} onClick={() => setShowSuggestionModal(false)}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Tajawal, sans-serif', backgroundColor: '#090a10', color: '#fff', minHeight: '100vh', padding: 20, boxSizing: 'border-box' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, borderBottom: '1px solid #1f2335', paddingBottom: 15 },
  logo: { fontSize: 26, color: '#ff2a5f', margin: 0, letterSpacing: 1 },
  btnSmall: { backgroundColor: '#181b28', color: '#fff', border: '1px solid #2a2e45', padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontWeight: 'bold' },
  btnNav: { backgroundColor: '#22263a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontWeight: 'bold' },
  fullWidthLayout: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, maxWidth: 1200, margin: '0 auto' },
  leftPanel: { display: 'flex', flexDirection: 'column' },
  rightPanel: { display: 'flex', flexDirection: 'column' },
  cardBox: { backgroundColor: '#121422', borderRadius: 16, padding: 20, border: '1px solid #1f2335' },
  cardTitle: { marginTop: 0, fontSize: 16, color: '#e0e0e0', marginBottom: 15 },
  input: { width: '100%', padding: 12, borderRadius: 10, border: '1px solid #22263a', backgroundColor: '#090a10', color: '#fff', fontSize: 15, boxSizing: 'border-box' },
  select: { width: '100%', padding: 10, borderRadius: 8, backgroundColor: '#090a10', color: '#fff', border: '1px solid #22263a', marginTop: 5 },
  gamesWideGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 },
  gameWideCard: { padding: 15, borderRadius: 12, cursor: 'pointer', textAlign: 'center' },
  badgePlayers: { backgroundColor: '#ff2a5f22', color: '#ff2a5f', padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 'bold' },
  btnPrimaryLarge: { width: '100%', padding: 14, borderRadius: 10, border: 'none', backgroundColor: '#ff2a5f', color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' },
  btnSecondary: { width: '100%', padding: 12, borderRadius: 10, border: 'none', backgroundColor: '#22263a', color: '#fff', fontSize: 15, cursor: 'pointer', marginTop: 10 },
  gameWrapperFull: { maxWidth: 1100, margin: '0 auto' },
  lobbyContainerWide: { backgroundColor: '#121422', padding: 30, borderRadius: 16, border: '1px solid #1f2335', textAlign: 'center' },
  teamsSetupGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 },
  teamColumn: { display: 'flex', flexDirection: 'column', gap: 12 },
  teamBoxBlue: { backgroundColor: '#18243b', padding: 15, borderRadius: 12, border: '1px solid #457b9d' },
  teamBoxRed: { backgroundColor: '#331920', padding: 15, borderRadius: 12, border: '1px solid #e63946' },
  btnJoinBlue: { marginTop: 10, backgroundColor: '#457b9d', border: 'none', color: '#fff', padding: '8px 15px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' },
  btnJoinRed: { marginTop: 10, backgroundColor: '#e63946', border: 'none', color: '#fff', padding: '8px 15px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' },
  playerBadge: { backgroundColor: '#1f2335', padding: '8px 15px', borderRadius: 20, fontSize: 14 },
  gameAreaWide: { backgroundColor: '#121422', padding: 25, borderRadius: 16, border: '1px solid #1f2335' },
  statusHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  attemptBadge: { backgroundColor: '#ff2a5f22', border: '1px solid #ff2a5f', padding: '10px 20px', borderRadius: 20, fontSize: 16, color: '#ff2a5f' },
  timerCircle: { fontSize: 20, fontWeight: 'bold', padding: '8px 20px', borderRadius: 30, border: '2px solid #2a9d8f', backgroundColor: '#090a10' },
  noticeBanner: { backgroundColor: '#ff2a5f22', border: '1px solid #ff2a5f', padding: 12, borderRadius: 10, textAlign: 'center', marginBottom: 15, fontSize: 16 },
  simpleGameBoxWide: { backgroundColor: '#090a10', padding: 30, borderRadius: 16, textAlign: 'center', border: '1px solid #22263a' },
  votingContainer: { marginTop: 25, textAlign: 'center' },
  voteGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginTop: 15 },
  btnVoteCard: { backgroundColor: '#181b28', border: '1px solid #ff2a5f', color: '#fff', padding: 15, borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 'bold' },
  votedBanner: { backgroundColor: '#2a9d8f22', border: '1px solid #2a9d8f', color: '#2a9d8f', padding: 15, borderRadius: 10, textAlign: 'center', marginTop: 20, fontSize: 16 },
  spectatorBanner: { backgroundColor: '#333', color: '#aaa', padding: 12, borderRadius: 10, textAlign: 'center', marginTop: 15 },
  gameOverBox: { backgroundColor: '#090a10', padding: 25, borderRadius: 16, textAlign: 'center', marginTop: 20, border: '2px solid #ff2a5f' },
  buzzedControlBox: { backgroundColor: '#181b28', padding: 20, borderRadius: 12, marginTop: 20, border: '1px solid #2a2e45' },
  inputAnswer: { width: '60%', padding: 12, borderRadius: 8, border: '1px solid #444', backgroundColor: '#090a10', color: '#fff', fontSize: 16 },
  btnSubmit: { backgroundColor: '#2a9d8f', border: 'none', color: '#fff', padding: '12px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' },
  resultBanner: { border: '1px solid', padding: 15, borderRadius: 10, marginTop: 20, fontSize: 18, fontWeight: 'bold' },
  btnBuzzerBig: { backgroundColor: '#ff2a5f', color: '#fff', border: 'none', padding: '18px 35px', borderRadius: 50, fontSize: 20, fontWeight: 'bold', cursor: 'pointer', marginTop: 15 },
  secretBox: { backgroundColor: '#181b28', padding: 12, borderRadius: 8, margin: '10px 0', border: '1px solid #2a2e45', fontSize: 16 },
  gameLogBox: { backgroundColor: '#090a10', height: 80, borderRadius: 10, padding: 10, overflowY: 'auto', border: '1px solid #22263a', width: '60%' },
  clueBar: { display: 'flex', gap: 10, justifyContent: 'center', margin: '15px 0' },
  clueInput: { padding: 10, borderRadius: 8, border: '1px solid #333', backgroundColor: '#090a10', color: '#fff' },
  boardGrid25Wide: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 15 },
  cardTileWide: { height: 75, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 17, userSelect: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' },
  btnGreen: { backgroundColor: '#2a9d8f', border: 'none', color: '#fff', padding: '12px 25px', borderRadius: 10, cursor: 'pointer', fontWeight: 'bold' },
  btnRed: { backgroundColor: '#e63946', border: 'none', color: '#fff', padding: '12px 25px', borderRadius: 10, cursor: 'pointer', fontWeight: 'bold' },
  errorBanner: { backgroundColor: '#e63946', color: '#fff', padding: 12, borderRadius: 10, textAlign: 'center', marginBottom: 15, fontWeight: 'bold' },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalCard: {
    backgroundColor: '#121422',
    border: '1px solid #ffb703',
    borderRadius: 16,
    padding: 25,
    maxWidth: 450,
    width: '90%',
    boxSizing: 'border-box'
  },
  textareaSuggestion: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    border: '1px solid #22263a',
    backgroundColor: '#090a10',
    color: '#fff',
    fontSize: 15,
    boxSizing: 'border-box',
    resize: 'none'
  }
};