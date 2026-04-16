import { useState, useEffect, useRef, useCallback } from "react";

/* ─── MATRIX RAIN ─────────────────────────────────────────── */
function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const cols = Math.floor(W / 20);
    const drops = Array(cols).fill(1);
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF";
    let raf;
    const draw = () => {
      ctx.fillStyle = "rgba(5,5,12,0.05)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#00ff88";
      ctx.font = "14px monospace";
      drops.forEach((y, i) => {
        ctx.fillStyle = i % 3 === 0 ? "#00ff88" : i % 3 === 1 ? "#00d4ff" : "#ff008044";
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 20, y * 20);
        if (y * 20 > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, opacity: 0.18, pointerEvents: "none" }} />;
}

/* ─── GLITCH TEXT ──────────────────────────────────────────── */
function GlitchText({ text, size = "4rem" }) {
  return (
    <div style={{ position: "relative", display: "inline-block", fontSize: size, fontFamily: "'Orbitron', monospace", fontWeight: 900, letterSpacing: "0.1em" }}>
      <span style={{ position: "absolute", top: 0, left: 0, color: "#ff0080", clipPath: "polygon(0 30%, 100% 30%, 100% 50%, 0 50%)", animation: "glitch1 3s infinite", opacity: 0.8 }}>{text}</span>
      <span style={{ position: "absolute", top: 0, left: 0, color: "#00d4ff", clipPath: "polygon(0 60%, 100% 60%, 100% 80%, 0 80%)", animation: "glitch2 3s infinite", opacity: 0.8 }}>{text}</span>
      <span style={{ color: "#fff", textShadow: "0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 80px #00ff8866" }}>{text}</span>
    </div>
  );
}

/* ─── TYPEWRITER ───────────────────────────────────────────── */
function TypeWriter({ texts }) {
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const cur = texts[idx];
    const speed = deleting ? 40 : 80;
    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplay(cur.slice(0, display.length + 1));
        if (display.length === cur.length - 1) setTimeout(() => setDeleting(true), 1200);
      } else {
        setDisplay(cur.slice(0, display.length - 1));
        if (display.length === 0) { setDeleting(false); setIdx((idx + 1) % texts.length); }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [display, deleting, idx, texts]);
  return (
    <span style={{ color: "#00d4ff", fontFamily: "'Share Tech Mono', monospace", fontSize: "1.3rem" }}>
      {display}<span style={{ animation: "blink 1s infinite", color: "#00ff88" }}>█</span>
    </span>
  );
}

