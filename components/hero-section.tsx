"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { motion, Variants } from "framer-motion";

export function HeroSection() {
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [starPositions, setStarPositions] = useState<{ top: string; left: string; duration: string }[]>([]);
  const [yellowDots, setYellowDots] = useState<{ top: string; left: string; delay: string }[]>([]);

  // Générer étoiles et points jaunes uniquement côté client
  useEffect(() => {
    setStarPositions(
      Array.from({ length: 10 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: `${Math.random() * 3 + 2}s`,
      }))
    );

    setYellowDots(
      Array.from({ length: 20 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random()}s`,
      }))
    );
  }, []);

  // --- Gestion de la session avec polling ---
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchSession() {
      try {
        const res = await fetch("/api/registration-sessions");
        const data = await res.json();

        if (data.active) {
          setSessionActive(true);
          updateTimeLeft(data.end_time);

          // Timer toutes les secondes pour le countdown
          intervalId = setInterval(() => updateTimeLeft(data.end_time), 1000);
        } else {
          setSessionActive(false);
          setTimeLeft("");
        }
      } catch (err) {
        console.error("Erreur fetch session:", err);
        setSessionActive(false);
        setTimeLeft("");
      }
    }

    function updateTimeLeft(endTimeStr: string) {
      const endTime = new Date(endTimeStr).getTime();
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setSessionActive(false);
        setTimeLeft("");
        clearInterval(intervalId);
        return;
      }

      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      const formattedDate = new Date(endTime).toLocaleDateString("fr-FR", options);
      setTimeLeft(`Fin d'inscription : ${formattedDate}`);
    }

    fetchSession();

    // Poll toutes les 10 secondes pour détecter un arrêt depuis le dashboard
    const pollInterval = setInterval(fetchSession, 10000);

    return () => {
      clearInterval(intervalId);
      clearInterval(pollInterval);
    };
  }, []);

  // Variants Framer Motion
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="relative pt-32 sm:pt-34 lg:pt-44 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[80vh] lg:min-h-[90vh] font-sans">
      {/* Background & décor */}
      <div className="absolute inset-0 bg-cover bg-no-repeat opacity-70"
        style={{ backgroundImage: "url('/images/etienne.jpeg')", backgroundPosition: "center top" }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-300/20 via-pink-300/20 to-yellow-300/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-t from-indigo-300/30 to-cyan-300/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />

        {starPositions.map((star, i) => (
          <Star key={i} className="absolute text-white/50 w-2 h-2 animate-pulse"
            style={{ top: star.top, left: star.left, animationDuration: star.duration }} />
        ))}

        {yellowDots.map((dot, i) => (
          <span key={i} className="absolute w-2 h-2 rounded-full bg-yellow-400/80 animate-[pulse_1.5s_ease-in-out_infinite]"
            style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }} />
        ))}
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative max-w-5xl mx-auto text-center grid gap-6">
        <motion.div variants={itemVariants} className="relative inline-flex flex-col items-center justify-center gap-1 px-8 py-4 rounded-full text-white font-bold shadow-md shadow-primary/20 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400/50 via-red-500/50 to-pink-500/50 blur-2xl animate-pulse" />
          </div>

          <Sparkles className="size-6 animate-spin-slow relative z-10" />
          <span className="text-2xl md:text-3xl lg:text-4xl relative z-10">
            {sessionActive ? "Inscription ouverte" : "Nouvelle session bientôt disponible"}
          </span>

          {sessionActive && (
            <span className="text-xl md:text-2xl lg:text-3xl relative z-10">{timeLeft}</span>
          )}
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg leading-tight">
          Transformez votre avenir avec <span className="text-primary">l’IA et le montage vidéo</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="mt-4 text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed tracking-wide drop-shadow-md">
          J’ai généré <strong>800 € en un mois</strong> grâce à ces compétences. Je vais vous montrer comment faire pareil si vous décidez aujourd’hui de prendre votre vie en main.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href="#register" className={`inline-flex items-center justify-center gap-3 h-14 px-10 rounded-xl ${sessionActive
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
            : "bg-gray-400 cursor-not-allowed text-muted-foreground"} font-bold text-lg transition-all duration-300`}>
            S'inscrire maintenant
            <ArrowRight className="size-6" />
          </a>
          <a href="#benefits" className="inline-flex items-center justify-center h-14 px-10 rounded-xl border border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors">
            En savoir plus
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import { ArrowRight, Sparkles, Star } from "lucide-react";
// import { motion, Variants } from "framer-motion";

// export function HeroSection() {
//   const [sessionActive, setSessionActive] = useState(false);
//   const [timeLeft, setTimeLeft] = useState<string>("");
//   const [starPositions, setStarPositions] = useState<{ top: string; left: string; duration: string }[]>([]);
//   const [yellowDots, setYellowDots] = useState<{ top: string; left: string; delay: string }[]>([]);

//   // Générer étoiles et points jaunes uniquement côté client
//   useEffect(() => {
//     setStarPositions(
//       Array.from({ length: 10 }).map(() => ({
//         top: `${Math.random() * 100}%`,
//         left: `${Math.random() * 100}%`,
//         duration: `${Math.random() * 3 + 2}s`,
//       }))
//     );

