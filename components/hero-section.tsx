"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { motion, Variants } from "framer-motion";

export function HeroSection() {
  const [sessionActive, setSessionActive] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [starPositions, setStarPositions] = useState<{ top: string; left: string; duration: string }[]>([]);
  const [yellowDots, setYellowDots] = useState<{ top: string; left: string; delay: string }[]>([]);

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

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchSession() {
      try {
        const res = await fetch("/api/registration-sessions");
        const data = await res.json();

        if (data.active) {
          setSessionActive(true);
          updateTimeLeft(data.end_time);
          intervalId = setInterval(() => updateTimeLeft(data.end_time), 1000);
        } else {
          setSessionActive(false);
        }
      } catch (err) {
        console.error("Erreur fetch session:", err);
        setSessionActive(false);
      }
    }

    function updateTimeLeft(endTimeStr: string) {
      const endTime = new Date(endTimeStr).getTime();
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setSessionActive(false);
        clearInterval(intervalId);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    fetchSession();

    const pollInterval = setInterval(fetchSession, 10000);

    return () => {
      clearInterval(intervalId);
      clearInterval(pollInterval);
    };
  }, []);

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

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat opacity-70 bg-[center_20%] sm:bg-[center_30%] lg:bg-[center_20%]"
        style={{ backgroundImage: "url('/images/etienne.jpg')" }}
      />

      {/* Décor */}
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

      {/* CONTENT */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative max-w-5xl mx-auto text-center flex flex-col justify-between min-h-[70vh]"
      >

        {/* 🔝 HAUT */}
        <div>
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg leading-tight">
            Transformez votre avenir avec le <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 font-extrabold">
              numérique
            </span>
          </motion.h1>
        </div>

        {/* 🎯 MILIEU */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center"
        >
          <div className="relative inline-flex flex-col items-center justify-center gap-1 px-8 py-4 rounded-full text-white font-bold shadow-md shadow-primary/20">

            {/* 🎨 Fond animé */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400/50 via-red-500/50 to-pink-500/50 blur-2xl animate-pulse" />
            </div>

            {/* ✨ Sparkles */}
            <Sparkles className="size-6 animate-spin-slow relative z-10" />

            {/* 🔥 Texte principal */}
            <motion.span
              className="text-2xl md:text-3xl lg:text-4xl relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {sessionActive ? "Inscription ouverte" : "Nouvelle session bientôt disponible"}
            </motion.span>

            {sessionActive && (
              <div className="mt-6 flex flex-col items-center gap-6 relative z-10">

                {/* ⚠️ Places limitées */}
                <div className="px-6 py-2 rounded-full border border-yellow-400/40 text-yellow-300 text-sm bg-yellow-400/10">
                  ● Places limitées • 100 maximum
                </div>

                {/* ⏱ H2 animé */}
                <motion.h2
                  className="text-xl md:text-2xl font-bold text-white text-center leading-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Le compte à rebours est lancé !
                </motion.h2>

                {/* 📢 Rejoins-nous maintenant animé */}
                <motion.p
                  className="text-lg md:text-xl font-semibold text-white/70 text-center -mt-1 cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  whileHover={{ scale: 1.05, color: "#FACC15" }} // jaune vif au hover
                >
                  Rejoins-nous maintenant
                </motion.p>

                {/* ⏳ Compte à rebours animé */}
                <div className="flex gap-3 mt-2">
                  {[
                    { label: "JOURS", value: timeLeft.days },
                    { label: "HEURES", value: timeLeft.hours },
                    { label: "MINUTES", value: timeLeft.minutes },
                    { label: "SECONDES", value: timeLeft.seconds },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="w-20 h-20 flex flex-col items-center justify-center rounded-xl border border-yellow-400/20 bg-white/5 backdrop-blur-lg text-white shadow-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    >
                      <span className="text-xl font-bold">{item.value}</span>
                      <span className="text-[10px] text-white/70">{item.label}</span>
                    </motion.div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </motion.div>
        {/* 🔽 BAS */}
        <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center gap-6">

          <motion.p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed tracking-wide drop-shadow-md">
            J’ai généré <strong>800 € en un mois</strong> grâce aux compétences acquises en numérique.
            Je vais vous montrer comment faire pareil si vous décidez aujourd’hui de prendre votre vie en main.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#register" className={`inline-flex items-center justify-center gap-3 h-14 px-10 rounded-xl ${sessionActive
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
              : "bg-gray-400 cursor-not-allowed text-muted-foreground"} font-bold text-lg transition-all duration-300`}>
              Je réserve
              <ArrowRight className="size-6" />
            </a>

            <a href="#benefits" className="inline-flex items-center justify-center h-14 px-10 rounded-xl border border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors">
              En savoir plus
            </a>
          </div>

        </motion.div>

      </motion.div>
    </section>
  );
}