/* ─── NEON CARD ────────────────────────────────────────────── */
function NeonCard({ icon, title, level, color = "#00ff88" }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `${color}11` : "#0a0a1488",
        border: `1px solid ${hov ? color : color + "44"}`,
        borderRadius: 8, padding: "20px 16px", textAlign: "center",
        transition: "all 0.3s", cursor: "default",
        boxShadow: hov ? `0 0 24px ${color}66, inset 0 0 24px ${color}11` : "none",
        transform: hov ? "translateY(-4px)" : "none",
      }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ color: hov ? color : "#ccc", fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", textShadow: hov ? `0 0 10px ${color}` : "none" }}>{title}</div>
      <div style={{ marginTop: 10, height: 4, background: "#ffffff11", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: level + "%", background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}`, borderRadius: 2, transition: "width 1s" }} />
      </div>
      <div style={{ color: color + "aa", fontSize: 10, marginTop: 4, fontFamily: "monospace" }}>{level}%</div>
    </div>
  );
}

/* ─── VIDEO CARD ───────────────────────────────────────────── */
function VideoCard({ title, desc, index, videoFile }) {
  const [playing, setPlaying] = useState(false);
  const vidRef = useRef(null);
  const colors = ["#00ff88", "#00d4ff", "#ff0080", "#ffff00"];
  const c = colors[index % 4];
  const toggle = () => {
    if (vidRef.current) {
      playing ? vidRef.current.pause() : vidRef.current.play();
      setPlaying(!playing);
    }
  };
  return (
    <div style={{ background: "#0a0a1488", border: `1px solid ${c}44`, borderRadius: 12, overflow: "hidden", transition: "all 0.3s" }}>
      <div style={{ position: "relative", background: "#000", aspectRatio: "16/9", overflow: "hidden" }}>
        <video ref={vidRef} src={videoFile} style={{ width: "100%", height: "100%", objectFit: "cover" }} loop muted playsInline />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: playing ? "transparent" : "#00000088", cursor: "pointer" }} onClick={toggle}>
          {!playing && (
            <div style={{ width: 56, height: 56, borderRadius: "50%", border: `2px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", background: `${c}22`, boxShadow: `0 0 20px ${c}` }}>
              <div style={{ width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: `18px solid ${c}`, marginLeft: 4 }} />
            </div>
          )}
        </div>
        <div style={{ position: "absolute", top: 8, right: 8, background: `${c}22`, border: `1px solid ${c}44`, borderRadius: 4, padding: "2px 8px", color: c, fontSize: 10, fontFamily: "monospace" }}>
          {playing ? "● LIVE" : "▶ PLAY"}
        </div>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <div style={{ color: c, fontFamily: "'Orbitron', monospace", fontSize: 12, fontWeight: 700, letterSpacing: 2, textShadow: `0 0 10px ${c}` }}>{title}</div>
        <div style={{ color: "#888", fontSize: 13, marginTop: 6, fontFamily: "monospace", lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── NAV ──────────────────────────────────────────────────── */
function Nav({ active, setActive }) {
  const links = ["HOME", "SKILLS", "PROJECTS", "CONTACT"];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "#05050cee", backdropFilter: "blur(20px)", borderBottom: "1px solid #00ff8822", padding: "0 5%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 18, color: "#00ff88", textShadow: "0 0 20px #00ff88", letterSpacing: 3 }}>SZ.DEV</div>
        <div style={{ display: "flex", gap: 32 }}>
          {links.map(l => (
            <button key={l} onClick={() => setActive(l)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: active === l ? "#00ff88" : "#666", textShadow: active === l ? "0 0 10px #00ff88" : "none", borderBottom: active === l ? "2px solid #00ff88" : "2px solid transparent", paddingBottom: 4, transition: "all 0.3s" }}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ─── SECTIONS ─────────────────────────────────────────────── */
function Home({ setActive }) {
  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", padding: "100px 5% 60px", position: "relative" }}>
      <div style={{ position: "relative", marginBottom: 32 }}>
        <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "linear-gradient(45deg, #00ff88, #00d4ff, #ff0080, #00ff88)", backgroundSize: "400% 400%", animation: "gradient 3s ease infinite", filter: "blur(8px)", opacity: 0.6 }} />
        <img src="/dp.jpg" alt="Shams Zia" style={{ width: 180, height: 180, borderRadius: "50%", objectFit: "cover", border: "3px solid #00ff88", boxShadow: "0 0 40px #00ff8866, inset 0 0 20px #00ff8822", position: "relative", zIndex: 1 }} />
      </div>
      <div style={{ fontFamily: "monospace", color: "#00ff8888", fontSize: 13, letterSpacing: 4, marginBottom: 24, textTransform: "uppercase" }}>// Initializing System...</div>
      <GlitchText text="SHAMS ZIA" size="clamp(2.5rem,7vw,5.5rem)" />
      <div style={{ marginTop: 20, marginBottom: 32 }}>
        <TypeWriter texts={["Data Engineer", "Big Data Architect", "ETL Pipeline Builder", "Spark & Hadoop Expert"]} />
      </div>
      <p style={{ color: "#888", maxWidth: 560, lineHeight: 1.8, fontFamily: "monospace", fontSize: 14, borderLeft: "2px solid #00ff8844", paddingLeft: 16, textAlign: "left", marginBottom: 40 }}>
        Building high-performance data infrastructure — from massive ETL pipelines to distributed big data systems. Turning raw data chaos into structured intelligence.
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => setActive("PROJECTS")}
          style={{ background: "transparent", border: "1px solid #00ff88", color: "#00ff88", padding: "12px 32px", fontFamily: "'Orbitron', monospace", fontSize: 12, fontWeight: 700, letterSpacing: 3, cursor: "pointer", boxShadow: "0 0 20px #00ff8844", transition: "all 0.3s" }}
          onMouseEnter={e => { e.target.style.background="#00ff8822"; e.target.style.boxShadow="0 0 40px #00ff8888"; }}
          onMouseLeave={e => { e.target.style.background="transparent"; e.target.style.boxShadow="0 0 20px #00ff8844"; }}>
          VIEW WORK ▶
        </button>
        <button onClick={() => setActive("CONTACT")}
          style={{ background: "transparent", border: "1px solid #ff0080", color: "#ff0080", padding: "12px 32px", fontFamily: "'Orbitron', monospace", fontSize: 12, fontWeight: 700, letterSpacing: 3, cursor: "pointer", boxShadow: "0 0 20px #ff008044", transition: "all 0.3s" }}
          onMouseEnter={e => { e.target.style.background="#ff008022"; e.target.style.boxShadow="0 0 40px #ff008088"; }}
          onMouseLeave={e => { e.target.style.background="transparent"; e.target.style.boxShadow="0 0 20px #ff008044"; }}>
          HIRE ME ⚡
        </button>
      </div>
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", animation: "bounce 2s infinite" }}>
        <div style={{ color: "#00ff8866", fontSize: 24 }}>↓</div>
      </div>
    </section>
  );
}

function Skills() {
  const skills = [
    { icon: "⚡", title: "Apache Spark", level: 92, color: "#ff6b35" },
    { icon: "🐘", title: "Hadoop", level: 88, color: "#00d4ff" },
    { icon: "🔄", title: "ETL Pipelines", level: 95, color: "#00ff88" },
    { icon: "📊", title: "Big Data", level: 90, color: "#ff0080" },
    { icon: "🐍", title: "Python", level: 88, color: "#ffff00" },
    { icon: "🗄️", title: "SQL / NoSQL", level: 85, color: "#a78bfa" },
    { icon: "☁️", title: "Cloud (AWS/GCP)", level: 80, color: "#00d4ff" },
    { icon: "🐋", title: "Docker / K8s", level: 78, color: "#00ff88" },
    { icon: "📡", title: "Kafka / Streaming", level: 82, color: "#ff0080" },
    { icon: "🔁", title: "Airflow / Orchestration", level: 85, color: "#ff6b35" },
    { icon: "📈", title: "Data Warehousing", level: 87, color: "#ffff00" },
    { icon: "🧠", title: "Data Modeling", level: 83, color: "#a78bfa" },
  ];
  return (
    <section style={{ padding: "100px 5%", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ color: "#00ff8866", fontFamily: "monospace", fontSize: 12, letterSpacing: 4, marginBottom: 12 }}>// CAPABILITY_MATRIX.load()</div>
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.6rem,4vw,2.5rem)", fontWeight: 900, color: "#fff", letterSpacing: 4, textShadow: "0 0 30px #00ff8866" }}>SKILL MATRIX</h2>
        <div style={{ width: 100, height: 2, background: "linear-gradient(90deg, transparent, #00ff88, transparent)", margin: "16px auto 0" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 16, maxWidth: 960, margin: "0 auto" }}>
        {skills.map(s => <NeonCard key={s.title} {...s} />)}
      </div>
    </section>
  );
}

