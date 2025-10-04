import React, { useEffect, useRef, useState } from "react";
import "./Gallery.css";

const STORAGE_KEY = "codersarena_faves_v1";

const sampleData = [
  {
    id: "e1",
    src: "https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg",
    title: "Hackathon Finale",
    date: "2024-12-05",
    location: "LNCT Auditorium",
    desc: "Teams raced to deploy a working MVP in 5 hours. High energy, coffee, and late-night debugging.",
  },
  {
    id: "e2",
    src: "https://cdn.pixabay.com/photo/2022/09/27/19/46/ai-generated-7483596_960_720.jpg",
    title: "AI Showcase",
    date: "2024-11-18",
    location: "Innovation Lab",
    desc: "Student projects demonstrating vision & NLP models — from prototypes to polished demos.",
  },
  {
    id: "e3",
    src: "https://i0.wp.com/www.clicandoeandando.com/wp-content/uploads/2017/09/Como-Fotografar-Paisagens-Com-Lente-Grande-Angular-Ubatuba.jpg",
    title: "Tech Talk: Future of ML",
    date: "2024-10-22",
    location: "Seminar Hall",
    desc: "Guest lecture on model interpretability and ethics — practical tips & Q&A.",
  },
  // add or replace with your images
];
function HeroSlider({ slides = [], interval = 3000, height = 360 }) {
  const [index, setIndex] = useState(slides.length ? 1 : 0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const touchStart = useRef(null);
  const autoplayRef = useRef();

  const cloned = slides.length ? [slides[slides.length - 1], ...slides, slides[0]] : [];

  // ensure container has transition on mount (avoids flicker when jumping)
  useEffect(() => {
    if (containerRef.current) {
      // set smooth GPU-backed transform and preserve 3D
      containerRef.current.style.transition = "transform 450ms ease";
      containerRef.current.style.willChange = "transform";
    }
    // set initial index to 1 if slides exist
    if (slides.length && index === 0) setIndex(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  useEffect(() => {
    autoplayRef.current = () => goNext();
  });

  useEffect(() => {
    if (!isPlaying || !slides.length) return;
    const id = setInterval(() => autoplayRef.current(), interval);
    return () => clearInterval(id);
  }, [isPlaying, interval, slides.length]);

  function handleTransitionEnd() {
    setIsTransitioning(false);
    // defensive checks
    if (!containerRef.current || !cloned.length) return;

    // Jump silently when on clone slides
    if (index === cloned.length - 1) {
      // moved to clone of first -> jump to real first (index 1)
      containerRef.current.style.transition = "none";
      setIndex(1);
      // force reflow then restore transition
      void containerRef.current.offsetWidth;
      containerRef.current.style.transition = "transform 450ms ease";
    } else if (index === 0) {
      // moved to clone of last -> jump to real last
      containerRef.current.style.transition = "none";
      setIndex(cloned.length - 2);
      void containerRef.current.offsetWidth;
      containerRef.current.style.transition = "transform 450ms ease";
    }
  }

  const goPrev = () => {
    if (isTransitioning || !slides.length) return;
    setIsTransitioning(true);
    setIndex((i) => i - 1);
  };
  const goNext = () => {
    if (isTransitioning || !slides.length) return;
    setIsTransitioning(true);
    setIndex((i) => i + 1);
  };

  const goToReal = (i) => {
    if (isTransitioning || !slides.length) return;
    setIsTransitioning(true);
    setIndex(i + 1);
  };

  // pause/play handlers
  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  // touch
  function onTouchStart(ev) { if (!ev.touches?.length) return; touchStart.current = { x: ev.touches[0].clientX, t: Date.now() }; }
  function onTouchEnd(ev) {
    if (!touchStart.current) return;
    const dx = ev.changedTouches[0].clientX - touchStart.current.x;
    const dt = Date.now() - touchStart.current.t;
    if (Math.abs(dx) > 50 && dt < 600) {
      if (dx > 0) goPrev(); else goNext();
    }
    touchStart.current = null;
  }

  // keyboard nav when focused
  function onKeyDown(e) { if (e.key === "ArrowLeft") goPrev(); if (e.key === "ArrowRight") goNext(); }

  // compute transform using translate3d for better GPU rendering
  const transformX = `translate3d(-${index * 100}%, 0, 0)`;

  // keep index in sane bounds if slides change
  useEffect(() => {
    if (!cloned.length) return;
    if (index > cloned.length - 1) setIndex(cloned.length - 2);
    if (index < 0) setIndex(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  return (
    <section
      className="hero-slider"
      style={{ height }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
      onFocus={() => setIsPlaying(false)}
      onBlur={() => setIsPlaying(true)}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label="Featured photos"
    >
      <div className="hs-viewport">
        <div
          className="hs-track"
          ref={containerRef}
          style={{ transform: transformX }}
          onTransitionEnd={handleTransitionEnd}
        >
          {cloned.map((s, idx) => (
            <div className="hs-slide" key={`slide-${idx}-${s?.id || idx}`}>
              <img src={s?.src} alt={s?.title || `Slide ${idx}`} loading="lazy" />
              <div className="hs-caption">
                <h3>{s?.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="hs-btn hs-prev" onClick={goPrev} aria-label="Previous slide">‹</button>
      <button className="hs-btn hs-next" onClick={goNext} aria-label="Next slide">›</button>

      <div className="hs-dots" role="tablist" aria-label="Slide dots">
        {slides.map((s, i) => {
          const active = index === i + 1 || (index === 0 && i === slides.length - 1) || (index === cloned.length - 1 && i === 0);
          return (
            <button
              key={s.id}
              className={`hs-dot ${active ? "active" : ""}`}
              onClick={() => goToReal(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-pressed={active}
            />
          );
        })}
      </div>
    </section>
  );
}


export default function Gallery() {
  const [items, setItems] = useState(sampleData);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Lightbox and other functions are same as before (kept concise here)
  const lbImgRef = useRef(null);
  const lbZoomRef = useRef(false);
  const startTouch = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
      if (e.key === "ArrowRight") nextLightbox();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, items]);

  function toggleFavorite(id) {
    setFavorites((s) => {
      const copy = { ...s };
      if (copy[id]) delete copy[id];
      else copy[id] = true;
      return copy;
    });
  }

  function openLightbox(index) {
    setLightboxIndex(index);
    lbZoomRef.current = false;
    if (document?.activeElement) document.activeElement.blur();
  }

  function closeLightbox() {
    setLightboxIndex(null);
    lbZoomRef.current = false;
    if (lbImgRef.current) {
      lbImgRef.current.style.transform = "";
      lbImgRef.current.style.cursor = "zoom-in";
    }
  }

  function prevLightbox(e) {
    if (e) e.stopPropagation();
    setLightboxIndex((i) => (i === 0 ? items.length - 1 : i - 1));
    lbZoomRef.current = false;
  }
  function nextLightbox(e) {
    if (e) e.stopPropagation();
    setLightboxIndex((i) => (i === items.length - 1 ? 0 : i + 1));
    lbZoomRef.current = false;
  }

  function downloadCurrent() {
    if (lightboxIndex === null) return;
    const url = items[lightboxIndex].src;
    const a = document.createElement("a");
    a.href = url;
    const filename = items[lightboxIndex].title.replace(/\s+/g, "_") + ".jpg";
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function shareCurrent() {
    if (lightboxIndex === null) return;
    const item = items[lightboxIndex];
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.desc,
          url: item.src,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(item.src);
        alert("Image URL copied to clipboard.");
      } catch {
        alert("Share not supported on this browser.");
      }
    }
  }

  function toggleZoom(e) {
    if (!lbImgRef.current) return;
    const img = lbImgRef.current;
    const isZoom = lbZoomRef.current;
    if (!isZoom) {
      const rect = img.getBoundingClientRect();
      const cx = e?.clientX ?? rect.left + rect.width / 2;
      const cy = e?.clientY ?? rect.top + rect.height / 2;
      const offsetX = (cx - rect.left) / rect.width;
      const offsetY = (cy - rect.top) / rect.height;
      img.style.transformOrigin = `${(offsetX * 100).toFixed(2)}% ${(offsetY * 100).toFixed(2)}%`;
      img.style.transform = "scale(2)";
      img.style.cursor = "grab";
      lbZoomRef.current = true;
    } else {
      img.style.transform = "";
      img.style.transformOrigin = "center center";
      img.style.cursor = "zoom-in";
      lbZoomRef.current = false;
      img.style.left = "";
      img.style.top = "";
    }
  }

  function onImgMouseDown(e) {
    if (!lbZoomRef.current) return;
    const img = lbImgRef.current;
    img.style.cursor = "grabbing";
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = parseFloat(img.style.left || 0);
    const startTop = parseFloat(img.style.top || 0);

    function onMove(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      img.style.left = startLeft + dx + "px";
      img.style.top = startTop + dy + "px";
      img.style.position = "relative";
    }
    function onUp() {
      img.style.cursor = "grab";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function onTouchStart(ev) {
    if (!ev.touches?.length) return;
    startTouch.current = { x: ev.touches[0].clientX, y: ev.touches[0].clientY, time: Date.now() };
  }
  function onTouchEnd(ev) {
    if (!startTouch.current) return;
    const endX = ev.changedTouches?.[0]?.clientX ?? 0;
    const dx = endX - startTouch.current.x;
    const dt = Date.now() - startTouch.current.time;
    if (Math.abs(dx) > 40 && dt < 500) {
      if (dx > 0) prevLightbox();
      else nextLightbox();
    }
    startTouch.current = null;
  }

  function preloadNeighbor(index) {
    if (index === null) return;
    const prev = index === 0 ? items.length - 1 : index - 1;
    const next = index === items.length - 1 ? 0 : index + 1;
    [prev, next].forEach((i) => {
      const img = new Image();
      img.src = items[i].src;
    });
  }

  useEffect(() => {
    if (lightboxIndex === null) return;
    preloadNeighbor(lightboxIndex);
  }, [lightboxIndex]);

  return (
    <div className="ga-wrap">
      <header className="ga-header">
        <h1 className="ga-title">Enigma— Event Gallery</h1>
        <p className="ga-sub">Moments from our hackathons, workshops & talks.</p>
      </header>

      {/* HERO SLIDER */}
      <HeroSlider slides={items} interval={3000} height={360} />

      <main className="ga-grid" aria-live="polite">
        {items.map((it, idx) => (
          <article key={it.id} className="ga-card" tabIndex={0} aria-labelledby={`t-${it.id}`}>
            <div className="ga-media" onClick={() => openLightbox(idx)} onKeyDown={(e)=>{ if (e.key==='Enter') openLightbox(idx) }} role="button" tabIndex={0}>
              <img src={it.src} alt={it.title} loading="lazy" className="ga-img" />
            </div>

            <div className="ga-body">
              <div className="ga-headline">
                <h3 id={`t-${it.id}`} className="ga-title-card">{it.title}</h3>
                <button
                  className={`fav ${favorites[it.id] ? "fav-on" : ""}`}
                  aria-pressed={!!favorites[it.id]}
                  aria-label={favorites[it.id] ? "Remove favorite" : "Add to favorites"}
                  onClick={() => toggleFavorite(it.id)}
                >
                  ♥
                </button>
              </div>

              <div className="ga-meta">
                <span className="ga-date">{new Date(it.date).toLocaleDateString()}</span>
                <span className="ga-dot">•</span>
                <span className="ga-loc">{it.location}</span>
              </div>

              <p className="ga-desc">{it.desc}</p>

              <div className="ga-actions">
                <button className="btn" onClick={() => openLightbox(idx)} aria-label={`View ${it.title}`}>View</button>
                <a className="btn btn-ghost" href={it.src} target="_blank" rel="noreferrer">Open image</a>
              </div>
            </div>
          </article>
        ))}
      </main>

      {lightboxIndex !== null && (
        <div
          className="lb-overlay"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lb-close" onClick={closeLightbox} aria-label="Close (Esc)">&times;</button>

            <button className="lb-nav lb-prev" onClick={prevLightbox} aria-label="Previous image">&#10094;</button>
            <div className="lb-body">
              <div className="lb-image-wrap">
                <img
                  ref={lbImgRef}
                  src={items[lightboxIndex].src}
                  alt={items[lightboxIndex].title}
                  className="lb-image"
                  onDoubleClick={(e) => toggleZoom(e)}
                  onMouseDown={(e) => onImgMouseDown(e)}
                  onClick={(e) => toggleZoom(e)}
                />
              </div>

              <div className="lb-info">
                <h2>{items[lightboxIndex].title}</h2>
                <div className="lb-meta">
                  <span>{new Date(items[lightboxIndex].date).toLocaleDateString()}</span>
                  <span> • </span>
                  <span>{items[lightboxIndex].location}</span>
                </div>
                <p className="lb-desc">{items[lightboxIndex].desc}</p>

                <div className="lb-controls">
                  <button className="btn" onClick={downloadCurrent} aria-label="Download image">Download</button>
                  <button className="btn" onClick={shareCurrent} aria-label="Share image">Share</button>
                  <button className="btn btn-ghost" onClick={() => toggleZoom() } aria-label="Toggle zoom">Toggle zoom</button>
                </div>
              </div>
            </div>

            <button className="lb-nav lb-next" onClick={nextLightbox} aria-label="Next image">&#10095;</button>
          </div>
        </div>
      )}
    </div>
  );
}
