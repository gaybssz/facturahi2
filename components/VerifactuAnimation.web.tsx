// Web-only animation that mirrors your Next.js snippet using
// framer-motion + lucide-react, but with inline styles instead of Tailwind.
// Requires: npm i framer-motion lucide-react
import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, FilePlus2, ShoppingCart, Send, FileText, Fingerprint } from 'lucide-react';

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const clients = [
  { name: 'Tech Solutions Ltd.', initials: 'TS' },
  { name: 'Innovate Corp.', initials: 'IC' },
  { name: 'Creative Minds', initials: 'CM' },
];

const products = [
  { name: 'Servicio de Consultoría', price: '€1,000.00' },
  { name: 'Diseño de Logo', price: '€250.00' },
];

const verificationSteps = [
  { text: 'Generando XML (Factura-E)', icon: FileText },
  { text: 'Aplicando firma digital', icon: Fingerprint },
  { text: 'Enviando a la Agencia Tributaria', icon: Send },
];

export default function VerifactuAnimation() {
  const [step, setStep] = useState(0);
  const [key, setKey] = useState(0);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  useEffect(() => {
    const delays = [
      500, 1000, 500, 1000, 500, 1000, 500, 1000, 1000,
      400, 400, 400, 500, 1000, 500, 1500, 1500, 1500, 5000,
    ];
    if (step >= delays.length) {
      setKey((p) => p + 1);
      setStep(0);
      setSelectedTemplate(null);
    } else {
      const t = setTimeout(() => setStep((s) => s + 1), delays[step]);
      return () => clearTimeout(t);
    }
  }, [step, key]);

  useEffect(() => {
    let timer: any;
    if (step >= 9 && step < 12) {
      timer = setTimeout(() => setTemplateIndex((p) => (p + 1) % 4), 500);
    }
    if (step === 12) setSelectedTemplate(templateIndex);
    return () => timer && clearTimeout(timer);
  }, [step, templateIndex]);

  const mouseVariants: any = {
    initial: { top: '60%', left: '80%', opacity: 0 },
    step1: { top: '50%', left: '50%', opacity: 1, x: '-50%', y: '-50%', scale: 1, transition: { duration: 0.8 } },
    step2: { scale: 0.9, transition: { duration: 0.2 } },
    step3: { top: '32%', left: '50%', scale: 1, transition: { duration: 0.8 } },
    step4: { scale: 0.9, transition: { duration: 0.2 } },
    step5: { top: '52%', left: '50%', scale: 1, transition: { duration: 0.8 } },
    step6: { scale: 0.9, transition: { duration: 0.2 } },
    step7: { top: '72%', left: '50%', scale: 1, transition: { duration: 0.8 } },
    step8: { opacity: 0, transition: { duration: 0.3 } },
    step9: { top: '45%', left: '15%', opacity: 1, transition: { duration: 0.5 } },
    step10: { top: '45%', left: '38%', transition: { duration: 0.5 } },
    step11: { top: '45%', left: '62%', transition: { duration: 0.5 } },
    step12: { scale: 0.9, transition: { duration: 0.2 } },
    step13: { top: '80%', left: '50%', scale: 1, transition: { duration: 0.8 } },
    step14: { scale: 0.9, transition: { duration: 0.2 } },
    step15: { opacity: 0, transition: { duration: 0.5 } },
  };
  const getMouseAnimationState = () => (step >= 15 ? 'step15' : `step${step}`);

  const sceneTransition = { duration: 0.5, ease: 'easeInOut' as const };
  const motionProps = useMemo(
    () => ({ initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.98 }, transition: sceneTransition }),
    []
  );

  return (
    <div style={styles.root}>
      <div key={key} style={styles.inner}>
        <AnimatePresence mode="wait">
          {step < 9 && (
            <motion.div key="form" {...motionProps} style={styles.formScene}>
              {step < 2 && (
                <motion.div key="create-button" {...motionProps} style={styles.centerRow}>
                  <div style={styles.primaryButton}>
                    <FilePlus2 size={20} />
                    <span style={styles.primaryButtonText}>Crear Nueva Factura</span>
                  </div>
                </motion.div>
              )}
              <div style={styles.formCard(step >= 4)}>
                <h4 style={styles.formTitle}>1. Seleccionar Cliente</h4>
                {step < 4 ? (
                  <div style={{ display: 'grid', gap: 6 }}>
                    {clients.slice(0, 2).map((c, i) => (
                      <div key={c.name} style={styles.clientRow(step === 3 && i === 1)}>
                        <div style={styles.clientAvatar}>{c.initials}</div>
                        <span style={styles.clientText}>{c.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.selectedBox}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={styles.clientAvatar}>IC</div>
                      <span style={styles.clientText}>Innovate Corp.</span>
                    </div>
                    <Check size={18} color="#16a34a" />
                  </motion.div>
                )}
              </div>

              <div style={styles.formCard(step >= 6)}>
                <h4 style={styles.formTitle}>2. Seleccionar Producto(s)</h4>
                {step < 6 ? (
                  <div style={{ display: 'grid', gap: 6 }}>
                    {products.slice(0, 1).map((p, i) => (
                      <div key={p.name} style={styles.productRow(step === 5 && i === 0)}>
                        <div style={styles.productIcon}><ShoppingCart size={18} color="#6b7280" /></div>
                        <div style={{ flex: 1 }}><span style={styles.clientText}>{p.name}</span></div>
                        <div style={styles.price}>{p.price}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.selectedBox}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={styles.productIcon}><ShoppingCart size={18} color="#6b7280" /></div>
                      <span style={styles.clientText}>Servicio de Consultoría</span>
                    </div>
                    <Check size={18} color="#16a34a" />
                  </motion.div>
                )}
              </div>

              <div style={styles.formCard(false)}>
                <h4 style={styles.formTitle}>3. Importe</h4>
                {step < 8 ? (
                  <div style={styles.amountRow(step === 7)}>
                    <span style={styles.amountFaded}>1,000.00 €</span>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.selectedBox}>
                    <span style={styles.amountFinal}>1,000.00 €</span>
                    <Check size={18} color="#16a34a" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step >= 9 && step < 15 && (
          <motion.div key="template-scene" {...motionProps} style={styles.centerCol}>
            <div style={styles.templatesRow}>
              {['Clásico', 'Moderno', 'Creativo', 'Minimalista'].map((n, i) => (
                <TemplatePreview key={n} name={n} isActive={step >= 9 && step <= 11 && templateIndex === i} isSelected={selectedTemplate === i} />
              ))}
            </div>
            {step >= 12 && (
              <motion.div key="emit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, scale: step === 13 ? 1.05 : 1 }}>
                <div style={styles.emitBtn(step >= 14)}>
                  <Send size={18} />
                  <span>Emitir VERI*FACTU</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {step >= 15 && (
          <motion.div key="verification" {...motionProps} style={styles.verifyWrap}>
            <h3 style={{ fontSize: 18, fontWeight: 700, textAlign: 'center' }}>Procesando Factura...</h3>
            <div style={{ display: 'grid', gap: 10, width: '100%', paddingTop: 8 }}>
              {verificationSteps.map((v, idx) => (
                <motion.div key={v.text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: step > 15 + idx ? 0.3 : 1, x: 0 }} style={styles.verifyRow}> 
                  <div style={step > 15 + idx ? styles.verifyIconOk : styles.verifyIconIdle}>
                    {step > 15 + idx ? <Check size={16} color="#fff" /> : React.createElement(v.icon, { size: 16, color: '#6b7280' })}
                  </div>
                  <span style={{ fontWeight: 500, color: step > 15 + idx ? '#9ca3af' : '#374151' }}>{v.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div className="mouse" variants={mouseVariants as any} initial="initial" animate={getMouseAnimationState()} style={styles.mouseWrap as any}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
            <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51Z" fill="#fff" stroke="#000" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

function TemplatePreview({ name, isActive, isSelected }: { name: string; isActive: boolean; isSelected: boolean }) {
  return (
    <div style={styles.templateCol as any}>
      <div style={styles.templateTile(isSelected, isActive)} />
      <span style={{ fontSize: 12, fontWeight: 600, color: isSelected || isActive ? '#0a7ea4' : '#6b7280' }}>{name}</span>
    </div>
  );
}

const styles = {
  root: {
    position: 'relative' as const,
    width: 500,
    height: 300,
    borderRadius: 16,
    background: '#f3f4f6',
    border: '1px solid #d1d5db',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  inner: { position: 'relative' as const, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  formScene: { width: '100%', maxWidth: 420, display: 'grid', gap: 8 },
  centerRow: { display: 'flex', justifyContent: 'center' },
  primaryButton: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 12, background: '#0a7ea4', color: '#fff', fontWeight: 600, boxShadow: '0 8px 20px rgba(10,126,164,0.25)' },
  primaryButtonText: { fontSize: 16, fontWeight: 600 },
  formCard: (dim: boolean) => ({ padding: 8, background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)', opacity: dim ? 0.6 : 1 }),
  formTitle: { fontWeight: 600, color: '#6b7280', marginBottom: 6, fontSize: 12 },
  clientRow: (active: boolean) => ({ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 8, background: active ? 'rgba(10,126,164,0.12)' : undefined }),
  clientAvatar: { width: 32, height: 32, borderRadius: 16, background: '#d1d5db', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 } as React.CSSProperties,
  clientText: { fontSize: 13, color: '#111' },
  productRow: (active: boolean) => ({ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 8, background: active ? 'rgba(10,126,164,0.12)' : undefined }),
  productIcon: { width: 28, height: 28, borderRadius: 14, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  price: { fontSize: 12, color: '#6b7280' },
  selectedBox: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 8 },
  amountRow: (active: boolean) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderRadius: 8, background: active ? 'rgba(10,126,164,0.12)' : undefined }),
  amountFaded: { fontWeight: 700, fontSize: 16, color: '#9ca3af' },
  amountFinal: { fontWeight: 700, fontSize: 16, color: '#111' },
  centerCol: { width: '100%', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 24 },
  templatesRow: { display: 'flex', gap: 16, alignItems: 'flex-start', justifyContent: 'center' },
  templateCol: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8 },
  templateTile: (selected: boolean | null, active: boolean) => ({ width: 80, height: 112, borderRadius: 8, background: '#fff', border: `2px solid ${selected ? '#34d399' : active ? '#0a7ea4' : '#e5e7eb'}`, boxShadow: active ? '0 12px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.05)' }),
  emitBtn: (pressed: boolean) => ({ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: pressed ? '#15803d' : '#16a34a', color: '#fff', fontWeight: 600, boxShadow: '0 8px 20px rgba(22,163,74,0.25)' }),
  verifyWrap: { textAlign: 'center' as const, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 12, color: '#374151', width: '100%', maxWidth: 420 },
  verifyRow: { display: 'flex', alignItems: 'center', gap: 10 },
  verifyIconIdle: { width: 28, height: 28, borderRadius: 14, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  verifyIconOk: { width: 28, height: 28, borderRadius: 14, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  verifyText: { fontSize: 14, color: '#374151' },
  mouseWrap: { position: 'absolute', zIndex: 10 } as React.CSSProperties,
};