function Projects({ videoFiles }) {
  const projects = [
    { title: "ETL PIPELINE v2", desc: "High-throughput data ingestion pipeline processing 50M+ records/day using Apache Spark and Airflow orchestration." },
    { title: "SPARK STREAMING", desc: "Real-time data processing engine built on Kafka + Spark Streaming for live analytics dashboards." },
    { title: "DATA LAKE ARCH", desc: "Enterprise-grade data lake architecture on cloud — raw → processed → curated layers with Delta Lake." },
    { title: "BIG DATA CLUSTER", desc: "Distributed Hadoop cluster setup with HDFS, YARN, and custom optimizations for query performance." },
  ];
  return (
    <section style={{ padding: "100px 5%", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ color: "#ff008066", fontFamily: "monospace", fontSize: 12, letterSpacing: 4, marginBottom: 12 }}>// PROJECTS.render()</div>
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.6rem,4vw,2.5rem)", fontWeight: 900, color: "#fff", letterSpacing: 4, textShadow: "0 0 30px #ff008066" }}>PROJECTS</h2>
        <div style={{ width: 100, height: 2, background: "linear-gradient(90deg, transparent, #ff0080, transparent)", margin: "16px auto 0" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
        {projects.map((p, i) => (
          <VideoCard key={i} {...p} index={i} videoFile={videoFiles[i]} />
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const inputStyle = {
    width: "100%", padding: "12px 16px", background: "#0a0a1488",
    border: "1px solid #00ff8833", borderRadius: 6, color: "#fff",
    fontFamily: "'Share Tech Mono', monospace", fontSize: 14,
    outline: "none", marginBottom: 16, boxSizing: "border-box",
    transition: "border-color 0.3s",
  };
  return (
    <section style={{ padding: "100px 5%", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ color: "#00d4ff66", fontFamily: "monospace", fontSize: 12, letterSpacing: 4, marginBottom: 12 }}>// ESTABLISH_CONNECTION()</div>
        <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.6rem,4vw,2.5rem)", fontWeight: 900, color: "#fff", letterSpacing: 4, textShadow: "0 0 30px #00d4ff66" }}>CONTACT</h2>
        <div style={{ width: 100, height: 2, background: "linear-gradient(90deg, transparent, #00d4ff, transparent)", margin: "16px auto 0" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, maxWidth: 900, margin: "0 auto" }}>
        <div>
          <div style={{ marginBottom: 32 }}>
            {[
              { label: "EMAIL", val: "shamsiop7000@gmail.com", color: "#00ff88" },
              { label: "SPECIALTY", val: "Big Data & ETL Engineering", color: "#00d4ff" },
              { label: "STACK", val: "Spark · Hadoop · Python · Kafka", color: "#ff0080" },
              { label: "STATUS", val: "▶ Available for projects", color: "#ffff00" },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 16, marginBottom: 24 }}>
                <div style={{ color: color + "88", fontFamily: "'Orbitron', monospace", fontSize: 10, letterSpacing: 2, marginBottom: 4 }}>{label}</div>
                <div style={{ color: "#ddd", fontFamily: "monospace", fontSize: 14 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          {sent ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ color: "#00ff88", fontFamily: "'Orbitron', monospace", fontSize: 20, textShadow: "0 0 20px #00ff88" }}>TRANSMITTED ✓</div>
              <div style={{ color: "#666", fontFamily: "monospace", marginTop: 12 }}>Message received. Will respond shortly.</div>
            </div>
          ) : (
            <div>
              <input style={inputStyle} placeholder="// YOUR_NAME" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                onFocus={e => e.target.style.borderColor="#00ff88"} onBlur={e => e.target.style.borderColor="#00ff8833"} />
              <input style={inputStyle} placeholder="// YOUR_EMAIL" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                onFocus={e => e.target.style.borderColor="#00d4ff"} onBlur={e => e.target.style.borderColor="#00ff8833"} />
              <textarea style={{...inputStyle, minHeight: 120, resize: "vertical"}} placeholder="// YOUR_MESSAGE" value={form.msg} onChange={e => setForm({...form, msg: e.target.value})}
                onFocus={e => e.target.style.borderColor="#ff0080"} onBlur={e => e.target.style.borderColor="#00ff8833"} />
              <button onClick={() => { if(form.name && form.email && form.msg) setSent(true); }}
                style={{ width: "100%", padding: "14px", background: "transparent", border: "1px solid #00ff88", color: "#00ff88", fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 4, cursor: "pointer", boxShadow: "0 0 20px #00ff8844", transition: "all 0.3s" }}
                onMouseEnter={e => { e.target.style.background="#00ff8822"; e.target.style.boxShadow="0 0 40px #00ff8888"; }}
                onMouseLeave={e => { e.target.style.background="transparent"; e.target.style.boxShadow="0 0 20px #00ff8844"; }}>
                TRANSMIT MESSAGE ▶
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── ROOT ─────────────────────────────────────────────────── */
export default function Portfolio() {
  const [active, setActive] = useState("HOME");
  const sectionRef = useRef(null);

  const scrollTo = useCallback((s) => {
    setActive(s);
    const el = document.getElementById(s.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const videoFiles = [
    "/videos/WhatsApp_Video_2026-03-22_at_10_11_01_PM__1_.mp4",
    "/videos/WhatsApp_Video_2026-03-22_at_10_11_01_PM.mp4",
    "/videos/WhatsApp_Video_2026-03-20_at_12_42_17_AM__1_.mp4",
    "/videos/WhatsApp_Video_2026-03-20_at_12_42_17_AM.mp4",
  ];

  return (
    <div style={{ background: "#05050c", minHeight: "100vh", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #05050c; }
        ::-webkit-scrollbar-thumb { background: #00ff8844; border-radius: 2px; }
        @keyframes glitch1 { 0%,100%{transform:translate(0)} 20%{transform:translate(-3px,1px)} 40%{transform:translate(3px,-1px)} 60%{transform:translate(-2px,2px)} 80%{transform:translate(2px,-2px)} }
        @keyframes glitch2 { 0%,100%{transform:translate(0)} 20%{transform:translate(3px,-1px)} 40%{transform:translate(-3px,1px)} 60%{transform:translate(2px,-2px)} 80%{transform:translate(-2px,2px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes gradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @media(max-width:640px) {
          nav div:last-child { gap: 16px !important; }
          nav button { font-size: 9px !important; letter-spacing: 1px !important; }
          section > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00000033 2px, #00000033 4px)", backgroundSize: "100% 4px" }} />
      <MatrixRain />
      <Nav active={active} setActive={scrollTo} />
      <main style={{ position: "relative", zIndex: 2 }} ref={sectionRef}>
        <div id="home"><Home setActive={scrollTo} /></div>
        <div id="skills"><Skills /></div>
        <div id="projects"><Projects videoFiles={videoFiles} /></div>
        <div id="contact"><Contact /></div>
      </main>
      <footer style={{ textAlign: "center", padding: "32px", borderTop: "1px solid #00ff8811", color: "#333", fontFamily: "monospace", fontSize: 12, position: "relative", zIndex: 2 }}>
        <span style={{ color: "#00ff8844" }}>// </span>SHAMS ZIA © 2026 <span style={{ color: "#00ff8844" }}> — DATA ENGINEER</span>
      </footer>
    </div>
  );
}
