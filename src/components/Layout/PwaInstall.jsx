'use client';
import { useEffect, useState } from 'react';

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner,     setShowBanner]     = useState(false);
  const [isIos,          setIsIos]          = useState(false);
  const [dismissed,      setDismissed]      = useState(false);

  useEffect(() => {
    // Verifica se já está instalado (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone;
    if (isStandalone) return;

    // Detecta iOS (não tem beforeinstallprompt)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    if (ios) {
      const dismissed = sessionStorage.getItem('pwa-ios-dismissed');
      if (!dismissed) { setIsIos(true); setShowBanner(true); }
      return;
    }

    // Android / Chrome / Edge: listener do evento nativo
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const wasDismissed = sessionStorage.getItem('pwa-dismissed');
      if (!wasDismissed) setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIos) { dismiss(); return; }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowBanner(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    sessionStorage.setItem(isIos ? 'pwa-ios-dismissed' : 'pwa-dismissed', '1');
    setShowBanner(false);
    setDismissed(true);
  };

  if (!showBanner || dismissed) return null;

  return (
    <div className="pwa-banner">
      <div className="pwa-icon">⛽</div>
      <div className="pwa-text">
        <strong>Instalar Fuel Watch</strong>
        {isIos
          ? <span>Toque em <strong>⬆ Compartilhar</strong> → <strong>Adicionar à Tela de Início</strong></span>
          : <span>Instale o app no seu celular para acesso rápido e offline!</span>
        }
      </div>
      {!isIos && (
        <button className="pwa-btn" onClick={handleInstall}>📲 Instalar</button>
      )}
      <button className="pwa-close" onClick={dismiss} aria-label="Fechar">✕</button>
    </div>
  );
}
