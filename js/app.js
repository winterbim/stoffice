/* ═══════════════════════════════════════════════════════
   STOFFICE v6.0 — Logic + i18n + Dalux API + Sankey
   Smart Building AI Calculator
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ═══════ i18n DICTIONARIES ═══════ */
    const I18N = {
        de: {
            title: 'Smart Building <em>AI</em>',
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

            // Dalux
            daluxTitle: 'Dalux API Verbindung',
            daluxFmSub: 'Facility Management API',
            daluxBuildSub: 'Field / Handover API',
            apiKey: 'API-Schlüssel (X-API-KEY)',
            baseUrl: 'Base URL',
            testConnection: 'Verbindung testen',
            disconnected: 'Getrennt',
            connected: 'Verbunden',
            connecting: 'Verbinde…',
            daluxHint: 'Ihre API-Schlüssel werden nur lokal in Ihrem Browser gespeichert und niemals an unsere Server übertragen.',
            daluxDataTitle: 'Dalux Live-Daten',

            // Sankey
            sankeyTitle: 'Handover-Analyse — Kritische Pfade',
            sankeyDesc: 'Diagramm der Datenflüsse vom Handover zur Wartung. Identifiziert Engpässe und Blockierpunkte.',

            // Footer
            copyright: '© 2025–2026 Stoffice / Simone J. Stocker – MAS Real Estate',
            disclaimer: 'Alle Angaben ohne Gewähr. Werte dienen zur Veranschaulichung & Testzwecken.',
            sidebarVersion: 'v6.0 – CAS These HWZ 2026',
            toastReset: 'Formular zurückgesetzt',
            toastExport: 'Druckvorschau wird geöffnet…',
            toastLangDE: 'Sprache: Deutsch',
            toastLangFR: 'Langue : Français',
            toastDarkOn: 'Dark Mode aktiviert',
            toastDarkOff: 'Light Mode aktiviert',
        },

        fr: {
            title: 'Smart Building <em>IA</em>',
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

            // Dalux
            daluxTitle: 'Connexion API Dalux',
            daluxFmSub: 'API Facility Management',
            daluxBuildSub: 'API Field / Handover',
            apiKey: 'Clé API (X-API-KEY)',
            baseUrl: 'URL de base',
            testConnection: 'Tester la connexion',
            disconnected: 'Déconnecté',
            connected: 'Connecté',
            connecting: 'Connexion…',
            daluxHint: 'Vos clés API sont stockées uniquement dans votre navigateur et ne sont jamais transmises à nos serveurs.',
            daluxDataTitle: 'Données Dalux en direct',

            // Sankey
            sankeyTitle: 'Analyse Handover — Chemins critiques',
            sankeyDesc: 'Diagramme des flux de données du handover à la maintenance. Identifie les goulots d\'étranglement et points bloquants.',

            copyright: '© 2025–2026 Stoffice / Simone J. Stocker – MAS Real Estate',
            disclaimer: 'Sans garantie. Les valeurs servent uniquement à des fins d\'illustration et de test.',
            sidebarVersion: 'v6.0 – CAS Thèse HWZ 2026',
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
        optZwilling: { pct: 0.75, key: 'digitalTwinFactor', color: '#00c8aa' },
        optAssets:   { pct: 0.10, key: 'assetsLinkedFactor', color: '#60a5fa' },
        optDoku:     { pct: 0.05, key: 'docFactor',          color: '#a87ad4' },
        optAuto:     { pct: 0.10, key: 'autoFactor',         color: '#d4a843' },
    };

    const DEFAULTS = {
        daysPerYear: 250, incidentsPerDay: 30, minutesPerIncident: 48,
        hourlyRate: 85, costAI: 0,
        optZwilling: false, optAssets: false, optDoku: false, optAuto: false,
    };

    /* ═══════ DOM ═══════ */
    const $ = function (s) { return document.querySelector(s); };
    const $$ = function (s) { return document.querySelectorAll(s); };
    const D = {};

    function cacheDom() {
        D.form        = $('#calculation-form');
        D.content     = $('#results-content');
        D.placeholder = $('#resultsPlaceholder');
        D.hero        = $('#heroMetric');
        D.metrics     = $('#metricsRow');
        D.detailed    = $('#detailedResults');
        D.roi         = $('#roiSection');
        D.resetBtn    = $('#resetBtn');
        D.darkToggle  = $('#darkModeToggle');
        D.darkIcon    = $('#darkModeIcon');
        D.exportBtn   = $('#exportPdf');
        D.meter       = $('#savingsBarContainer');
        D.meterFill   = $('#savingsBarFill');
        D.meterPct    = $('#savingsBarPercent');
        D.toasts      = $('#toastContainer');
        D.tooltip     = $('#customTooltip');
        D.langBtns    = $$('[data-lang-btn]');
        D.toggleRows  = $$('.toggle-row');
        // Dalux
        D.daluxToggle = $('#daluxConfigToggle');
        D.daluxPanel  = $('#daluxPanel');
        D.daluxClose  = $('#daluxPanelClose');
        D.fmKey       = $('#daluxFmKey');
        D.fmUrl       = $('#daluxFmUrl');
        D.buildKey    = $('#daluxBuildKey');
        D.buildUrl    = $('#daluxBuildUrl');
        D.fmStatus    = $('#fmStatus');
        D.buildStatus = $('#buildStatus');
        D.fmResult    = $('#fmResult');
        D.buildResult = $('#buildResult');
        D.testFm      = $('#testFmConnection');
        D.testBuild   = $('#testBuildConnection');
        D.toggleFmVis = $('#toggleFmKeyVis');
        D.toggleBuildVis = $('#toggleBuildKeyVis');
        // Sankey
        D.sankeySection = $('#sankeySection');
        D.sankeyChart   = $('#sankeyChart');
        D.sankeyLegend  = $('#sankeyLegend');
        // Dalux data
        D.daluxDataSection = $('#daluxDataSection');
        D.daluxDataGrid    = $('#daluxDataGrid');
    }

    /* ═══════ INIT ═══════ */
    function init() {
        cacheDom();
        loadTheme();
        loadLang();
        loadFormState();
        loadDaluxConfig();
        bindEvents();
        calc();
    }

    /* ═══════ i18n ═══════ */
    function t(k) { return I18N[currentLang]?.[k] ?? I18N.de[k] ?? k; }

    function applyI18n() {
        $$('[data-i18n]').forEach(function (el) {
            var key = el.dataset.i18n;
            var txt = t(key);
            if (key === 'title') {
                el.innerHTML = txt;
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
        D.langBtns.forEach(function (b) { b.classList.toggle('active', b.dataset.langBtn === lang); });
        applyI18n();
        calc();
    }

    function loadLang() {
        var s = localStorage.getItem('stoffice-lang');
        if (s && I18N[s]) currentLang = s;
        setLang(currentLang);
    }

    /* ═══════ DARK MODE ═══════ */
    function toggleTheme() {
        var isDark = document.documentElement.dataset.theme === 'dark';
        var next = isDark ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        D.darkIcon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        localStorage.setItem('stoffice-theme', next);
        toast(isDark ? t('toastDarkOff') : t('toastDarkOn'));
        calc();
    }

    function loadTheme() {
        var s = localStorage.getItem('stoffice-theme');
        if (!s) s = 'dark'; // default dark
        document.documentElement.dataset.theme = s;
        D.darkIcon.className = s === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    /* ═══════ TOAST ═══════ */
    function toast(msg) {
        var el = document.createElement('div');
        el.className = 'toast';
        el.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + msg;
        D.toasts.appendChild(el);
        setTimeout(function () { el.classList.add('toast-exit'); setTimeout(function () { el.remove(); }, 250); }, 2200);
    }

    /* ═══════ TOOLTIP ═══════ */
    function showTip(trigger, text) {
        D.tooltip.textContent = text;
        D.tooltip.classList.add('visible');
        var r = trigger.getBoundingClientRect();
        var tt = D.tooltip.getBoundingClientRect();
        var left = r.left + r.width / 2 - tt.width / 2;
        var top = r.bottom + 8;
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
            var s = localStorage.getItem('stoffice-form');
            if (!s) return;
            var d = JSON.parse(s);
            ['daysPerYear','incidentsPerDay','minutesPerIncident','hourlyRate','costAI'].forEach(function (k) {
                var el = document.getElementById(k);
                if (el && d[k] !== undefined) el.value = d[k];
            });
            ['optZwilling','optAssets','optDoku','optAuto'].forEach(function (k) {
                var el = document.getElementById(k);
                if (el && d[k] !== undefined) el.checked = d[k];
            });
            // Sync toggle row active states
            D.toggleRows.forEach(function (row) {
                var id = row.dataset.toggle;
                var cb = document.getElementById(id);
                if (cb) row.classList.toggle('active', cb.checked);
            });
        } catch (e) { /* ignore */ }
    }

    function resetForm() {
        Object.entries(DEFAULTS).forEach(function (entry) {
            var k = entry[0], v = entry[1];
            var el = document.getElementById(k);
            if (!el) return;
            if (typeof v === 'boolean') el.checked = v; else el.value = v;
        });
        D.toggleRows.forEach(function (row) { row.classList.remove('active'); });
        localStorage.removeItem('stoffice-form');
        calc();
        toast(t('toastReset'));
    }

    /* ═══════ FORMAT ═══════ */
    function fmtCHF(n) {
        return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n);
    }
    function fmtN(n) { return new Intl.NumberFormat('de-CH').format(Math.round(n)); }

    /* ═══════ COUNTER ANIMATION ═══════ */
    function countUp(el, target, formatter) {
        if (!el) return;
        var dur = 600;
        var t0 = performance.now();
        (function tick(now) {
            var p = Math.min((now - t0) / dur, 1);
            var ease = 1 - Math.pow(1 - p, 4);
            el.textContent = formatter(Math.round(target * ease));
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = formatter(target);
        })(t0);
    }

    /* ═══════ DEBOUNCE ═══════ */
    function debounce(fn, ms) {
        var timer;
        return function () { clearTimeout(timer); timer = setTimeout(fn, ms); };
    }

    /* ═══════ EVENTS ═══════ */
    function bindEvents() {
        var auto = debounce(function () { saveForm(); calc(); }, 100);

        // Form inputs
        D.form.querySelectorAll('input[type="number"]').forEach(function (inp) {
            inp.addEventListener('input', auto);
            inp.addEventListener('change', function () { saveForm(); calc(); });
        });

        D.form.addEventListener('submit', function (e) { e.preventDefault(); calc(); });
        D.resetBtn.addEventListener('click', resetForm);
        D.darkToggle.addEventListener('click', toggleTheme);

        D.exportBtn.addEventListener('click', function () {
            toast(t('toastExport'));
            setTimeout(function () { print(); }, 350);
        });

        // Language
        D.langBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var lang = btn.dataset.langBtn;
                if (lang !== currentLang) {
                    setLang(lang);
                    toast(lang === 'fr' ? t('toastLangFR') : t('toastLangDE'));
                }
            });
        });

        // Toggle rows — click on entire row to toggle checkbox
        D.toggleRows.forEach(function (row) {
            row.addEventListener('click', function (e) {
                if (e.target.closest('.info-btn')) return; // don't toggle if clicking info
                var id = row.dataset.toggle;
                var cb = document.getElementById(id);
                if (cb) {
                    cb.checked = !cb.checked;
                    row.classList.toggle('active', cb.checked);
                    saveForm();
                    calc();
                }
            });
        });

        // Tooltips
        $$('.toggle-tooltip-trigger').forEach(function (tr) {
            var key = tr.dataset.tooltipKey;
            tr.addEventListener('mouseenter', function (e) { e.stopPropagation(); showTip(tr, t(key)); });
            tr.addEventListener('mouseleave', hideTip);
            tr.addEventListener('focus', function () { showTip(tr, t(key)); });
            tr.addEventListener('blur', hideTip);
            tr.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); });
        });

        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideTip(); });

        // Dalux panel
        D.daluxToggle.addEventListener('click', function () {
            D.daluxPanel.classList.toggle('hidden');
        });
        D.daluxClose.addEventListener('click', function () {
            D.daluxPanel.classList.add('hidden');
        });

        // Dalux key visibility
        D.toggleFmVis.addEventListener('click', function () {
            var inp = D.fmKey;
            var isPass = inp.type === 'password';
            inp.type = isPass ? 'text' : 'password';
            this.querySelector('i').className = isPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        });
        D.toggleBuildVis.addEventListener('click', function () {
            var inp = D.buildKey;
            var isPass = inp.type === 'password';
            inp.type = isPass ? 'text' : 'password';
            this.querySelector('i').className = isPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        });

        // Dalux test connections
        D.testFm.addEventListener('click', function () { testDaluxConnection('fm'); });
        D.testBuild.addEventListener('click', function () { testDaluxConnection('build'); });

        // Save Dalux config on change
        [D.fmKey, D.fmUrl, D.buildKey, D.buildUrl].forEach(function (inp) {
            inp.addEventListener('change', saveDaluxConfig);
        });
    }

    /* ═══════════════════════════════════
       CALCULATION ENGINE
       ═══════════════════════════════════ */
    function calc() {
        var v = vals();
        if (v.daysPerYear <= 0 || v.incidentsPerDay <= 0 || v.minutesPerIncident <= 0 || v.hourlyRate <= 0) {
            showPlaceholder(); updateMeter(0); return;
        }

        var hrsDay  = (v.incidentsPerDay * v.minutesPerIncident) / 60;
        var hrsYear = hrsDay * v.daysPerYear;
        var costNow = hrsYear * v.hourlyRate;

        var active = [];
        var totalPct = 0;
        Object.entries(OPT).forEach(function (entry) {
            var k = entry[0], o = entry[1];
            if (v[k]) { active.push(Object.assign({}, o, { k: k })); totalPct += o.pct; }
        });
        totalPct = Math.min(totalPct, 1);

        var gross   = costNow * totalPct;
        var net     = gross - v.costAI;
        var costNew = costNow - net;
        var hrsNew  = hrsYear * (1 - totalPct);
        var roiPct  = v.costAI > 0 ? (net / v.costAI) * 100 : 0;
        var payback = (v.costAI > 0 && gross > 0) ? Math.ceil((v.costAI / gross) * 12) : 0;

        updateMeter(totalPct);

        if (active.length === 0) { showPlaceholder(); hideSankey(); return; }

        hidePlaceholder();
        renderSavings(net, totalPct);
        renderDataStrip(costNow, costNew, hrsYear, hrsNew);
        renderBarChart(costNow, costNew, v.costAI);
        renderDonut(active, costNow);
        renderBreakdown(active, costNow, v.costAI);
        renderROI(roiPct, payback, v.costAI, net);
        renderSankey(active, costNow);
    }

    function showPlaceholder() { D.placeholder.style.display = 'flex'; D.content.classList.add('hidden'); }
    function hidePlaceholder() { D.placeholder.style.display = 'none';  D.content.classList.remove('hidden'); }

    function updateMeter(pct) {
        var p = Math.round(pct * 100);
        D.meterFill.style.width = p + '%';
        D.meterPct.textContent = p + ' %';
    }

    /* ═══════ SAVINGS DISPLAY ═══════ */
    function renderSavings(net, pct) {
        D.hero.innerHTML =
            '<span class="savings-eyebrow">' + t('heroEyebrow') + '</span>' +
            '<span class="savings-amount" id="heroValue"></span>' +
            '<span class="savings-tag">' +
                '<span class="badge">' +
                    '<i class="fa-solid fa-arrow-down"></i> ' +
                    Math.round(pct * 100) + ' % ' + t('optimization') +
                '</span>' +
                '&nbsp; ' + t('perYear') +
            '</span>';
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
        countUp($('#dHours'),   Math.round(hrsNow - hrsNew), function (n) { return fmtN(n) + ' ' + t('hours'); });
    }

    /* ═══════ BAR CHART ═══════ */
    function renderBarChart(costNow, costNew, costAI) {
        var dark = document.documentElement.dataset.theme === 'dark';
        var txt  = dark ? '#8b949e' : '#57606a';
        var grid = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';

        var canvas = $('#barChart');
        if (barChart) barChart.destroy();

        var labels = [t('chartCurrent'), t('chartOptimized')];
        var data   = [costNow, Math.max(0, costNew)];
        var bg     = [
            dark ? 'rgba(248,113,113,0.15)' : 'rgba(248,113,113,0.1)',
            dark ? 'rgba(0,200,170,0.15)' : 'rgba(0,200,170,0.1)'
        ];
        var border = ['#f87171', '#00c8aa'];

        if (costAI > 0) {
            labels.push(t('chartAI'));
            data.push(costAI);
            bg.push(dark ? 'rgba(212,168,67,0.15)' : 'rgba(212,168,67,0.1)');
            border.push('#d4a843');
        }

        barChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: t('chartLabel'), data: data,
                    backgroundColor: bg, borderColor: border,
                    borderWidth: 2, borderRadius: 6, borderSkipped: false
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: { label: function (c) { return fmtCHF(c.raw); } },
                        backgroundColor: dark ? '#1b2530' : '#fff',
                        titleColor: txt, bodyColor: txt,
                        borderColor: dark ? '#22303e' : '#e4e8ec', borderWidth: 1, padding: 12,
                        titleFont: { family: 'Inter', weight: '700', size: 12 },
                        bodyFont:  { family: 'Inter', size: 12 },
                        cornerRadius: 8,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true, grid: { color: grid },
                        ticks: { color: txt, font: { family: 'Inter', weight: '600', size: 10 }, callback: function (v) { return fmtCHF(v); } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: txt, font: { family: 'Inter', weight: '700', size: 11 } }
                    }
                },
                animation: { duration: 700, easing: 'easeOutQuart' }
            }
        });
    }

    /* ═══════ DONUT CHART ═══════ */
    function renderDonut(active, costNow) {
        var dark = document.documentElement.dataset.theme === 'dark';
        var txt  = dark ? '#8b949e' : '#57606a';

        var canvas = $('#donutChart');
        if (donutChart) donutChart.destroy();

        var labels = active.map(function (s) { return t(s.key); });
        var data   = active.map(function (s) { return Math.round(costNow * s.pct); });
        var colors = active.map(function (s) { return s.color; });

        donutChart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.map(function (c) { return c + (dark ? '30' : '20'); }),
                    borderColor: colors,
                    borderWidth: 2, hoverOffset: 6
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: true, cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: txt, padding: 14, usePointStyle: true, pointStyleWidth: 8,
                            font: { family: 'Inter', weight: '600', size: 10 }
                        }
                    },
                    tooltip: {
                        callbacks: { label: function (c) { return c.label + ': ' + fmtCHF(c.raw); } },
                        backgroundColor: dark ? '#1b2530' : '#fff',
                        titleColor: txt, bodyColor: txt,
                        borderColor: dark ? '#22303e' : '#e4e8ec', borderWidth: 1, padding: 12,
                        cornerRadius: 8,
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
            html += '<div class="breakdown-row" style="animation-delay:' + (i * 50) + 'ms">' +
                '<span class="breakdown-left">' + t(s.key) + ' (' + Math.round(s.pct * 100) + ' %)</span>' +
                '<span class="breakdown-right pos">+ ' + fmtCHF(amt) + '</span>' +
            '</div>';
        });
        if (costAI > 0) {
            html += '<div class="breakdown-row" style="animation-delay:' + (active.length * 50) + 'ms">' +
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
                '<div class="roi-item"><div class="roi-val" style="color:' + roiColor + '">' + Math.round(roiPct) + ' %</div><div class="roi-label">' + t('roiLabel') + '</div></div>' +
                '<div class="roi-item"><div class="roi-val">' + payTxt + '</div><div class="roi-label">' + t('paybackPeriod') + '</div></div>' +
                '<div class="roi-item"><div class="roi-val">' + fmtCHF(costAI) + '</div><div class="roi-label">' + t('investment') + '</div></div>' +
                '<div class="roi-item"><div class="roi-val" style="color:' + netColor + '">' + fmtCHF(net) + '</div><div class="roi-label">' + t('netProfit') + '</div></div>' +
            '</div>';
    }

    /* ═══════════════════════════════════
       SANKEY DIAGRAM — Handover Analysis
       ═══════════════════════════════════ */
    function hideSankey() {
        D.sankeySection.classList.add('hidden');
    }

    function renderSankey(active, costNow) {
        D.sankeySection.classList.remove('hidden');

        // Clear previous
        D.sankeyChart.innerHTML = '';
        D.sankeyLegend.innerHTML = '';

        var width = D.sankeyChart.clientWidth - 40;
        var height = 400;

        // Build Sankey data: Handover → Factors → Impact
        var nodes = [
            { id: 'handover',   name: currentLang === 'fr' ? 'Handover Dalux' : 'Handover Dalux' },
            { id: 'dtwin',      name: t('digitalTwinFactor') },
            { id: 'assets',     name: t('assetsLinkedFactor') },
            { id: 'docs',       name: t('docFactor') },
            { id: 'automation', name: t('autoFactor') },
            { id: 'savings',    name: currentLang === 'fr' ? 'Économies réalisées' : 'Realisierte Einsparungen' },
            { id: 'remaining',  name: currentLang === 'fr' ? 'Coûts restants' : 'Verbleibende Kosten' },
            { id: 'blocked',    name: currentLang === 'fr' ? 'Points bloquants' : 'Blockierpunkte' },
        ];

        var links = [];
        var factorMap = {
            optZwilling: 'dtwin',
            optAssets: 'assets',
            optDoku: 'docs',
            optAuto: 'automation'
        };

        // From handover to each factor
        active.forEach(function (s) {
            var val = costNow * s.pct;
            links.push({ source: 'handover', target: factorMap[s.k], value: val });
            links.push({ source: factorMap[s.k], target: 'savings', value: val * 0.85 });
            links.push({ source: factorMap[s.k], target: 'blocked', value: val * 0.15 });
        });

        // Inactive factors flow to remaining costs
        var inactiveTotal = 0;
        Object.entries(OPT).forEach(function (entry) {
            var k = entry[0], o = entry[1];
            var isActive = active.some(function (a) { return a.k === k; });
            if (!isActive) {
                inactiveTotal += costNow * o.pct;
            }
        });
        if (inactiveTotal > 0) {
            links.push({ source: 'handover', target: 'remaining', value: inactiveTotal });
        }

        // Add base remaining cost (non-optimizable)
        // Always show some flow to remaining
        if (links.filter(function(l) { return l.target === 'remaining'; }).length === 0) {
            links.push({ source: 'handover', target: 'remaining', value: costNow * 0.01 });
        }

        // Filter out zero-value links
        links = links.filter(function (l) { return l.value > 0; });

        // Node index map
        var nodeIndex = {};
        nodes.forEach(function (n, i) { nodeIndex[n.id] = i; });

        // Colors for nodes
        var nodeColors = {
            handover: '#60a5fa',
            dtwin: '#00c8aa',
            assets: '#60a5fa',
            docs: '#a87ad4',
            automation: '#d4a843',
            savings: '#2dd4a0',
            remaining: '#f87171',
            blocked: '#f0b429',
        };

        // D3 Sankey
        var svg = d3.select(D.sankeyChart)
            .append('svg')
            .attr('width', width + 40)
            .attr('height', height + 20)
            .append('g')
            .attr('transform', 'translate(20,10)');

        var sankey = d3.sankey()
            .nodeWidth(20)
            .nodePadding(16)
            .nodeAlign(d3.sankeyLeft)
            .extent([[0, 0], [width, height]]);

        var graph = sankey({
            nodes: nodes.map(function (n) { return Object.assign({}, n); }),
            links: links.map(function (l) {
                return { source: nodeIndex[l.source], target: nodeIndex[l.target], value: l.value };
            })
        });

        // Links
        var link = svg.append('g')
            .selectAll('.sankey-link')
            .data(graph.links)
            .join('path')
            .attr('class', 'sankey-link')
            .attr('d', d3.sankeyLinkHorizontal())
            .attr('fill', 'none')
            .attr('stroke', function (d) { return nodeColors[nodes[d.source.index].id] || '#8b949e'; })
            .attr('stroke-opacity', 0.3)
            .attr('stroke-width', function (d) { return Math.max(2, d.width); })
            .style('transition', 'stroke-opacity 0.25s ease');

        link.on('mouseenter', function () { d3.select(this).attr('stroke-opacity', 0.6); })
            .on('mouseleave', function () { d3.select(this).attr('stroke-opacity', 0.3); });

        // Link tooltips
        link.append('title')
            .text(function (d) {
                return nodes[d.source.index].name + ' → ' + nodes[d.target.index].name + ': ' + fmtCHF(d.value);
            });

        // Nodes
        var node = svg.append('g')
            .selectAll('.sankey-node')
            .data(graph.nodes)
            .join('g')
            .attr('class', 'sankey-node');

        node.append('rect')
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('height', function (d) { return Math.max(2, d.y1 - d.y0); })
            .attr('width', sankey.nodeWidth())
            .attr('fill', function (d) { return nodeColors[nodes[d.index].id] || '#8b949e'; })
            .attr('rx', 4)
            .attr('opacity', 0.9);

        // Node labels
        node.append('text')
            .attr('x', function (d) { return d.x0 < width / 2 ? d.x1 + 8 : d.x0 - 8; })
            .attr('y', function (d) { return (d.y1 + d.y0) / 2; })
            .attr('dy', '0.35em')
            .attr('text-anchor', function (d) { return d.x0 < width / 2 ? 'start' : 'end'; })
            .attr('fill', function () {
                return document.documentElement.dataset.theme === 'dark' ? '#c9d1d9' : '#24292f';
            })
            .attr('font-size', '12px')
            .attr('font-family', 'Inter, sans-serif')
            .attr('font-weight', '600')
            .text(function (d) { return d.name; });

        // Node value labels
        node.append('text')
            .attr('x', function (d) { return d.x0 < width / 2 ? d.x1 + 8 : d.x0 - 8; })
            .attr('y', function (d) { return (d.y1 + d.y0) / 2 + 16; })
            .attr('text-anchor', function (d) { return d.x0 < width / 2 ? 'start' : 'end'; })
            .attr('fill', function () {
                return document.documentElement.dataset.theme === 'dark' ? '#8b949e' : '#57606a';
            })
            .attr('font-size', '10px')
            .attr('font-family', 'JetBrains Mono, monospace')
            .text(function (d) { return d.value > 0 ? fmtCHF(d.value) : ''; });

        // Legend
        var legendItems = [
            { color: '#60a5fa', label: 'Handover Dalux' },
            { color: '#00c8aa', label: t('digitalTwinFactor') },
            { color: '#2dd4a0', label: currentLang === 'fr' ? 'Économies' : 'Einsparungen' },
            { color: '#f0b429', label: currentLang === 'fr' ? 'Points bloquants' : 'Blockierpunkte' },
            { color: '#f87171', label: currentLang === 'fr' ? 'Coûts restants' : 'Verbleibende Kosten' },
        ];

        legendItems.forEach(function (item) {
            D.sankeyLegend.innerHTML +=
                '<div class="sankey-legend-item">' +
                    '<span class="sankey-legend-dot" style="background:' + item.color + '"></span>' +
                    '<span>' + item.label + '</span>' +
                '</div>';
        });
    }

    /* ═══════════════════════════════════
       DALUX API CONNECTION (via Vercel proxy)
       ═══════════════════════════════════ */
    var PROXY_URL = '/api/dalux/proxy';

    function daluxFetch(apiKey, baseUrl, endpoint) {
        return fetch(PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey: apiKey, baseUrl: baseUrl, endpoint: endpoint })
        }).then(function (r) {
            if (!r.ok) {
                return r.json().then(function (err) {
                    throw new Error(err.error || 'HTTP ' + r.status);
                });
            }
            return r.json();
        });
    }

    function saveDaluxConfig() {
        var config = {
            fmKey: D.fmKey.value,
            fmUrl: D.fmUrl.value,
            buildKey: D.buildKey.value,
            buildUrl: D.buildUrl.value,
        };
        localStorage.setItem('stoffice-dalux', JSON.stringify(config));
    }

    function loadDaluxConfig() {
        try {
            var s = localStorage.getItem('stoffice-dalux');
            if (!s) return;
            var c = JSON.parse(s);
            if (c.fmKey) D.fmKey.value = c.fmKey;
            if (c.fmUrl) D.fmUrl.value = c.fmUrl;
            if (c.buildKey) D.buildKey.value = c.buildKey;
            if (c.buildUrl) D.buildUrl.value = c.buildUrl;
        } catch (e) { /* ignore */ }
    }

    function testDaluxConnection(type) {
        var key, url, statusEl, resultEl, endpoint;

        if (type === 'fm') {
            key = D.fmKey.value.trim();
            url = D.fmUrl.value.trim();
            statusEl = D.fmStatus;
            resultEl = D.fmResult;
            endpoint = '2.0/buildings';
        } else {
            key = D.buildKey.value.trim();
            url = D.buildUrl.value.trim();
            statusEl = D.buildStatus;
            resultEl = D.buildResult;
            endpoint = '5.0/projects';
        }

        if (!key) {
            showDaluxResult(resultEl, 'error', currentLang === 'fr' ? 'Veuillez saisir une clé API' : 'Bitte geben Sie einen API-Schlüssel ein');
            return;
        }

        statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>' + t('connecting') + '</span>';
        statusEl.className = 'dalux-status';
        saveDaluxConfig();

        daluxFetch(key, url, endpoint)
            .then(function (data) {
                statusEl.innerHTML = '<i class="fa-solid fa-circle"></i> <span>' + t('connected') + '</span>';
                statusEl.className = 'dalux-status connected';

                var count = extractCount(data);

                var msg = type === 'fm'
                    ? (currentLang === 'fr' ? 'Connecté ! ' + count + ' bâtiment(s) trouvé(s).' : 'Verbunden! ' + count + ' Gebäude gefunden.')
                    : (currentLang === 'fr' ? 'Connecté ! ' + count + ' projet(s) trouvé(s).' : 'Verbunden! ' + count + ' Projekt(e) gefunden.');

                showDaluxResult(resultEl, 'success', msg);
                toast(msg);

                if (type === 'fm') {
                    loadDaluxFmData(key, url);
                }
                if (type === 'build') {
                    loadDaluxBuildData(key, url, data);
                }
            })
            .catch(function (err) {
                statusEl.innerHTML = '<i class="fa-solid fa-circle"></i> <span>' + t('disconnected') + '</span>';
                statusEl.className = 'dalux-status';

                var errMsg = err.message;
                if (errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError')) {
                    errMsg = currentLang === 'fr'
                        ? 'Erreur réseau — le proxy serverless est peut-être indisponible.'
                        : 'Netzwerkfehler — der Serverless-Proxy ist möglicherweise nicht verfügbar.';
                }
                showDaluxResult(resultEl, 'error', errMsg);
            });
    }

    function extractCount(data) {
        if (Array.isArray(data)) return data.length;
        if (data && data.items) return data.items.length;
        if (data && data.data) return data.data.length;
        return 0;
    }

    function showDaluxResult(el, type, msg) {
        el.classList.remove('hidden', 'success', 'error');
        el.classList.add(type);
        el.innerHTML = '<i class="fa-solid ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle') + '"></i> ' + msg;
    }

    /* ═══════ LOAD DALUX FM DATA ═══════ */
    function loadDaluxFmData(key, url) {
        D.daluxDataSection.classList.remove('hidden');
        D.daluxDataGrid.innerHTML = '<div class="dalux-stat-card"><p style="color:var(--text-2)"><i class="fa-solid fa-spinner fa-spin"></i> ' + (currentLang === 'fr' ? 'Chargement des données…' : 'Daten werden geladen…') + '</p></div>';

        var stats = { buildings: 0, assets: 0, workorders: 0, tickets: 0 };

        var fetchBuildings = daluxFetch(key, url, '2.0/buildings')
            .then(function (d) { stats.buildings = extractCount(d); })
            .catch(function () { stats.buildings = '—'; });

        var fetchWO = daluxFetch(key, url, '2.2/workorders')
            .then(function (d) { stats.workorders = extractCount(d); })
            .catch(function () { stats.workorders = '—'; });

        var fetchAssets = daluxFetch(key, url, '2.0/assets')
            .then(function (d) { stats.assets = extractCount(d); })
            .catch(function () { stats.assets = '—'; });

        var fetchTickets = daluxFetch(key, url, '2.0/tickets')
            .then(function (d) { stats.tickets = extractCount(d); })
            .catch(function () { stats.tickets = '—'; });

        Promise.all([fetchBuildings, fetchWO, fetchAssets, fetchTickets]).then(function () {
            renderDaluxData(stats);
        });
    }

    /* ═══════ LOAD DALUX BUILD DATA ═══════ */
    function loadDaluxBuildData(key, url, projectsData) {
        D.daluxDataSection.classList.remove('hidden');

        var projects = [];
        if (Array.isArray(projectsData)) projects = projectsData;
        else if (projectsData && projectsData.items) projects = projectsData.items;
        else if (projectsData && projectsData.data) projects = projectsData.data;

        var stats = {
            projects: projects.length,
            tasks: 0,
            forms: 0,
            companies: 0,
        };

        // If we have projects, fetch details from the first one
        if (projects.length > 0) {
            var pid = projects[0].projectId || projects[0].id || projects[0].Id;

            var fetchTasks = pid ? daluxFetch(key, url, '5.2/projects/' + pid + '/tasks')
                .then(function (d) { stats.tasks = extractCount(d); })
                .catch(function () { stats.tasks = '—'; }) : Promise.resolve();

            var fetchForms = pid ? daluxFetch(key, url, '2.2/projects/' + pid + '/forms')
                .then(function (d) { stats.forms = extractCount(d); })
                .catch(function () { stats.forms = '—'; }) : Promise.resolve();

            var fetchCompanies = pid ? daluxFetch(key, url, '3.1/projects/' + pid + '/companies')
                .then(function (d) { stats.companies = extractCount(d); })
                .catch(function () { stats.companies = '—'; }) : Promise.resolve();

            Promise.all([fetchTasks, fetchForms, fetchCompanies]).then(function () {
                renderBuildData(stats, projects);
            });
        } else {
            renderBuildData(stats, []);
        }
    }

    function renderDaluxData(stats) {
        var cards = [
            {
                icon: 'fa-building',
                color: '--info',
                bg: 'rgba(96,165,250,0.1)',
                value: stats.buildings,
                label: currentLang === 'fr' ? 'Bâtiments' : 'Gebäude',
                sub: 'DALUX FM'
            },
            {
                icon: 'fa-cube',
                color: '--accent',
                bg: 'rgba(0,200,170,0.1)',
                value: stats.assets,
                label: currentLang === 'fr' ? 'Équipements' : 'Anlagen',
                sub: 'ASSETS'
            },
            {
                icon: 'fa-wrench',
                color: '--gold',
                bg: 'rgba(212,168,67,0.1)',
                value: stats.workorders,
                label: currentLang === 'fr' ? 'Ordres de travail' : 'Arbeitsaufträge',
                sub: 'WORK ORDERS'
            },
            {
                icon: 'fa-ticket',
                color: '--coral',
                bg: 'rgba(232,115,90,0.1)',
                value: stats.tickets,
                label: currentLang === 'fr' ? 'Tickets' : 'Tickets',
                sub: 'TICKETS'
            }
        ];

        var html = '';
        cards.forEach(function (c) {
            html += '<div class="dalux-stat-card">' +
                '<div class="dalux-stat-icon" style="background:' + c.bg + ';color:var(' + c.color + ')">' +
                    '<i class="fa-solid ' + c.icon + '"></i>' +
                '</div>' +
                '<div class="dalux-stat-value">' + c.value + '</div>' +
                '<div class="dalux-stat-label">' + c.label + '</div>' +
                '<div class="dalux-stat-sub">' + c.sub + '</div>' +
            '</div>';
        });

        D.daluxDataGrid.innerHTML = html;
    }

    function renderBuildData(stats, projects) {
        var cards = [
            {
                icon: 'fa-helmet-safety',
                color: '--info',
                bg: 'rgba(96,165,250,0.1)',
                value: stats.projects,
                label: currentLang === 'fr' ? 'Projets' : 'Projekte',
                sub: 'DALUX BUILD'
            },
            {
                icon: 'fa-list-check',
                color: '--accent',
                bg: 'rgba(0,200,170,0.1)',
                value: stats.tasks,
                label: currentLang === 'fr' ? 'Tâches Field' : 'Field-Aufgaben',
                sub: 'TASKS'
            },
            {
                icon: 'fa-file-lines',
                color: '--plum',
                bg: 'rgba(168,122,212,0.1)',
                value: stats.forms,
                label: currentLang === 'fr' ? 'Formulaires' : 'Formulare',
                sub: 'FORMS'
            },
            {
                icon: 'fa-building-user',
                color: '--gold',
                bg: 'rgba(212,168,67,0.1)',
                value: stats.companies,
                label: currentLang === 'fr' ? 'Mandataires' : 'Mandanten',
                sub: 'COMPANIES'
            }
        ];

        var html = '';
        cards.forEach(function (c) {
            html += '<div class="dalux-stat-card">' +
                '<div class="dalux-stat-icon" style="background:' + c.bg + ';color:var(' + c.color + ')">' +
                    '<i class="fa-solid ' + c.icon + '"></i>' +
                '</div>' +
                '<div class="dalux-stat-value">' + c.value + '</div>' +
                '<div class="dalux-stat-label">' + c.label + '</div>' +
                '<div class="dalux-stat-sub">' + c.sub + '</div>' +
            '</div>';
        });

        // Project list
        if (projects.length > 0) {
            html += '<div class="dalux-stat-card" style="grid-column: 1 / -1">' +
                '<div class="dalux-stat-icon" style="background:rgba(0,200,170,0.1);color:var(--accent)">' +
                    '<i class="fa-solid fa-folder-open"></i>' +
                '</div>' +
                '<div class="dalux-stat-label" style="margin-bottom:8px">' + (currentLang === 'fr' ? 'Projets disponibles' : 'Verfügbare Projekte') + '</div>';

            projects.slice(0, 10).forEach(function (p) {
                var name = p.name || p.Name || p.projectName || '—';
                var id = p.projectId || p.id || p.Id || '';
                html += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--glass-border);font-size:1.3rem">' +
                    '<span style="color:var(--text-1)">' + name + '</span>' +
                    '<span style="font-family:var(--mono);font-size:1.1rem;color:var(--text-3)">' + id + '</span>' +
                '</div>';
            });

            if (projects.length > 10) {
                html += '<div style="padding-top:8px;font-size:1.2rem;color:var(--text-3)">+ ' + (projects.length - 10) + (currentLang === 'fr' ? ' autres projets…' : ' weitere Projekte…') + '</div>';
            }
            html += '</div>';
        }

        D.daluxDataGrid.innerHTML = html;
    }

    /* ═══════ BOOT ═══════ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