//     setYellowDots(
//       Array.from({ length: 20 }).map(() => ({
//         top: `${Math.random() * 100}%`,
//         left: `${Math.random() * 100}%`,
//         delay: `${Math.random()}s`,
//       }))
//     );
//   }, []);

//   // Gestion de la session
//   useEffect(() => {
//     async function fetchSession() {
//       const res = await fetch("/api/registration-sessions");
//       const data = await res.json();
//       if (data.active) {
//         setSessionActive(true);
//         updateTimeLeft(data.end_time);
//         const interval = setInterval(() => updateTimeLeft(data.end_time), 1000);
//         return () => clearInterval(interval);
//       }
//     }

//     function updateTimeLeft(endTimeStr: string) {
//       const endTime = new Date(endTimeStr);
//       const now = new Date();
//       const diff = endTime.getTime() - now.getTime();

//       if (diff <= 0) {
//         setSessionActive(false);
//         setTimeLeft("");
//         return;
//       }

//       // Formater la date complète : jour, mois, année, heure et minute
//       const options: Intl.DateTimeFormatOptions = {
//         weekday: "long",
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       };
//       const formattedDate = endTime.toLocaleDateString("fr-FR", options);

//       setTimeLeft(`Fin d'inscription : ${formattedDate}`);
//     }

//     fetchSession();
//   }, []);

//   // Variants Framer Motion
//   const containerVariants: Variants = {
//     hidden: {},
//     show: { transition: { staggerChildren: 0.1 } },
//   };

//   const itemVariants: Variants = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
//   };

//   return (
//     <section className="relative pt-32 sm:pt-34 lg:pt-44 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[80vh] lg:min-h-[90vh] font-sans">
//       {/* Image de fond */}
//       <div
//         className="absolute inset-0 bg-cover bg-no-repeat opacity-70"
//         style={{ backgroundImage: "url('/images/etienne.jpeg')", backgroundPosition: "center top" }}
//       />

//       {/* Décorations floues et magiques */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-300/20 via-pink-300/20 to-yellow-300/20 rounded-full blur-[120px] animate-blob" />
//         <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-t from-indigo-300/30 to-cyan-300/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />

//         {/* Étoiles scintillantes */}
//         {starPositions.map((star, i) => (
//           <Star
//             key={i}
//             className="absolute text-white/50 w-2 h-2 animate-pulse"
//             style={{ top: star.top, left: star.left, animationDuration: star.duration }}
//           />
//         ))}

//         {/* Petits points jaunes pulsants */}
//         {yellowDots.map((dot, i) => (
//           <span
//             key={i}
//             className="absolute w-2 h-2 rounded-full bg-yellow-400/80 animate-[pulse_1.5s_ease-in-out_infinite]"
//             style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }}
//           />
//         ))}
//       </div>

//       {/* Contenu central */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="show"
//         className="relative max-w-5xl mx-auto text-center grid gap-6"
//       >
//         {/* Message de session */}
//         <motion.div
//           variants={itemVariants}
//           className="relative inline-flex flex-col items-center justify-center gap-1 px-8 py-4 rounded-full text-white font-bold shadow-md shadow-primary/20 overflow-hidden"
//         >
//           {/* Halo feu derrière le texte */}
//           <div className="absolute inset-0 z-0 pointer-events-none">
//             <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400/50 via-red-500/50 to-pink-500/50 blur-2xl animate-pulse" />
//           </div>

//           <Sparkles className="size-6 animate-spin-slow relative z-10" />

//           {/* Texte principal */}
//           <span className="text-2xl md:text-3xl lg:text-4xl relative z-10">
//             Inscription ouverte
//           </span>

//           {/* Date complète de fin */}
//           <span className="text-xl md:text-2xl lg:text-3xl relative z-10">
//             {sessionActive ? timeLeft : "Nouvelle session bientôt disponible"}
//           </span>
//         </motion.div>

//         {/* Titre principal */}
//         <motion.h1
//           variants={itemVariants}
//           className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg leading-tight"
//         >
//           Transformez votre avenir avec <span className="text-primary">l’IA et le montage vidéo</span>
//         </motion.h1>

//         {/* Sous-texte */}
//         <motion.p
//           variants={itemVariants}
//           className="mt-4 text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed tracking-wide drop-shadow-md"
//         >
//           J’ai généré <strong>800 € en un mois</strong> grâce à ces compétences. Je vais vous montrer comment faire pareil si vous décidez aujourd’hui de prendre votre vie en main.
//         </motion.p>

//         {/* Boutons */}
//         <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
//           <a
//             href="#register"
//             className={`inline-flex items-center justify-center gap-3 h-14 px-10 rounded-xl ${sessionActive
//               ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
//               : "bg-gray-400 cursor-not-allowed text-muted-foreground"
//               } font-bold text-lg transition-all duration-300`}
//           >
//             Commencez dès maintenant
//             <ArrowRight className="size-6" />
//           </a>
//           <a
//             href="#benefits"
//             className="inline-flex items-center justify-center h-14 px-10 rounded-xl border border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
//           >
//             En savoir plus
//           </a>
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// }