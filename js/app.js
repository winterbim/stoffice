/* ═══════════════════════════════════════════════════════
   STOFFICE v5.0 — Logic + i18n (DE/FR)
   Smart Building AI Calculator
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ═══════ i18n DICTIONARIES ═══════ */
    const I18N = {
        de: {
            title: 'Smart Building AI\nKostenrechner',
            subtitle: 'Berechnen Sie Einsparungen durch KI-gestützte Gebäudeautomation',
            inputVariables: 'Eingabevariablen',
            daysPerYear: 'Arbeitstage / Jahr',
            unitDays: 'T',
            incidentsPerDay: 'Vorfälle / Tag',
            minutesPerIncident: 'Minuten / Vorfall',
            hourlyRate: 'Stundensatz (CHF)',
            costAI: 'Kosten der AI-Lösung (CHF / Jahr)',
            optimizationFactors: 'Optimierungsfaktoren',
            digitalTwin: 'Digitaler Zwilling vorhanden',
            digitalTwinTip: 'Ein digitaler Zwilling ermöglicht die grösste Effizienzsteigerung durch automatisierte Fehlererkennung und Priorisierung. Einsparungspotenzial: ~75 %',
            assetsLinked: 'Anlagen im digitalen Zwilling',
            assetsLinkedTip: 'Verknüpfung von Anlagen mit dem digitalen Zwilling für automatische Zuordnung und Status-Tracking. Einsparungspotenzial: ~10 %',
            docUpToDate: 'Dokumentation immer aktuell',
            docUpToDateTip: 'Aktuelle Dokumentation reduziert Suchzeiten und Fehler bei der Vorfallbearbeitung. Einsparungspotenzial: ~5 %',
            autoOrders: 'Automatisierte Auftragserstellung',
            autoOrdersTip: 'Automatische Erstellung von Arbeitsaufträgen basierend auf erkannten Vorfällen. Einsparungspotenzial: ~10 %',
            totalOptimization: 'Gesamtoptimierung',
            reset: 'Zurücksetzen',
            calculate: 'Berechnen',
            results: 'Ergebnisse',
            placeholderTitle: 'Aktivieren Sie Optimierungen',
            placeholderSub: 'Die Ergebnisse werden in Echtzeit berechnet',

            heroEyebrow: 'Jährliche Nettoeinsparung',
            currentCosts: 'Aktuelle Kosten',
            optimizedCosts: 'Optimierte Kosten',
            timeSaved: 'Zeitersparnis',
            hoursPerYear: 'Std. / Jahr',
            hours: 'Std.',
            workdays: 'Arbeitstage',
            optimization: 'Optimierung',
            perYear: '/ Jahr',

            chartCurrent: 'Aktuell',
            chartOptimized: 'Optimiert',
            chartAI: 'AI-Investition',
            chartLabel: 'CHF / Jahr',

            breakdown: 'Aufschlüsselung',
            digitalTwinFactor: 'Digitaler Zwilling',
            assetsLinkedFactor: 'Anlagen verknüpft',
            docFactor: 'Aktuelle Dokumentation',
            autoFactor: 'Auto. Aufträge',
            aiInvestment: 'AI-Investition',

            roi: 'Return on Investment',
            roiLabel: 'ROI',
            paybackPeriod: 'Amortisation',
            investment: 'Investition',
            netProfit: 'Netto-Gewinn',
            month: 'Monat',
            months: 'Monate',
            years: 'Jahre',

            copyright: '© 2025–2026 Stoffice / Simone J. Stocker – MAS Real Estate',
            disclaimer: 'Alle Angaben ohne Gewähr. Werte dienen zur Veranschaulichung & Testzwecken.',
            sidebarVersion: 'v5.0 – CAS These HWZ 2026',
            toastReset: 'Formular zurückgesetzt',
            toastExport: 'Druckvorschau wird geöffnet…',
            toastLangDE: 'Sprache: Deutsch',
            toastLangFR: 'Langue : Français',
            toastDarkOn: 'Dark Mode aktiviert',
            toastDarkOff: 'Light Mode aktiviert',
        },

        fr: {
            title: 'Calculateur Smart Building\nIA',
            subtitle: 'Calculez les économies grâce à l\'automatisation intelligente des bâtiments',
            inputVariables: 'Variables d\'entrée',
            daysPerYear: 'Jours ouvrables / an',
            unitDays: 'J',
            incidentsPerDay: 'Incidents / jour',
            minutesPerIncident: 'Minutes / incident',
            hourlyRate: 'Taux horaire (CHF)',
            costAI: 'Coût de la solution IA (CHF / an)',
            optimizationFactors: 'Facteurs d\'optimisation',
            digitalTwin: 'Jumeau numérique disponible',
            digitalTwinTip: 'Un jumeau numérique permet la plus grande amélioration de l\'efficacité grâce à la détection automatisée des erreurs et à la priorisation. Potentiel d\'économie : ~75 %',
            assetsLinked: 'Équipements dans le jumeau numérique',
            assetsLinkedTip: 'Liaison des équipements avec le jumeau numérique pour l\'attribution automatique et le suivi d\'état. Potentiel d\'économie : ~10 %',
            docUpToDate: 'Documentation toujours à jour',
            docUpToDateTip: 'Une documentation à jour réduit les temps de recherche et les erreurs lors du traitement des incidents. Potentiel d\'économie : ~5 %',
            autoOrders: 'Création automatisée d\'ordres',
            autoOrdersTip: 'Création automatique d\'ordres de travail basée sur les incidents détectés. Potentiel d\'économie : ~10 %',
            totalOptimization: 'Optimisation totale',
            reset: 'Réinitialiser',
            calculate: 'Calculer',
            results: 'Résultats',
            placeholderTitle: 'Activez les optimisations',
            placeholderSub: 'Les résultats sont calculés en temps réel',

            heroEyebrow: 'Économie nette annuelle',
            currentCosts: 'Coûts actuels',
            optimizedCosts: 'Coûts optimisés',
            timeSaved: 'Temps économisé',
            hoursPerYear: 'h / an',
            hours: 'h',
            workdays: 'jours ouvrables',
            optimization: 'Optimisation',
            perYear: '/ an',

            chartCurrent: 'Actuel',
            chartOptimized: 'Optimisé',
            chartAI: 'Investissement IA',
            chartLabel: 'CHF / an',

            breakdown: 'Ventilation détaillée',
            digitalTwinFactor: 'Jumeau numérique',
            assetsLinkedFactor: 'Équipements liés',
            docFactor: 'Documentation à jour',
            autoFactor: 'Ordres automatiques',
            aiInvestment: 'Investissement IA',

            roi: 'Retour sur investissement',
            roiLabel: 'RSI',
            paybackPeriod: 'Amortissement',
            investment: 'Investissement',
            netProfit: 'Bénéfice net',
            month: 'mois',
            months: 'mois',
            years: 'ans',

            copyright: '© 2025–2026 Stoffice / Simone J. Stocker – MAS Real Estate',
            disclaimer: 'Sans garantie. Les valeurs servent uniquement à des fins d\'illustration et de test.',
            sidebarVersion: 'v5.0 – CAS Thèse HWZ 2026',
            toastReset: 'Formulaire réinitialisé',
            toastExport: 'Aperçu d\'impression en cours…',
            toastLangDE: 'Sprache: Deutsch',
            toastLangFR: 'Langue : Français',
            toastDarkOn: 'Mode sombre activé',
            toastDarkOff: 'Mode clair activé',
        }
    };

    /* ═══════ STATE ═══════ */
    let currentLang = 'de';
    let barChart = null;
    let donutChart = null;

    /* ═══════ OPTIMIZATION MAP ═══════ */
    const OPT = {
        optZwilling: { pct: 0.75, key: 'digitalTwinFactor', color: '#1a6b5a' },
        optAssets:   { pct: 0.10, key: 'assetsLinkedFactor', color: '#2d8f7b' },
        optDoku:     { pct: 0.05, key: 'docFactor',          color: '#6d28d9' },
        optAuto:     { pct: 0.10, key: 'autoFactor',         color: '#b8860b' },
    };

    const DEFAULTS = {
        daysPerYear: 250, incidentsPerDay: 30, minutesPerIncident: 48,
        hourlyRate: 85, costAI: 0,
        optZwilling: false, optAssets: false, optDoku: false, optAuto: false,
    };

    /* ═══════ DOM ═══════ */
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);
    const D = {};

    function cacheDom() {
        D.form       = $('#calculation-form');
        D.content    = $('#results-content');
        D.placeholder= $('#resultsPlaceholder');
        D.hero       = $('#heroMetric');
        D.metrics    = $('#metricsRow');
        D.detailed   = $('#detailedResults');
        D.roi        = $('#roiSection');
        D.resetBtn   = $('#resetBtn');
        D.darkToggle = $('#darkModeToggle');
        D.darkIcon   = $('#darkModeIcon');
        D.exportBtn  = $('#exportPdf');
        D.meter      = $('#savingsBarContainer');
        D.meterFill  = $('#savingsBarFill');
        D.meterPct   = $('#savingsBarPercent');
        D.toasts     = $('#toastContainer');
        D.tooltip    = $('#customTooltip');
        D.langBtns   = $$('[data-lang-btn]');
    }

    /* ═══════ INIT ═══════ */
    function init() {
        cacheDom();
        loadTheme();
        loadLang();
        loadFormState();
        bindEvents();
        calc();
    }

    /* ═══════ i18n ═══════ */
    function t(k) { return I18N[currentLang]?.[k] ?? I18N.de[k] ?? k; }

    function applyI18n() {
        $$('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const txt = t(key);
            if (key === 'title') {
                el.innerHTML = txt.replace('\n', '<br>');
            } else {
                el.textContent = txt;
            }
        });
        document.documentElement.lang = currentLang;
        document.title = 'Stoffice | Smart Building AI';
    }

    function setLang(lang) {
        currentLang = lang;
        document.documentElement.dataset.lang = lang;
        localStorage.setItem('stoffice-lang', lang);
        D.langBtns.forEach(b => b.classList.toggle('active', b.dataset.langBtn === lang));
        applyI18n();
        calc();
    }

    function loadLang() {
        const s = localStorage.getItem('stoffice-lang');
        if (s && I18N[s]) currentLang = s;
        setLang(currentLang);
    }

    /* ═══════ DARK MODE ═══════ */
    function toggleTheme() {
        const isDark = document.documentElement.dataset.theme === 'dark';
        const next = isDark ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        D.darkIcon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        localStorage.setItem('stoffice-theme', next);
        toast(isDark ? t('toastDarkOff') : t('toastDarkOn'));
        calc();
    }

    function loadTheme() {
        const s = localStorage.getItem('stoffice-theme');
        if (s) {
            document.documentElement.dataset.theme = s;
            D.darkIcon.className = s === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }

    /* ═══════ TOAST ═══════ */
    function toast(msg) {
        const el = document.createElement('div');
        el.className = 'toast';
        el.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
        D.toasts.appendChild(el);
        setTimeout(() => { el.classList.add('toast-exit'); setTimeout(() => el.remove(), 250); }, 2200);
    }

    /* ═══════ TOOLTIP ═══════ */
    function showTip(trigger, text) {
        D.tooltip.textContent = text;
        D.tooltip.classList.add('visible');
        const r = trigger.getBoundingClientRect();
        const tt = D.tooltip.getBoundingClientRect();
        let left = r.left + r.width / 2 - tt.width / 2;
        let top = r.bottom + 8;
        if (left < 8) left = 8;
        if (left + tt.width > innerWidth - 8) left = innerWidth - tt.width - 8;
        if (top + tt.height > innerHeight - 8) top = r.top - tt.height - 8;
        D.tooltip.style.left = left + 'px';
        D.tooltip.style.top = top + 'px';
    }

    function hideTip() { D.tooltip.classList.remove('visible'); }

    /* ═══════ FORM STATE ═══════ */
    function vals() {
        return {
            daysPerYear:        +$('#daysPerYear').value || 0,
            incidentsPerDay:    +$('#incidentsPerDay').value || 0,
            minutesPerIncident: +$('#minutesPerIncident').value || 0,
            hourlyRate:         +$('#hourlyRate').value || 0,
            costAI:             +$('#costAI').value || 0,
            optZwilling: $('#optZwilling').checked,
            optAssets:   $('#optAssets').checked,
            optDoku:     $('#optDoku').checked,
            optAuto:     $('#optAuto').checked,
        };
    }

    function saveForm() { localStorage.setItem('stoffice-form', JSON.stringify(vals())); }

    function loadFormState() {
        try {
            const s = localStorage.getItem('stoffice-form');
            if (!s) return;
            const d = JSON.parse(s);
            ['daysPerYear','incidentsPerDay','minutesPerIncident','hourlyRate','costAI'].forEach(k => {
                const el = document.getElementById(k);
                if (el && d[k] !== undefined) el.value = d[k];
            });
            ['optZwilling','optAssets','optDoku','optAuto'].forEach(k => {
                const el = document.getElementById(k);
                if (el && d[k] !== undefined) el.checked = d[k];
            });
        } catch (e) { /* ignore */ }
    }

    function resetForm() {
        Object.entries(DEFAULTS).forEach(([k, v]) => {
            const el = document.getElementById(k);
            if (!el) return;
            if (typeof v === 'boolean') el.checked = v; else el.value = v;
        });
        localStorage.removeItem('stoffice-form');
        calc();
        toast(t('toastReset'));
    }

    /* ═══════ FORMAT ═══════ */
    function fmtCHF(n) {
        return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n);
    }
    function fmtN(n) { return new Intl.NumberFormat('de-CH').format(Math.round(n)); }

    /* ═══════ COUNTER ═══════ */
    function countUp(el, target, formatter) {
        if (!el) return;
        const dur = 600;
        const t0 = performance.now();
        (function tick(now) {
            const p = Math.min((now - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            el.textContent = formatter(Math.round(target * ease));
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = formatter(target);
        })(t0);
    }

    /* ═══════ DEBOUNCE ═══════ */
    function debounce(fn, ms) {
        let timer;
        return function () { clearTimeout(timer); timer = setTimeout(fn, ms); };
    }

    /* ═══════ EVENTS ═══════ */
    function bindEvents() {
        const auto = debounce(() => { saveForm(); calc(); }, 100);

        D.form.querySelectorAll('input').forEach(inp => {
            inp.addEventListener('input', auto);
            inp.addEventListener('change', () => { saveForm(); calc(); });
        });

        D.form.addEventListener('submit', e => { e.preventDefault(); calc(); });
        D.resetBtn.addEventListener('click', resetForm);
        D.darkToggle.addEventListener('click', toggleTheme);

        D.exportBtn.addEventListener('click', () => {
            toast(t('toastExport'));
            setTimeout(() => print(), 350);
        });

        // Language
        D.langBtns.forEach(btn => btn.addEventListener('click', () => {
            const lang = btn.dataset.langBtn;
            if (lang !== currentLang) {
                setLang(lang);
                toast(lang === 'fr' ? t('toastLangFR') : t('toastLangDE'));
            }
        }));

        // Tooltips
        $$('.toggle-tooltip-trigger').forEach(tr => {
            const key = tr.dataset.tooltipKey;
            tr.addEventListener('mouseenter', e => { e.stopPropagation(); showTip(tr, t(key)); });
            tr.addEventListener('mouseleave', hideTip);
            tr.addEventListener('focus', () => showTip(tr, t(key)));
            tr.addEventListener('blur', hideTip);
            tr.addEventListener('click', e => e.preventDefault());
        });

        document.addEventListener('keydown', e => { if (e.key === 'Escape') hideTip(); });
    }

    /* ═══════════════════════════════════
       CALCULATION ENGINE
       ═══════════════════════════════════ */
    function calc() {
        const v = vals();
        if (v.daysPerYear <= 0 || v.incidentsPerDay <= 0 || v.minutesPerIncident <= 0 || v.hourlyRate <= 0) {
            showPlaceholder(); updateMeter(0); return;
        }

        const hrsDay  = (v.incidentsPerDay * v.minutesPerIncident) / 60;
        const hrsYear = hrsDay * v.daysPerYear;
        const costNow = hrsYear * v.hourlyRate;

        const active = [];
        let totalPct = 0;
        Object.entries(OPT).forEach(([k, o]) => {
            if (v[k]) { active.push({ ...o, k }); totalPct += o.pct; }
        });
        totalPct = Math.min(totalPct, 1);

        const gross   = costNow * totalPct;
        const net     = gross - v.costAI;
        const costNew = costNow - net;
        const hrsNew  = hrsYear * (1 - totalPct);
        const roiPct  = v.costAI > 0 ? (net / v.costAI) * 100 : 0;
        const payback = (v.costAI > 0 && gross > 0) ? Math.ceil((v.costAI / gross) * 12) : 0;

        updateMeter(totalPct);

        if (active.length === 0) { showPlaceholder(); return; }

        hidePlaceholder();
        renderSavings(net, totalPct);
        renderDataStrip(costNow, costNew, hrsYear, hrsNew);
        renderBarChart(costNow, costNew, v.costAI);
        renderDonut(active, costNow);
        renderBreakdown(active, costNow, v.costAI);
        renderROI(roiPct, payback, v.costAI, net);
    }

    function showPlaceholder() { D.placeholder.style.display = 'flex'; D.content.classList.add('hidden'); }
    function hidePlaceholder() { D.placeholder.style.display = 'none';  D.content.classList.remove('hidden'); }

    function updateMeter(pct) {
        const p = Math.round(pct * 100);
        D.meterFill.style.width = p + '%';
        D.meterPct.textContent = p + ' %';
        D.meter.classList.toggle('active', p > 0);
    }

    /* ═══════ SAVINGS DISPLAY ═══════ */
    function renderSavings(net, pct) {
        D.hero.innerHTML =
            '<div class="savings-display">' +
                '<span class="savings-eyebrow">' + t('heroEyebrow') + '</span>' +
                '<span class="savings-amount" id="heroValue"></span>' +
                '<span class="savings-tag">' +
                    '<span class="badge">' +
                        '<i class="fa-solid fa-arrow-down"></i> ' +
                        Math.round(pct * 100) + ' % ' + t('optimization') +
                    '</span>' +
                    '&nbsp; ' + t('perYear') +
                '</span>' +
            '</div>';
        countUp($('#heroValue'), Math.round(net), fmtCHF);
    }

    /* ═══════ DATA STRIP ═══════ */
    function renderDataStrip(costNow, costNew, hrsNow, hrsNew) {
        D.metrics.innerHTML =
            '<div class="datum">' +
                '<span class="datum-value" id="dCostNow"></span>' +
                '<span class="datum-label">' + t('currentCosts') + '</span>' +
            '</div>' +
            '<div class="datum">' +
                '<span class="datum-value" id="dCostNew"></span>' +
                '<span class="datum-label">' + t('optimizedCosts') + '</span>' +
            '</div>' +
            '<div class="datum">' +
                '<span class="datum-value" id="dHours"></span>' +
                '<span class="datum-label">' + t('timeSaved') + ' (' + fmtN((hrsNow - hrsNew) / 8) + ' ' + t('workdays') + ')</span>' +
            '</div>';
        countUp($('#dCostNow'), Math.round(costNow), fmtCHF);
        countUp($('#dCostNew'), Math.round(costNew), fmtCHF);
        countUp($('#dHours'),   Math.round(hrsNow - hrsNew), n => fmtN(n) + ' ' + t('hours'));
    }

    /* ═══════ BAR CHART ═══════ */
    function renderBarChart(costNow, costNew, costAI) {
        const dark = document.documentElement.dataset.theme === 'dark';
        const txt  = dark ? '#807f79' : '#767676';
        const grid = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

        const canvas = $('#barChart');
        if (barChart) barChart.destroy();

        const labels = [t('chartCurrent'), t('chartOptimized')];
        const data   = [costNow, Math.max(0, costNew)];
        const bg     = [
            dark ? 'rgba(196,65,65,0.2)' : 'rgba(196,65,65,0.08)',
            dark ? 'rgba(26,107,90,0.2)' : 'rgba(26,107,90,0.08)'
        ];
        const border = ['#c44141', '#1a6b5a'];

        if (costAI > 0) {
            labels.push(t('chartAI'));
            data.push(costAI);
            bg.push(dark ? 'rgba(184,134,11,0.2)' : 'rgba(184,134,11,0.08)');
            border.push('#b8860b');
        }

        barChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: t('chartLabel'), data: data,
                    backgroundColor: bg, borderColor: border,
                    borderWidth: 2, borderRadius: 4, borderSkipped: false
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: { label: function (c) { return fmtCHF(c.raw); } },
                        backgroundColor: dark ? '#1c1c1a' : '#fff',
                        titleColor: txt, bodyColor: txt,
                        borderColor: dark ? '#2d2d2a' : '#dddcd8', borderWidth: 1, padding: 10,
                        titleFont: { family: 'Outfit', weight: '700', size: 12 },
                        bodyFont:  { family: 'Outfit', size: 12 },
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true, grid: { color: grid },
                        ticks: { color: txt, font: { family: 'Outfit', weight: '600', size: 10 }, callback: function (v) { return fmtCHF(v); } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: txt, font: { family: 'Outfit', weight: '700', size: 11 } }
                    }
                },
                animation: { duration: 600, easing: 'easeOutQuart' }
            }
        });
    }

    /* ═══════ DONUT CHART ═══════ */
    function renderDonut(active, costNow) {
        const dark = document.documentElement.dataset.theme === 'dark';
        const txt  = dark ? '#807f79' : '#767676';

        const canvas = $('#donutChart');
        if (donutChart) donutChart.destroy();

        const labels = active.map(function (s) { return t(s.key); });
        const data   = active.map(function (s) { return Math.round(costNow * s.pct); });
        const colors = active.map(function (s) { return s.color; });

        donutChart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.map(function (c) { return c + (dark ? '40' : '22'); }),
                    borderColor: colors,
                    borderWidth: 2, hoverOffset: 5
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: true, cutout: '62%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: txt, padding: 12, usePointStyle: true, pointStyleWidth: 8,
                            font: { family: 'Outfit', weight: '600', size: 10 }
                        }
                    },
                    tooltip: {
                        callbacks: { label: function (c) { return c.label + ': ' + fmtCHF(c.raw); } },
                        backgroundColor: dark ? '#1c1c1a' : '#fff',
                        titleColor: txt, bodyColor: txt,
                        borderColor: dark ? '#2d2d2a' : '#dddcd8', borderWidth: 1, padding: 10,
                        titleFont: { family: 'Outfit', weight: '700', size: 12 },
                        bodyFont:  { family: 'Outfit', size: 12 },
                    }
                },
                animation: { animateRotate: true, duration: 700 }
            }
        });
    }

    /* ═══════ BREAKDOWN ═══════ */
    function renderBreakdown(active, costNow, costAI) {
        var html = '<h3 class="breakdown-title">' + t('breakdown') + '</h3>';

        active.forEach(function (s, i) {
            var amt = costNow * s.pct;
            html += '<div class="breakdown-row" style="animation-delay:' + (i * 40) + 'ms">' +
                '<span class="breakdown-left">' + t(s.key) + ' (' + Math.round(s.pct * 100) + ' %)</span>' +
                '<span class="breakdown-right pos">+ ' + fmtCHF(amt) + '</span>' +
            '</div>';
        });

        if (costAI > 0) {
            html += '<div class="breakdown-row" style="animation-delay:' + (active.length * 40) + 'ms">' +
                '<span class="breakdown-left">' + t('aiInvestment') + '</span>' +
                '<span class="breakdown-right neg">− ' + fmtCHF(costAI) + '</span>' +
            '</div>';
        }

        D.detailed.innerHTML = html;
    }

    /* ═══════ ROI ═══════ */
    function renderROI(roiPct, payback, costAI, net) {
        if (costAI <= 0) { D.roi.innerHTML = ''; D.roi.className = ''; return; }
        D.roi.className = 'roi';

        var payTxt;
        if (payback <= 1) payTxt = '1 ' + t('month');
        else if (payback <= 12) payTxt = payback + ' ' + t('months');
        else payTxt = (payback / 12).toFixed(1) + ' ' + t('years');

        var roiColor = roiPct >= 100 ? 'var(--success)' : roiPct >= 0 ? 'var(--warning)' : 'var(--danger)';
        var netColor = net >= 0 ? 'var(--success)' : 'var(--danger)';

        D.roi.innerHTML =
            '<h3 class="roi-title">' + t('roi') + '</h3>' +
            '<div class="roi-grid">' +
                '<div class="roi-item">' +
                    '<div class="roi-val" style="color:' + roiColor + '">' + Math.round(roiPct) + ' %</div>' +
                    '<div class="roi-label">' + t('roiLabel') + '</div>' +
                '</div>' +
                '<div class="roi-item">' +
                    '<div class="roi-val">' + payTxt + '</div>' +
                    '<div class="roi-label">' + t('paybackPeriod') + '</div>' +
                '</div>' +
                '<div class="roi-item">' +
                    '<div class="roi-val">' + fmtCHF(costAI) + '</div>' +
                    '<div class="roi-label">' + t('investment') + '</div>' +
                '</div>' +
                '<div class="roi-item">' +
                    '<div class="roi-val" style="color:' + netColor + '">' + fmtCHF(net) + '</div>' +
                    '<div class="roi-label">' + t('netProfit') + '</div>' +
                '</div>' +
            '</div>';
    }

    /* ═══════ BOOT ═══════ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
